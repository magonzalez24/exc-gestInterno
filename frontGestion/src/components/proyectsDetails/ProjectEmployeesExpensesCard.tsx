import { useEffect, useMemo, useState } from "react"

import { getAsignacionesProyecto } from "@/services/proyectosService"

type ProjectEmployeesExpensesCard = {
  proyectoId: number
  t: (key: string) => string
}

interface GastoEmpleado {
  id: number
  codigo: string
  proyecto_id: number
  empleado_id: number
  rol_proyecto_id: number
  fecha_inicio: string
  fecha_final: string | null
  activo: boolean
  porcentaje_asignacion: string
  costo_asignacion: string | null
  id_empleado: number
  codigo_empleado: string | null
  nombre_empleado: string | null
  apellido_empleado: string | null
}

const ProjectEmployeesExpensesCard = ({ proyectoId, t }: ProjectEmployeesExpensesCard) => {
  const [asignaciones, setAsignaciones] = useState<GastoEmpleado[]>([])
  const [loading, setLoading] = useState(false)

  const sumCostosAsignacion = (items: GastoEmpleado[]) => {
    return items.reduce((acc, item) => {
      if (item.costo_asignacion == null) return acc
      const n = Number(item.costo_asignacion)
      return Number.isNaN(n) ? acc : acc + n
    }, 0)
  }

  const rows = useMemo(() => {
    return asignaciones.map((a) => {
      const nombre = [a.nombre_empleado, a.apellido_empleado].filter(Boolean).join(" ").trim()
      const costoNum = a.costo_asignacion != null ? Number(a.costo_asignacion) : null
      return {
        ...a,
        nombreCompleto: nombre || "-",
        costoNum: costoNum != null && !Number.isNaN(costoNum) ? costoNum : null,
      }
    })
  }, [asignaciones])

  const totalCostos = useMemo(() => sumCostosAsignacion(asignaciones), [asignaciones])

  useEffect(() => {
    const loadAsignaciones = async () => {
      setLoading(true)
      const data = await getAsignacionesProyecto(proyectoId)
      setAsignaciones(data as unknown as GastoEmpleado[])
      setLoading(false)
    }

    void loadAsignaciones()
  }, [proyectoId])

  return (
    <div className="mt-6">
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            {t("projects.detail.expensesTitle") ?? "Gastos del proyecto"}
          </h2>
        </div>

        {loading ? (
          <p className="text-sm text-slate-500">{t("common.loading")}</p>
        ) : rows.length === 0 ? (
          <p className="text-sm text-slate-500">
            {t("projects.detail.noExpenses") ?? "No hay gastos registrados para este proyecto."}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    {t("employees.employee") ?? "Empleado"}
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wider text-slate-500">
                    {t("projects.detail.assignmentCost") ?? "Costo asignación"}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {rows.map((asignacion) => (
                  <tr key={asignacion.id}>
                    <td className="px-4 py-2 text-sm text-slate-700">
                      {asignacion.nombreCompleto}
                    </td>
                    <td className="px-4 py-2 text-right text-sm text-slate-700">
                      {asignacion.costoNum != null
                        ? asignacion.costoNum.toLocaleString(undefined, {
                            style: "currency",
                            currency: "EUR",
                          })
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
          <div className="mt-4 flex items-center justify-end">
            <span className="text-sm font-medium text-slate-600">
              {t("projects.detail.totalAssignmentCost") ?? "Total"}:{" "}
            </span>
            <span className="ml-2 text-sm font-semibold text-slate-900">
              {totalCostos.toLocaleString(undefined, { style: "currency", currency: "EUR" })}
            </span>
          </div>
      </div>
    </div>
  )
}

export default ProjectEmployeesExpensesCard

