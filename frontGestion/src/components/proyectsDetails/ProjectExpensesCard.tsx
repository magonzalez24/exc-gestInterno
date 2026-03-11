import { useEffect, useState } from "react"

import { getAsignacionesProyecto, type ProyectoAsignacion } from "@/services/proyectosService"

type ProjectExpensesCardProps = {
  proyectoId: number
  t: (key: string) => string
}

const ProjectExpensesCard = ({ proyectoId, t }: ProjectExpensesCardProps) => {
  const [asignaciones, setAsignaciones] = useState<ProyectoAsignacion[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadAsignaciones = async () => {
      setLoading(true)
      const data = await getAsignacionesProyecto(proyectoId)
      setAsignaciones(data)
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
        ) : asignaciones.length === 0 ? (
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
                {asignaciones.map((asignacion) => (
                  <tr key={asignacion.id}>
                    <td className="px-4 py-2 text-sm text-slate-700">
                      {asignacion.empleado_name}
                    </td>
                    <td className="px-4 py-2 text-right text-sm text-slate-700">
                      {asignacion.costo_asignacion != null
                        ? asignacion.costo_asignacion.toLocaleString(undefined, {
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
      </div>
    </div>
  )
}

export default ProjectExpensesCard

