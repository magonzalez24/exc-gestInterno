import prisma from '../prisma';
import type { proyecto, Prisma } from '../generated/prisma/client';

export const proyectoService = {
  async findAll(where?: Prisma.proyectoWhereInput, include?: Prisma.proyectoInclude): Promise<proyecto[]> {
    return prisma.proyecto.findMany({
      where,
      include,
      orderBy: { fecha_inicio: 'desc' },
    });
  },

  async findById(id: number, include?: Prisma.proyectoInclude): Promise<proyecto | null> {
    return prisma.proyecto.findUnique({ where: { id }, include });
  },

  async findByCodigo(codigo: number, include?: Prisma.proyectoInclude): Promise<proyecto | null> {
    return prisma.proyecto.findUnique({ where: { codigo }, include });
  },

  async create(
    data: Prisma.proyectoUncheckedCreateInput & {
      asignaciones?: Array<
        Omit<Prisma.asignacion_proyecto_empleadoUncheckedCreateInput, 'id' | 'proyecto_id'>
      >
    }
  ): Promise<proyecto> {
    const { asignaciones, ...proyectoData } = data as any;

    return prisma.$transaction(async (tx) => {
      // Adaptamos el payload con ids a la forma esperada por Prisma
      const {
        modelo_proyecto_id,
        pais_id,
        responsable_id,
        id: _ignoredId,
        fecha_inicio,
        fecha_final_prevista,
        fecha_final,
        ...restProyecto
      } = proyectoData as Prisma.proyectoUncheckedCreateInput;

      const createdProyecto = await tx.proyecto.create({
        data: {
          ...restProyecto,
          fecha_inicio: fecha_inicio ? new Date(fecha_inicio) : undefined,
          fecha_final_prevista: fecha_final_prevista ? new Date(fecha_final_prevista) : null,
          fecha_final: fecha_final ? new Date(fecha_final) : null,
          // conectamos las relaciones requeridas usando los *_id recibidos
          modelo_proyecto: { connect: { id: modelo_proyecto_id } },
          pais: { connect: { id: pais_id } },
          empleado: { connect: { id: responsable_id } },
        } as Prisma.proyectoCreateInput,
      });

      if (Array.isArray(asignaciones) && asignaciones.length > 0) {
        await Promise.all(
          asignaciones.map((asig) =>
            tx.asignacion_proyecto_empleado.create({
              data: {
                ...asig,
                proyecto_id: createdProyecto.id,
              } as any,
            })
          )
        );
      }

      return createdProyecto;
    });
  },

  async update(id: number, data: Prisma.proyectoUpdateInput): Promise<proyecto> {
    return prisma.proyecto.update({ where: { id }, data });
  },

  async delete(id: number): Promise<proyecto> {
    return prisma.proyecto.delete({ where: { id } });
  },
};
