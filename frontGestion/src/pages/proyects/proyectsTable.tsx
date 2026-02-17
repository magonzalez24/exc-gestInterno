import { useCallback, useEffect, useMemo, useState } from "react"

import { ChevronLeft, ChevronRight, Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { deleteProyecto, getProyectos, Proyecto } from "@/services/proyectosService"
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog"
import { useAppToast } from "@/hooks/useAppToast"
import { useNavigate } from "react-router-dom"

const PAGE_SIZE_OPTIONS = [10, 25, 50] as const
const DEFAULT_PAGE_SIZE = 10

export const ProyectsTable = () => {
  const [proyectos, setProyectos] = useState<Proyecto[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [proyectoToDelete, setProyectoToDelete] = useState<Proyecto | null>(null)

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE)
  const { showToast } = useAppToast()
  const navigate = useNavigate()

  const fetchProyectos = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getProyectos()
      setProyectos(data)
    } catch (err) {
      console.error("Error al cargar proyectos", err)
      setError("No se pudieron cargar los proyectos.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchProyectos()
  }, [fetchProyectos])

  const total = proyectos.length
  const totalPages = Math.max(1, Math.ceil(total / limit))

  useEffect(() => {
    // Si cambia el total/limit, evita que la página quede fuera de rango.
    setPage((p) => Math.min(Math.max(1, p), totalPages))
  }, [totalPages])

  const handleAskDeleteProyecto = (proyecto: Proyecto) => {
    setProyectoToDelete(proyecto)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDeleteProyecto = () => {
    if (!proyectoToDelete) return

    deleteProyecto(proyectoToDelete.id)
      .then(() => {
        showToast("success", "Proyecto eliminado correctamente")
        return fetchProyectos()
      })
      .catch((err) => {
        console.error("Error al eliminar proyecto", err)
        showToast(
          "error",
          "Error al eliminar proyecto",
          err instanceof Error ? err.message : "Error al eliminar proyecto",
        )
      })

    setDeleteDialogOpen(false)
    setProyectoToDelete(null)
  }

  const proyectosPage = useMemo(() => {
    const start = (page - 1) * limit
    return proyectos.slice(start, start + limit)
  }, [proyectos, page, limit])

  const rangeStart = total === 0 ? 0 : (page - 1) * limit + 1
  const rangeEnd = Math.min(page * limit, total)

  return (
    <div className="w-full space-y-6 p-6">
      {loading && (
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <p className="text-sm text-muted-foreground">Cargando proyectos...</p>
        </div>
      )}

      {error && !loading && (
        <div className="rounded-xl border border-destructive/50 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {!loading && !error && (
        <Card className="overflow-hidden rounded-xl border-0 bg-white shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-gray-100 pb-4">
            <CardTitle className="text-lg font-semibold tracking-tight text-gray-900">
              Proyectos
            </CardTitle>
            <Button size="sm" variant="secondary" className="shrink-0" onClick={() => navigate('/proyects/new')}>
              Nuevo proyecto
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table className="border-0">
                <TableHeader>
                  <TableRow className="border-b border-gray-200 bg-gray-50/80 hover:bg-transparent">
                    <TableHead className="h-11 px-5 font-semibold text-gray-600">
                      Código
                    </TableHead>
                    <TableHead className="px-5 font-semibold text-gray-600">
                      Nombre
                    </TableHead>
                    <TableHead className="px-5 font-semibold text-gray-600">
                      Cliente
                    </TableHead>
                    <TableHead className="px-5 font-semibold text-gray-600">
                      Ciudad
                    </TableHead>
                    <TableHead className="px-5 font-semibold text-gray-600">
                      Responsable
                    </TableHead>
                    <TableHead className="px-5 font-semibold text-gray-600">
                      Inicio
                    </TableHead>
                    <TableHead className="px-5 font-semibold text-gray-600">
                      Fin prevista
                    </TableHead>
                    <TableHead className="px-5 font-semibold text-gray-600">
                      Fin
                    </TableHead>
                    <TableHead className="px-5 text-right font-semibold text-gray-600">
                      Acciones
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {proyectosPage.map((proyecto) => (
                    <TableRow
                      key={proyecto.id}
                      className="border-b border-gray-100 transition-colors last:border-b-0 hover:bg-gray-50/50"
                    >
                      <TableCell className="px-5 py-4 font-mono text-xs text-gray-600">
                        {proyecto.codigo}
                      </TableCell>
                      <TableCell className="max-w-[340px] truncate px-5 py-4 font-medium text-gray-900">
                        {proyecto.nombre}
                      </TableCell>
                      <TableCell className="max-w-[260px] truncate px-5 py-4 text-sm text-gray-600">
                        {proyecto.cliente}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm text-gray-600">
                        {proyecto.responsable_nombre}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm text-gray-600">
                        {proyecto.ciudad}
                      </TableCell>
                      <TableCell className="px-5 py-4 font-mono text-xs text-gray-600">
                        {proyecto.fecha_inicio.split('T')[0]}
                      </TableCell>
                      <TableCell className="px-5 py-4 font-mono text-xs text-gray-600">
                        {proyecto.fecha_final_prevista?.split('T')[0] ?? "—"}
                      </TableCell>
                      <TableCell className="px-5 py-4 font-mono text-xs text-gray-600">
                        {proyecto.fecha_final?.split('T')[0] ?? "—"}
                      </TableCell>
                      <TableCell className="px-5 py-4">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-500 hover:bg-blue-50 hover:text-primary"
                            onClick={() => navigate(`/proyectos/${proyecto.id}`)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-500 hover:bg-red-50 hover:text-destructive"
                            onClick={() => handleAskDeleteProyecto(proyecto)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {proyectosPage.length === 0 && (
                    <TableRow>
                      <TableCell className="px-5 py-8 text-center text-sm text-muted-foreground" colSpan={9}>
                        No hay proyectos para mostrar.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {total > 0 && (
              <div className="flex flex-col gap-3 border-t border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <p className="text-sm text-muted-foreground">
                    Mostrando{" "}
                    <span className="font-medium text-gray-700">
                      {rangeStart}-{rangeEnd}
                    </span>{" "}
                    de <span className="font-medium text-gray-700">{total}</span>{" "}
                    proyectos
                  </p>
                  <select
                    value={limit}
                    onChange={(e) => {
                      setLimit(Number(e.target.value))
                      setPage(1)
                    }}
                    className="h-8 rounded-md border border-gray-200 bg-white px-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    {PAGE_SIZE_OPTIONS.map((size) => (
                      <option key={size} value={size}>
                        {size} por página
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1 || loading}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Anterior
                  </Button>
                  <span className="min-w-24 text-center text-sm text-muted-foreground">
                    Página {page} de {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages || loading}
                  >
                    Siguiente
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {proyectoToDelete && (
        <ConfirmDeleteDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          itemName={proyectoToDelete.nombre}
          description={`Vas a eliminar el proyecto ${proyectoToDelete.nombre}. Esta acción no se puede deshacer.`}
          onConfirm={handleConfirmDeleteProyecto}
        />
      )}
    </div>
  )
}

export default ProyectsTable
