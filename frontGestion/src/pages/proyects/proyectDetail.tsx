import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import { PageBreadcrumb } from "@/components/PageBreadcrumb"
import { LoadingScreen } from "@/components/loadingScreen"
import ProjectGeneralInfoCard from "@/components/proyectsDetails/ProjectGeneralInfoCard"
import ProyectOverviewCard from "@/components/proyectsDetails/ProyectOverviewCard"
import { ProjectTeamCard, TeamMemberAssignment } from "@/components/proyectsDetails/ProjectTeamCard"
import { ProjectEmployeesDialog, AsignacionEmpleado } from "@/components/ProjectEmployeesDialog"
import { getProyectoById, type Proyecto } from "@/services/proyectosService"
import { Empleado, getEmpleados } from "@/services/empleadosService"
import { useI18n } from "@/i18n"

const ProyectDetail = () => {
  const [proyecto, setProyecto] = useState<Proyecto | null>(null)
  const { id } = useParams<{ id: string }>()
  const [loading, setLoading] = useState(true)
  const { t } = useI18n()
  const [empleados, setEmpleados] = useState<Empleado[]>([])
  const [asignaciones, setAsignaciones] = useState<Record<number, AsignacionEmpleado>>({})
  const [empleadosSeleccionadosIds, setEmpleadosSeleccionadosIds] = useState<number[]>([])
  const [assignDialogOpen, setAssignDialogOpen] = useState(false)
  const [searchEmpleado, setSearchEmpleado] = useState("")

  useEffect(() => {
    if (id) {
      setLoading(true)
      const loadProyecto = async () => {
        try {
          setLoading(true)
          const data = await getProyectoById(Number(id))
          setProyecto(data)
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(error)
        } finally {
          setLoading(false)
        }
      }
      loadProyecto()
    }
  }, [id])

  useEffect(() => {
    let cancelled = false

    const loadEmpleados = async () => {
      try {
        const empleadosPage = await getEmpleados({ page: 1, limit: 999 })
        if (cancelled) return
        setEmpleados(empleadosPage.items)
      } catch (error) {
        if (!cancelled) {
          // eslint-disable-next-line no-console
          console.error("Error al cargar empleados", error)
        }
      }
    }

    void loadEmpleados()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!proyecto?.asignaciones || empleados.length === 0) return

    const selectedIds: number[] = []
    const asignacionesMap: Record<number, AsignacionEmpleado> = {}

    proyecto.asignaciones.forEach((asig) => {
      const empleado = empleados.find((e) => e.id === asig.empleado_id)
      if (!empleado) return

      selectedIds.push(empleado.id)
      asignacionesMap[empleado.id] = {
        empleado,
        rol: asig.rol_proyecto_id ? String(asig.rol_proyecto_id) : "",
        fecha_inicio: asig.fecha_inicio?.slice(0, 10) ?? "",
        fecha_fin: asig.fecha_final ? asig.fecha_final.slice(0, 10) : "",
        porcentaje: asig.porcentaje_asignacion,
      }
    })

    setEmpleadosSeleccionadosIds(selectedIds)
    setAsignaciones(asignacionesMap)
  }, [proyecto, empleados])

  const empleadosFiltrados = empleados.filter((empleado) => {
    const termino = searchEmpleado.toLowerCase().trim()
    if (!termino) return true
    const nombreCompleto = `${empleado.nombre} ${empleado.apellido}`.toLowerCase()
    return (
      nombreCompleto.includes(termino) ||
      empleado.codigo_empleado.toLowerCase().includes(termino) ||
      (empleado.perfil_nombre ?? "").toLowerCase().includes(termino)
    )
  })

  const toggleEmpleadoSeleccion = (empleado: Empleado) => {
    setEmpleadosSeleccionadosIds((prev) => {
      const alreadySelected = prev.includes(empleado.id)
      if (alreadySelected) {
        const next = prev.filter((selectedId) => selectedId !== empleado.id)
        setAsignaciones((asignacionesPrevias) => {
          const { [empleado.id]: _, ...rest } = asignacionesPrevias
          return rest
        })
        return next
      }

      setAsignaciones((asignacionesPrevias) => ({
        ...asignacionesPrevias,
        [empleado.id]: {
          empleado,
          rol: "",
          fecha_inicio: proyecto?.fecha_inicio?.slice(0, 10) ?? "",
          fecha_fin: proyecto?.fecha_final_prevista
            ? proyecto.fecha_final_prevista.slice(0, 10)
            : "",
          porcentaje: "100",
        },
      }))

      return [...prev, empleado.id]
    })
  }

  const handleCambioAsignacion = (
    empleadoId: number,
    campo: keyof Omit<AsignacionEmpleado, "empleado">,
    valor: string,
  ) => {
    setAsignaciones((prev) => {
      const actual = prev[empleadoId]
      if (!actual) return prev
      return {
        ...prev,
        [empleadoId]: {
          ...actual,
          [campo]: valor,
        },
      }
    })
  }

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <>
      <div className="min-h-screen bg-slate-50 px-6 py-8">
        <PageBreadcrumb
          backHref="/proyects"
          backLabel="Proyectos"
          title={proyecto?.nombre ?? "Proyecto"}
        />

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {proyecto && (
            <>
              <ProjectGeneralInfoCard proyecto={proyecto} />
              <ProyectOverviewCard proyecto={proyecto} />
            </>
          )}
        </div>

        {empleadosSeleccionadosIds.length > 0 && (
          <div className="mt-6">
            <ProjectTeamCard
              t={t}
              members={empleadosSeleccionadosIds
                .map((selectedId) => {
                  const asignacion = asignaciones[selectedId]
                  if (!asignacion) return null

                  const { empleado, rol, fecha_inicio, fecha_fin, porcentaje } = asignacion

                  const member: TeamMemberAssignment = {
                    id: empleado.id,
                    nombre: empleado.nombre,
                    apellido: empleado.apellido,
                    perfilNombre: empleado.perfil_nombre,
                    rol,
                    fecha_inicio,
                    fecha_fin,
                    porcentaje,
                  }

                  return member
                })
                .filter((m): m is TeamMemberAssignment => m !== null)}
              summaryCount={empleadosSeleccionadosIds.length}
              showAssignButton
              onAssignClick={() => setAssignDialogOpen(true)}
              assignButtonDisabled={empleados.length === 0}
            />
          </div>
        )}

        <ProjectEmployeesDialog
          open={assignDialogOpen}
          onOpenChange={setAssignDialogOpen}
          t={t}
          empleadosFiltrados={empleadosFiltrados}
          empleadosSeleccionadosIds={empleadosSeleccionadosIds}
          searchEmpleado={searchEmpleado}
          onSearchEmpleadoChange={setSearchEmpleado}
          asignaciones={asignaciones}
          toggleEmpleadoSeleccion={toggleEmpleadoSeleccion}
          handleCambioAsignacion={handleCambioAsignacion}
        />
      </div>
    </>
  )
}

export default ProyectDetail