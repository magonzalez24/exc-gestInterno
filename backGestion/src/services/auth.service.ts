import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { empleadoService } from './empleado.service';
import { sesionService } from './sesion.service';
import type { empleado } from '../generated/prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'secret-desarrollo-cambiar-en-produccion';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const SALT_ROUNDS = 10;

export type LoginInput = {
  username?: string;
  email?: string;
  password: string;
  ip_address?: string;
  user_agent?: string;
};

export type LoginResult = {
  token: string;
  empleado: Omit<empleado, 'password_hash'>;
  expiresAt: Date;
};

function omitPassword(emp: empleado): Omit<empleado, 'password_hash'> {
  const { password_hash, ...rest } = emp;
  return rest;
}

export const authService = {
  async login(input: LoginInput): Promise<LoginResult> {
    const { username, email, password, ip_address, user_agent } = input;

    if (!password) {
      throw new Error('La contraseña es requerida');
    }

    if (!username && !email) {
      throw new Error('Se requiere username o email');
    }

    // Buscar empleado por username o email
    let empleado: empleado | null = null;
    if (username) {
      empleado = await empleadoService.findByUsername(username);
    }
    if (!empleado && email) {
      empleado = await empleadoService.findByEmail(email);
    }

    if (!empleado) {
      throw new Error('Credenciales inválidas');
    }

    if (empleado.activo === false) {
      throw new Error('Usuario inactivo');
    }

    if (!empleado.password_hash) {
      throw new Error('Usuario sin contraseña configurada');
    }

    const passwordValido = await bcrypt.compare(password, empleado.password_hash);
    if (!passwordValido) {
      throw new Error('Credenciales inválidas');
    }

    // Calcular fecha de expiración
    const expiresAt = new Date();
    if (JWT_EXPIRES_IN.endsWith('d')) {
      const days = parseInt(JWT_EXPIRES_IN, 10);
      expiresAt.setDate(expiresAt.getDate() + days);
    } else if (JWT_EXPIRES_IN.endsWith('h')) {
      const hours = parseInt(JWT_EXPIRES_IN, 10);
      expiresAt.setHours(expiresAt.getHours() + hours);
    } else {
      expiresAt.setDate(expiresAt.getDate() + 7); // default 7 días
    }

    // Generar JWT
    const token = jwt.sign(
      {
        sub: empleado.id,
        empleado_id: empleado.id,
        username: empleado.username,
        exp: Math.floor(expiresAt.getTime() / 1000),
      },
      JWT_SECRET
    );

    // Crear sesión en BD
    await sesionService.create({
      empleado: { connect: { id: empleado.id } },
      token,
      fecha_expiracion: expiresAt,
      ip_address: ip_address || null,
      user_agent: user_agent || null,
    });

    // Actualizar último acceso
    await empleadoService.update(empleado.id, {
      fecha_ultimo_acceso: new Date(),
    });

    return {
      token,
      empleado: omitPassword(empleado),
      expiresAt,
    };
  },

  async logout(token: string): Promise<void> {
    await sesionService.invalidarPorToken(token);
  },

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  },

  async verifyToken(token: string): Promise<Omit<empleado, 'password_hash'> | null> {
    const sesion = await sesionService.findByToken(token);
    if (!sesion || !sesion.activa || sesion.fecha_expiracion < new Date()) {
      return null;
    }
    const emp = (sesion as { empleado?: empleado }).empleado;
    return emp ? omitPassword(emp) : null;
  },
};
