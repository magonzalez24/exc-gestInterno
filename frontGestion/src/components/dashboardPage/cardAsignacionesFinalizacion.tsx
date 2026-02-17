import { useEffect, useState } from "react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { AsignacionFinalizacion, getFinalizaciones } from "@/services/asignaciones"

const CardAsignacionesFinalizacion = () => {
  const [items, setItems] = useState<AsignacionFinalizacion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getFinalizaciones()
        setItems(data.slice(0, 5))
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error al cargar las asignaciones próximas a finalizar",
        )
      } finally {
        setLoading(false)
      }
    }

    void load()
  }, [])

  return (
    <Card className="overflow-hidden rounded-xl border-0 bg-white shadow-md">
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <div>
          <CardTitle className="text-base font-semibold">Finalizaciones próximas</CardTitle>
          <CardDescription className="text-xs">
            Asignaciones de empleados que finalizan en los próximos meses.
          </CardDescription>
        </div>
        <div className="text-right text-xs text-slate-500">
          <span>{items.length}</span>
          <span className="ml-1">asignaciones</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 pb-4">
        {loading && <p className="text-xs text-slate-500">Cargando...</p>}
        {error && !loading && (
          <p className="text-xs text-red-500">
            {error}
          </p>
        )}
        {!loading && !error && items.length === 0 && (
          <p className="text-xs text-slate-500">No hay asignaciones próximas a finalizar.</p>
        )}
        {!loading &&
          !error &&
          items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-slate-900">
                  {item.nombre} {item.apellido}
                </p>
                <p className="truncate text-[11px] text-slate-500">
                  {item.rol_proyecto_name ?? item.rol_proyecto ?? "-"} ·{" "}
                  {item.nombre_proyecto ?? "Sin proyecto"}
                </p>
              </div>
              <div className="ml-3 flex flex-col items-end gap-1 text-[11px] text-slate-600">
                <span>
                  Fin:{" "}
                  {item.fecha_final
                    ? new Date(item.fecha_final).toLocaleDateString()
                    : "-"}
                </span>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                  {item.porcentaje_asignacion ?? "-"}%
                </span>
              </div>
            </div>
          ))}
      </CardContent>
    </Card>
  )
}

export default CardAsignacionesFinalizacion

