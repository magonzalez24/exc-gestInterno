import prisma from '../prisma';
import type { rol, Prisma } from '../generated/prisma/client';

export const rolService = {
  async findAll(where?: Prisma.rolWhereInput): Promise<rol[]> {
    return prisma.rol.findMany({ where, orderBy: { nombre: 'asc' } });
  },

  async findById(id: number): Promise<rol | null> {
    return prisma.rol.findUnique({ where: { id } });
  },

  async findByCodigo(codigo: string): Promise<rol | null> {
    return prisma.rol.findUnique({ where: { codigo } });
  },

  async create(data: Prisma.rolCreateInput): Promise<rol> {
    return prisma.rol.create({ data });
  },

  async update(id: number, data: Prisma.rolUpdateInput): Promise<rol> {
    return prisma.rol.update({ where: { id }, data });
  },

  async delete(id: number): Promise<rol> {
    return prisma.rol.delete({ where: { id } });
  },
};
