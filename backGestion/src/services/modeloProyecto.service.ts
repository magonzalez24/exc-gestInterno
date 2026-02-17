import prisma from '../prisma';
import type { modelo_proyecto, Prisma } from '../generated/prisma/client';

export const modeloProyectoService = {
  async findAll(where?: Prisma.modelo_proyectoWhereInput): Promise<modelo_proyecto[]> {
    return prisma.modelo_proyecto.findMany({ where, orderBy: { descripcion: 'asc' } });
  },

  async findById(id: number): Promise<modelo_proyecto | null> {
    return prisma.modelo_proyecto.findUnique({ where: { id } });
  },

  async findByCodigo(codigo: string): Promise<modelo_proyecto | null> {
    return prisma.modelo_proyecto.findUnique({ where: { codigo } });
  },

  async create(data: Prisma.modelo_proyectoCreateInput): Promise<modelo_proyecto> {
    return prisma.modelo_proyecto.create({ data });
  },

  async update(id: number, data: Prisma.modelo_proyectoUpdateInput): Promise<modelo_proyecto> {
    return prisma.modelo_proyecto.update({ where: { id }, data });
  },

  async delete(id: number): Promise<modelo_proyecto> {
    return prisma.modelo_proyecto.delete({ where: { id } });
  },
};
