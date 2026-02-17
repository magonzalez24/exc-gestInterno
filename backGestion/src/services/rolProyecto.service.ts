import prisma from '../prisma';
import type { rol_proyecto, Prisma } from '../generated/prisma/client';

export const rolProyectoService = {
  async findAll(where?: Prisma.rol_proyectoWhereInput): Promise<rol_proyecto[]> {
    return prisma.rol_proyecto.findMany({ where, orderBy: { descripcion: 'asc' } });
  },

  async findById(id: number): Promise<rol_proyecto | null> {
    return prisma.rol_proyecto.findUnique({ where: { id } });
  },

  async findByCodigo(codigo: string): Promise<rol_proyecto | null> {
    return prisma.rol_proyecto.findUnique({ where: { codigo } });
  },

  async create(data: Prisma.rol_proyectoCreateInput): Promise<rol_proyecto> {
    return prisma.rol_proyecto.create({ data });
  },

  async update(id: number, data: Prisma.rol_proyectoUpdateInput): Promise<rol_proyecto> {
    return prisma.rol_proyecto.update({ where: { id }, data });
  },

  async delete(id: number): Promise<rol_proyecto> {
    return prisma.rol_proyecto.delete({ where: { id } });
  },
};
