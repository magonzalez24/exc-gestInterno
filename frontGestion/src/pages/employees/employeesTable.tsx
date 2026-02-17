import { useCallback, useEffect, useState } from "react"

import { ChevronLeft, ChevronRight, Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { deleteEmpleado, Empleado, getEmpleados } from "@/services/empleadosService"
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog"
import { useAppToast } from "@/hooks/useAppToast"
import { useNavigate } from "react-router-dom"

const PAGE_SIZE_OPTIONS = [10, 25, 50] as const
const DEFAULT_PAGE_SIZE = 10

export const EmployeesTable = () => {
  const [employees, setEmployees] = useState<Empleado[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [employeeToDelete, setEmployeeToDelete] = useState<Empleado | null>(null)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const { showToast } = useAppToast()
  const navigate = useNavigate()

  const fetchEmpleados = useCallback(async (pageNum: number, limitNum: number) => {
    try {
      setLoading(true)
      setError(null)
      const data = await getEmpleados({ page: pageNum, limit: limitNum })
      setEmployees(data.items)
      setTotal(data.total)
      setTotalPages(data.totalPages)
      setPage(data.page)
      setLimit(data.limit)
    } catch (err) {
      console.error("Error al cargar empleados", err)
      setError("No se pudieron cargar los empleados.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchEmpleados(page, limit)
  }, [page, limit, fetchEmpleados])

  const handleAskDeleteEmployee = (employee: Empleado) => {
    setEmployeeToDelete(employee)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDeleteEmployee = (razonBaja?: string) => {
    if (!employeeToDelete) return

    deleteEmpleado(employeeToDelete.id, { razon_baja: razonBaja }).then(() => {
      showToast('success', 'Empleado eliminado correctamente')
      fetchEmpleados(page, limit)
    }).catch((err) => {
      console.error("Error al eliminar empleado", err)
      showToast('error', 'Error al eliminar empleado', err instanceof Error ? err.message : 'Error al eliminar empleado')
    })

    setDeleteDialogOpen(false)
    setEmployeeToDelete(null)
  }

  return (
    <div className="w-full space-y-6 p-6">
      {loading && (
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <p className="text-sm text-muted-foreground">Cargando empleados...</p>
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
              Empleados
            </CardTitle>
            <Button size="sm" variant="secondary" className="shrink-0" onClick={() => navigate('/employees/new')}>
              Nuevo empleado
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
                      Dimensión
                    </TableHead>
                    <TableHead className="px-5 font-semibold text-gray-600">
                      Perfil
                    </TableHead>
                    <TableHead className="px-5 text-center font-semibold text-gray-600">
                      Activo
                    </TableHead>
                    <TableHead className="px-5 text-right font-semibold text-gray-600">
                      Acciones
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((employee) => (
                    <TableRow
                      key={employee.id}
                      className="border-b border-gray-100 transition-colors last:border-b-0 hover:bg-gray-50/50"
                    >
                      <TableCell className="px-5 py-4 font-mono text-xs text-gray-600">
                        {employee.codigo_empleado}
                      </TableCell>
                      <TableCell className="px-5 py-4 font-medium text-gray-900">
                        {employee.nombre} {employee.apellido}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate px-5 py-4 text-sm text-gray-600">
                        {employee.dimension_nombre ?? "—"}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm text-gray-600">
                        {employee.perfil_nombre ?? "—"}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-center">
                        <span
                          className={
                            employee.activo
                              ? "inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700"
                              : "inline-flex rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700"
                          }
                        >
                          {employee.activo ? "Sí" : "No"}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-4">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-500 hover:bg-blue-50 hover:text-primary"
                            onClick={() => navigate(`/employees/${employee.id}`)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-500 hover:bg-red-50 hover:text-destructive"
                            onClick={() => handleAskDeleteEmployee(employee)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {employees.length > 0 && (
              <div className="flex flex-col gap-3 border-t border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <p className="text-sm text-muted-foreground">
                    Mostrando{" "}
                    <span className="font-medium text-gray-700">
                      {(page - 1) * limit + 1}-{Math.min(page * limit, total)}
                    </span>{" "}
                    de <span className="font-medium text-gray-700">{total}</span>{" "}
                    empleados
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
                    Página {page} de {totalPages || 1}
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

      {employeeToDelete && (
        <ConfirmDeleteDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          itemName={`${employeeToDelete.nombre} ${employeeToDelete.apellido}`}
          onConfirm={handleConfirmDeleteEmployee}
          showReasonInput
          reasonLabel="Razón de baja"
          reasonPlaceholder="Indique el motivo de la baja (opcional)"
        />
      )}
    </div>
  )
}

export default EmployeesTable

