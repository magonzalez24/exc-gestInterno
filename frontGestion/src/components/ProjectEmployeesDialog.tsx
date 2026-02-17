import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import CustomSelect, { CatalogOption } from "@/components/CustomSelect"
import { CustomInput } from "@/components/CustomInput"
import type { Empleado } from "@/services/empleadosService"
import { getRolesProyecto } from "@/services/proyectosService"
import { Trash2 } from "lucide-react"

type TFunction = (key: string, options?: Record<string, unknown>) => string | undefined

export type AsignacionEmpleado = {
  empleado: Empleado
  rol: string
  fecha_inicio: string
  fecha_fin: string
  porcentaje: string
}

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  t: TFunction
  empleadosFiltrados: Empleado[]
  empleadosSeleccionadosIds: number[]
  searchEmpleado: string
  onSearchEmpleadoChange: (value: string) => void
  asignaciones: Record<number, AsignacionEmpleado>
  toggleEmpleadoSeleccion: (empleado: Empleado) => void
  handleCambioAsignacion: (
    empleadoId: number,
    campo: keyof Omit<AsignacionEmpleado, "empleado">,
    valor: string,
  ) => void
}

export const ProjectEmployeesDialog = ({
  open,
  onOpenChange,
  t,
  empleadosFiltrados,
  empleadosSeleccionadosIds,
  searchEmpleado,
  onSearchEmpleadoChange,
  asignaciones,
  toggleEmpleadoSeleccion,
  handleCambioAsignacion,
}: Props) => {
  const [rolesOptions, setRolesOptions] = useState<CatalogOption[]>([])

  useEffect(() => {
    let cancelled = false

    const loadRoles = async () => {
      try {
        const data = await getRolesProyecto()
        if (cancelled) return

        const options: CatalogOption[] = data.map((rol) => ({
          id: rol.id,
          codigo: rol.codigo ?? String(rol.id),
          descripcion: rol.descripcion,
          activo: rol.activo,
        }))

        setRolesOptions(options)
      } catch (error) {
        // Silenciamos el error aquí; el formulario principal puede gestionar errores globales
        // eslint-disable-next-line no-console
        console.error("Error al cargar roles de proyecto", error)
      }
    }

    loadRoles()

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl gap-6 min-h-[70vh] md:max-h-[95vh] rounded-xl border border-slate-200 bg-slate-50/80 px-6 py-5">
        <DialogHeader className="space-y-1 pb-1">
          <DialogTitle className="text-lg font-semibold">
            {t("projectForm.assignDialogTitle") ?? "Revisión de empleados seleccionados"}
          </DialogTitle>
          <DialogDescription>
            {t("projectForm.assignDialogDescription") ??
              "Revisa y personaliza la asignación de los miembros seleccionados antes de confirmar."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 md:grid-cols-[minmax(0,1.3fr)_minmax(0,2fr)]">
          {/* Columna izquierda: listado y búsqueda */}
          <div className="rounded-xl border border-slate-200 bg-white/90 p-4 shadow-sm">
            <p className="mb-3 text-sm font-semibold text-slate-900">
              {t("projectForm.assignDialogEmployeesTitle") ?? "Empleados"}
            </p>
            <div className="space-y-3">
              <CustomInput
                id="project-employees-search"
                label={t("projectForm.assignDialogSearchPlaceholder") ?? "Buscar empleados..."}
                value={searchEmpleado}
                onChange={(e) => onSearchEmpleadoChange(e.target.value)}
                placeholder={
                  t("projectForm.assignDialogSearchPlaceholder") ?? "Buscar empleados..."
                }
                className="h-9 bg-white"
              />

              <div className="max-h-[360px] md:max-h-[420px] space-y-1 overflow-y-auto rounded-md bg-slate-50 p-1 text-sm cursor-pointer">
                {empleadosFiltrados.length === 0 ? (
                  <p className="px-2 py-4 text-xs text-slate-500">
                    {t("projectForm.assignDialogEmpty") ?? "No hay empleados que coincidan."}
                  </p>
                ) : (
                  empleadosFiltrados.map((empleado) => {
                    const seleccionado = empleadosSeleccionadosIds.includes(empleado.id)
                    return (
                      <button
                        key={empleado.id}
                        type="button"
                        onClick={() => toggleEmpleadoSeleccion(empleado)}
                        className={`flex w-full items-center gap-3 rounded-md px-2 py-2 text-left transition ${
                          seleccionado
                            ? "bg-blue-50/90 ring-1 ring-blue-200"
                            : "hover:bg-slate-50"
                        }`}
                      >
                        <Checkbox
                          checked={seleccionado}
                          onCheckedChange={() => toggleEmpleadoSeleccion(empleado)}
                          className="h-4 w-4"
                        />
                        <div className="flex flex-1 flex-col cursor-pointer">
                          <span className="text-xs font-medium text-slate-900">
                            {empleado.nombre} {empleado.apellido}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            {empleado.perfil_nombre ?? "-"}
                          </span>
                        </div>
                        <span className="text-[11px] font-mono text-slate-500">
                          {empleado.codigo_empleado}
                        </span>
                      </button>
                    )
                  })
                )}
              </div>
            </div>
          </div>

          {/* Columna derecha: revisión de selección */}
          <div className="space-y-4">
            <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-2 pb-1">
                <p className="text-sm font-medium text-slate-900">
                  {t("projectForm.assignDialogReviewTitle") ?? "Revisión de la selección"}
                </p>
                <p className="text-xs text-slate-500">
                  {t("projectForm.assignDialogReviewSubtitle", {
                    count: empleadosSeleccionadosIds.length,
                  }) ?? `${empleadosSeleccionadosIds.length} empleados asignados`}
                </p>
              </div>

              {empleadosSeleccionadosIds.length === 0 ? (
                <p className="py-8 text-center text-xs text-slate-500">
                  {t("projectForm.assignDialogReviewEmpty") ??
                    "Selecciona uno o más empleados en la lista de la izquierda para configurarlos."}
                </p>
              ) : (
                <div className="max-h-[360px] md:max-h-[420px] space-y-3 overflow-y-auto pt-1 pr-1">
                  {empleadosSeleccionadosIds.map((id) => {
                    const asignacion = asignaciones[id]
                    if (!asignacion) return null
                    const { empleado } = asignacion

                    return (
                      <div
                        key={id}
                        className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50/80 p-3 text-xs"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex flex-col">
                            <span className="text-[13px] font-medium text-slate-900">
                              {empleado.nombre} {empleado.apellido}
                            </span>
                            <span className="text-[11px] text-slate-500">
                              {empleado.perfil_nombre ?? "-"}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => toggleEmpleadoSeleccion(empleado)}
                            className="text-[11px] font-medium text-slate-500 hover:text-red-500 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid gap-2 md:grid-cols-4">
                          <CustomSelect
                            label={t("projectForm.assignDialogFieldRol") ?? "Rol"}
                            required
                            placeholder={
                              t("projectForm.assignDialogPlaceholderRol") ?? "Selecciona un rol"
                            }
                            value={asignacion.rol}
                            onChange={(value) => handleCambioAsignacion(id, "rol", value)}
                            options={rolesOptions}
                          />
                          <CustomInput
                            id={`project-employees-start-${id}`}
                            label={t("projectForm.assignDialogFieldStart") ?? "Inicio"}
                            required
                            requiredLabel={t("projectForm.required") ?? "*"}
                            type="date"
                            value={asignacion.fecha_inicio}
                            onChange={(e) =>
                              handleCambioAsignacion(id, "fecha_inicio", e.target.value)
                            }
                            className="h-8 text-[11px]"
                          />
                          <CustomInput
                            id={`project-employees-end-${id}`}
                            label={t("projectForm.assignDialogFieldEnd") ?? "Fin"}
                            type="date"
                            value={asignacion.fecha_fin}
                            onChange={(e) =>
                              handleCambioAsignacion(id, "fecha_fin", e.target.value)
                            }
                            className="h-8 text-[11px]"
                          />
                          <CustomInput
                            id={`project-employees-percent-${id}`}
                            label={t("projectForm.assignDialogFieldPercent") ?? "% dedicación"}
                            type="number"
                            min={0}
                            max={100}
                            value={asignacion.porcentaje}
                            onChange={(e) =>
                              handleCambioAsignacion(id, "porcentaje", e.target.value)
                            }
                            className="h-8 text-[11px]"
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
              >
                {t("projectForm.assignDialogCancel") ?? "Cancelar"}
              </Button>
              <Button
                type="button"
                size="sm"
                className="bg-blue-600 text-white hover:bg-blue-600/90"
                onClick={() => onOpenChange(false)}
              >
                {t("projectForm.assignDialogConfirm") ?? "Confirmar asignación"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

