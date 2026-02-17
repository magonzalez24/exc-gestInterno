import prisma from '../prisma';
import type { dimension, Prisma } from '../generated/prisma/client';

export const dimensionService = {
  async findAll(where?: Prisma.dimensionWhereInput): Promise<dimension[]> {
    return prisma.dimension.findMany({ where, orderBy: { descripcion: 'asc' } });
  },

  async findById(id: number): Promise<dimension | null> {
    return prisma.dimension.findUnique({ where: { id } });
  },

  async findByCodigo(codigo: string): Promise<dimension | null> {
    return prisma.dimension.findUnique({ where: { codigo } });
  },

  async create(data: Prisma.dimensionCreateInput): Promise<dimension> {
    return prisma.dimension.create({ data });
  },

  async update(id: number, data: Prisma.dimensionUpdateInput): Promise<dimension> {
    return prisma.dimension.update({ where: { id }, data });
  },

  async delete(id: number): Promise<dimension> {
    return prisma.dimension.delete({ where: { id } });
  },
};
