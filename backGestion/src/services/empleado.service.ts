import bcrypt from 'bcrypt';
import prisma from '../prisma';
import type { empleado, Prisma } from '../generated/prisma/client';

const SALT_ROUNDS = 12;

type EmpleadoCreateInputWithPassword = Prisma.empleadoCreateInput & {
  password?: string;
};

type EmpleadoUpdateInputWithPassword = Prisma.empleadoUpdateInput & {
  password?: string;
};

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

// Factores de coste
const COSTE_EMPRESA_FACTOR = 1; // 30% de sobrecoste sobre el SBA
const ANNUAL_WORKING_HOURS = 1760; // 40h * 44 semanas aprox.

export type EmpleadoPaginatedResult = {
  items: empleado[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export const empleadoService = {
  async findAll(where?: Prisma.empleadoWhereInput, include?: Prisma.empleadoInclude): Promise<empleado[]> {
    return prisma.empleado.findMany({
      where,
      include,
      orderBy: [{ apellido: 'asc' }, { nombre: 'asc' }],
    });
  },

  async findPaginated(
    where: Prisma.empleadoWhereInput | undefined,
    include: Prisma.empleadoInclude | undefined,
    page: number = DEFAULT_PAGE,
    limit: number = DEFAULT_LIMIT,
  ): Promise<EmpleadoPaginatedResult> {
    const safePage = Math.max(1, Math.floor(page));
    const safeLimit = Math.min(MAX_LIMIT, Math.max(1, Math.floor(limit)));
    const skip = (safePage - 1) * safeLimit;

    // Siempre incluimos las asignaciones del empleado con su proyecto, además de lo que pida el caller
    const finalInclude: Prisma.empleadoInclude = {
      ...(include as Prisma.empleadoInclude | undefined),
      asignacion_proyecto_empleado: {
        include: {
          proyecto: true,
          rol_proyecto: true,
        },
      },
    };

    const [items, total] = await Promise.all([
      prisma.empleado.findMany({
        where,
        include: finalInclude,
        orderBy: [{ apellido: 'asc' }, { nombre: 'asc' }],
        skip,
        take: safeLimit,
      }),
      prisma.empleado.count({ where }),
    ]);

    return {
      items,
      total,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.ceil(total / safeLimit) || 1,
    };
  },

  async findById(id: number, include?: Prisma.empleadoInclude): Promise<empleado | null> {
    return prisma.empleado.findUnique({ where: { id }, include });
  },

  async findByCodigo(codigo_empleado: string): Promise<empleado | null> {
    return prisma.empleado.findUnique({ where: { codigo_empleado } });
  },

  async findByEmail(email: string): Promise<empleado | null> {
    return prisma.empleado.findFirst({ where: { email } });
  },

  async findByUsername(username: string): Promise<empleado | null> {
    return prisma.empleado.findUnique({ where: { username } });
  },

  async create(data: EmpleadoCreateInputWithPassword): Promise<empleado> {
    const { password, ...rest } = data;

    // Username: si no viene, se genera desde el local-part del email (ej. magonzalez@excelia.com → magonzalez)
    let username: string | undefined;
    if (rest.username != null && String(rest.username).trim() !== '') {
      username = String(rest.username).trim();
    } else if (rest.email != null && typeof rest.email === 'string') {
      const localPart = rest.email.split('@')[0]?.trim();
      if (localPart) {
        const base = localPart.toLowerCase();
        let candidate = base;
        let suffix = 0;
        while ((await this.findByUsername(candidate)) !== null) {
          suffix += 1;
          candidate = `${base}${suffix}`;
        }
        username = candidate;
      }
    }
    if (username !== undefined) {
      rest.username = username;
    }

    // Calculamos coste_empresa y coste_hora si viene informado el SBA
    let coste_empresa: number | undefined;
    let coste_hora: number | undefined;

    if (rest.sba !== undefined && rest.sba !== null) {
      const sbaNumber =
        typeof rest.sba === 'number' ? rest.sba : Number(rest.sba as unknown);

      if (!Number.isNaN(sbaNumber)) {
        coste_empresa = sbaNumber * COSTE_EMPRESA_FACTOR;
        coste_hora = coste_empresa / ANNUAL_WORKING_HOURS;
      }
    }

    // fecha_alta: Prisma acepta Date o string ISO; normalizamos a Date si viene como string
    const fechaAlta = rest.fecha_alta;
    const fechaAltaDate =
      fechaAlta instanceof Date
        ? fechaAlta
        : typeof fechaAlta === 'string'
          ? new Date(fechaAlta)
          : undefined;
    if (fechaAltaDate !== undefined) {
      rest.fecha_alta = fechaAltaDate;
    }

    const createData: Prisma.empleadoCreateInput = {
      ...rest,
      ...(coste_empresa !== undefined ? { coste_empresa } : {}),
      ...(coste_hora !== undefined ? { coste_hora } : {}),
      ...(password && typeof password === 'string'
        ? { password_hash: await bcrypt.hash(password, SALT_ROUNDS) }
        : {}),
    };

    return prisma.empleado.create({ data: createData });
  },

  async update(id: number, data: Prisma.empleadoUpdateInput): Promise<empleado> {
    const { password, ...rest } = data as EmpleadoUpdateInputWithPassword;

    // Normalizamos ids numéricos si llegan como string desde el front
    const intFields = ['perfil_id', 'dimension_id', 'modelo_contratacion_id', 'pais_id'] as const;
    for (const field of intFields) {
      const value = (rest as any)[field];
      if (typeof value === 'string') {
        const trimmed = value.trim();
        (rest as any)[field] = trimmed === '' ? undefined : Number(trimmed);
      }
    }

    // Normalizamos opcionales: string vacía => null (evita guardar "" en campos opcionales)
    const nullableStringFields = ['email', 'telefono', 'cv_url', 'razon_baja'] as const;
    for (const field of nullableStringFields) {
      const value = (rest as any)[field];
      if (value === '') (rest as any)[field] = null;
    }

    // Username: si no viene y se actualiza el email, se genera SOLO si el actual está vacío/null
    if (
      (rest as any).username === undefined &&
      typeof (rest as any).email === 'string' &&
      String((rest as any).email).trim() !== ''
    ) {
      const current = await this.findById(id);
      const currentUsername = current?.username != null ? String(current.username).trim() : '';

      if (currentUsername === '') {
        const localPart = String((rest as any).email).split('@')[0]?.trim();
        if (localPart) {
          const base = localPart.toLowerCase();
          let candidate = base;
          let suffix = 0;
          while ((await this.findByUsername(candidate)) !== null) {
            suffix += 1;
            candidate = `${base}${suffix}`;
          }
          (rest as any).username = candidate;
        }
      }
    } else if ((rest as any).username != null && String((rest as any).username).trim() !== '') {
      (rest as any).username = String((rest as any).username).trim();
    }

    // Calculamos coste_empresa y coste_hora si viene informado el SBA
    let coste_empresa: number | null | undefined;
    let coste_hora: number | null | undefined;

    const sba = (rest as any).sba;
    if (sba === null) {
      // Si se limpia el SBA, limpiamos también los costes derivados
      coste_empresa = null;
      coste_hora = null;
    } else if (typeof sba === 'number' || typeof sba === 'string') {
      const sbaNumber = typeof sba === 'number' ? sba : Number(sba);
      if (!Number.isNaN(sbaNumber)) {
        coste_empresa = sbaNumber * COSTE_EMPRESA_FACTOR;
        coste_hora = coste_empresa / ANNUAL_WORKING_HOURS;
      }
    }

    // Normalizamos fechas si vienen como string (Prisma acepta Date o string ISO)
    const fechaAlta = (rest as any).fecha_alta;
    if (typeof fechaAlta === 'string') {
      const d = new Date(fechaAlta);
      if (!Number.isNaN(d.getTime())) (rest as any).fecha_alta = d;
    }
    const fechaBaja = (rest as any).fecha_baja;
    if (typeof fechaBaja === 'string') {
      const d = new Date(fechaBaja);
      if (!Number.isNaN(d.getTime())) (rest as any).fecha_baja = d;
    }

    const updateData: Prisma.empleadoUpdateInput = {
      ...(rest as Prisma.empleadoUpdateInput),
      ...(coste_empresa !== undefined ? { coste_empresa } : {}),
      ...(coste_hora !== undefined ? { coste_hora } : {}),
      ...(password && typeof password === 'string'
        ? { password_hash: await bcrypt.hash(password, SALT_ROUNDS) }
        : {}),
    };

    return prisma.empleado.update({ where: { id }, data: updateData });
  },

  async delete(id: number): Promise<empleado> {
    return prisma.empleado.delete({ where: { id } });
  },
};
