import prisma from '../prisma';
import type { modelo_contratacion, Prisma } from '../generated/prisma/client';

export const modeloContratacionService = {
  async findAll(where?: Prisma.modelo_contratacionWhereInput): Promise<modelo_contratacion[]> {
    return prisma.modelo_contratacion.findMany({ where, orderBy: { descripcion: 'asc' } });
  },

  async findById(id: number): Promise<modelo_contratacion | null> {
    return prisma.modelo_contratacion.findUnique({ where: { id } });
  },

  async findByCodigo(codigo: string): Promise<modelo_contratacion | null> {
    return prisma.modelo_contratacion.findUnique({ where: { codigo } });
  },

  async create(data: Prisma.modelo_contratacionCreateInput): Promise<modelo_contratacion> {
    return prisma.modelo_contratacion.create({ data });
  },

  async update(id: number, data: Prisma.modelo_contratacionUpdateInput): Promise<modelo_contratacion> {
    return prisma.modelo_contratacion.update({ where: { id }, data });
  },

  async delete(id: number): Promise<modelo_contratacion> {
    return prisma.modelo_contratacion.delete({ where: { id } });
  },
};
