import prisma from '../prisma';
import type { empleado_rol, Prisma } from '../generated/prisma/client';

export const empleadoRolService = {
  async findAll(where?: Prisma.empleado_rolWhereInput, include?: Prisma.empleado_rolInclude): Promise<empleado_rol[]> {
    return prisma.empleado_rol.findMany({ where, include });
  },

  async findById(id: number, include?: Prisma.empleado_rolInclude): Promise<empleado_rol | null> {
    return prisma.empleado_rol.findUnique({ where: { id }, include });
  },

  async findByEmpleado(empleado_id: number): Promise<empleado_rol[]> {
    return prisma.empleado_rol.findMany({
      where: { empleado_id },
      include: { rol: true },
    });
  },

  async create(data: Prisma.empleado_rolCreateInput): Promise<empleado_rol> {
    return prisma.empleado_rol.create({ data });
  },

  async delete(id: number): Promise<empleado_rol> {
    return prisma.empleado_rol.delete({ where: { id } });
  },

  async deleteByEmpleadoAndRol(empleado_id: number, rol_id: number): Promise<empleado_rol> {
    return prisma.empleado_rol.delete({
      where: {
        empleado_id_rol_id: { empleado_id, rol_id },
      },
    });
  },
};
