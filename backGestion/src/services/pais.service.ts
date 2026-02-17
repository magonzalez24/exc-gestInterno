import prisma from '../prisma';
import type { pais, Prisma } from '../generated/prisma/client';

export const paisService = {
  async findAll(where?: Prisma.paisWhereInput): Promise<pais[]> {
    return prisma.pais.findMany({ where, orderBy: { descripcion: 'asc' } });
  },

  async findById(id: number): Promise<pais | null> {
    return prisma.pais.findUnique({ where: { id } });
  },

  async findByCodigo(codigo: string): Promise<pais | null> {
    return prisma.pais.findUnique({ where: { codigo } });
  },

  async create(data: Prisma.paisCreateInput): Promise<pais> {
    return prisma.pais.create({ data });
  },

  async update(id: number, data: Prisma.paisUpdateInput): Promise<pais> {
    return prisma.pais.update({ where: { id }, data });
  },

  async delete(id: number): Promise<pais> {
    return prisma.pais.delete({ where: { id } });
  },
};
