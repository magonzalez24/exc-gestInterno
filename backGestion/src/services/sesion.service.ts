import prisma from '../prisma';
import type { sesion, Prisma } from '../generated/prisma/client';

export const sesionService = {
  async findAll(where?: Prisma.sesionWhereInput): Promise<sesion[]> {
    return prisma.sesion.findMany({
      where,
      orderBy: { fecha_creacion: 'desc' },
    });
  },

  async findById(id: number): Promise<sesion | null> {
    return prisma.sesion.findUnique({ where: { id } });
  },

  async findByToken(token: string): Promise<sesion | null> {
    return prisma.sesion.findUnique({
      where: { token },
      include: { empleado: true },
    });
  },

  async findByEmpleado(empleado_id: number): Promise<sesion[]> {
    return prisma.sesion.findMany({
      where: { empleado_id },
      orderBy: { fecha_creacion: 'desc' },
    });
  },

  async findActivasByEmpleado(empleado_id: number): Promise<sesion[]> {
    return prisma.sesion.findMany({
      where: {
        empleado_id,
        activa: true,
        fecha_expiracion: { gt: new Date() },
      },
    });
  },

  async create(data: Prisma.sesionCreateInput): Promise<sesion> {
    return prisma.sesion.create({ data });
  },

  async update(id: number, data: Prisma.sesionUpdateInput): Promise<sesion> {
    return prisma.sesion.update({ where: { id }, data });
  },

  async invalidar(id: number): Promise<sesion> {
    return prisma.sesion.update({
      where: { id },
      data: { activa: false },
    });
  },

  async invalidarPorToken(token: string): Promise<sesion> {
    return prisma.sesion.update({
      where: { token },
      data: { activa: false },
    });
  },

  async invalidarTodasEmpleado(empleado_id: number): Promise<{ count: number }> {
    return prisma.sesion.updateMany({
      where: { empleado_id },
      data: { activa: false },
    });
  },

  async delete(id: number): Promise<sesion> {
    return prisma.sesion.delete({ where: { id } });
  },
};
