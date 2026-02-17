import prisma from '../prisma';
import type { perfil, Prisma } from '../generated/prisma/client';

export const perfilService = {
  async findAll(where?: Prisma.perfilWhereInput): Promise<perfil[]> {
    return prisma.perfil.findMany({ where, orderBy: { descripcion: 'asc' } });
  },

  async findById(id: number): Promise<perfil | null> {
    return prisma.perfil.findUnique({ where: { id } });
  },

  async findByCodigo(codigo: string): Promise<perfil | null> {
    return prisma.perfil.findUnique({ where: { codigo } });
  },

  async create(data: Prisma.perfilCreateInput): Promise<perfil> {
    return prisma.perfil.create({ data });
  },

  async update(id: number, data: Prisma.perfilUpdateInput): Promise<perfil> {
    return prisma.perfil.update({ where: { id }, data });
  },

  async delete(id: number): Promise<perfil> {
    return prisma.perfil.delete({ where: { id } });
  },
};
