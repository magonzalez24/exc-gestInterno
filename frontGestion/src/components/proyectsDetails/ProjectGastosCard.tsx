import { useEffect, useMemo, useState } from "react"

import { createGastoProyecto, getGastosProyecto, type CreateProyectoGastoInput, type ProyectoGasto } from "@/services/proyectosService"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type ProjectGastosCardProps = {
  proyectoId: number
  t: (key: string) => string
}

const ProjectGastosCard = ({ proyectoId, t }: ProjectGastosCardProps) => {
  const [gastos, setGastos] = useState<ProyectoGasto[]>([])
  const [loading, setLoading] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [descripcion, setDescripcion] = useState("")
  const [importe, setImporte] = useState("")
  const [fechaGasto, setFechaGasto] = useState("")

  const rows = useMemo(() => {
    return gastos.map((g) => {
      const importeNum = Number(g.importe)
      const importeValue = !Number.isNaN(importeNum) ? importeNum : null

      const fecha = g.fecha_gasto ? new Date(g.fecha_gasto) : null
      const fechaLabel =
        fecha && !Number.isNaN(fecha.getTime()) ? fecha.toLocaleDateString() : "-"

      return {
        ...g,
        importeValue,
        fechaLabel,
      }
    })
  }, [gastos])

  const totalImporte = useMemo(() => {
    return rows.reduce((acc, r) => (r.importeValue != null ? acc + r.importeValue : acc), 0)
  }, [rows])

  const reloadGastos = async () => {
    setLoading(true)
    const data = await getGastosProyecto(proyectoId)
    setGastos(data)
    setLoading(false)
  }

  useEffect(() => {
    let cancelled = false

    const fetchGastos = async () => {
      setLoading(true)
      const data = await getGastosProyecto(proyectoId)
      if (cancelled) return
      setGastos(data)
      setLoading(false)
    }

    void fetchGastos()

    return () => {
      cancelled = true
    }
  }, [proyectoId])

  const resetForm = () => {
    setDescripcion("")
    setImporte("")
    setFechaGasto("")
  }

  const handleCreate = async () => {
    const payload: CreateProyectoGastoInput = {
      proyecto_id: proyectoId,
      descripcion: descripcion.trim(),
      importe: importe.trim(),
      fecha_gasto: fechaGasto ? new Date(fechaGasto).toISOString() : new Date().toISOString(),
    }

    setSaving(true)
    await createGastoProyecto(payload)
    setSaving(false)

    setCreateOpen(false)
    resetForm()
    await reloadGastos()
  }

  return (
    <div className="mt-6">
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            {t("projects.detail.projectExpensesTitle") ?? "Gastos (otros)"}
          </h2>
          <Button
            type="button"
            size="sm"
            className="bg-slate-900 text-white hover:bg-slate-900/90"
            onClick={() => setCreateOpen(true)}
          >
            {t("projects.detail.addProjectExpense") ?? "Nuevo gasto"}
          </Button>
        </div>

        {loading ? (
          <p className="text-sm text-slate-500">{t("common.loading")}</p>
        ) : rows.length === 0 ? (
          <p className="text-sm text-slate-500">
            {t("projects.detail.noProjectExpenses") ?? "No hay gastos registrados para este proyecto."}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    {t("projects.detail.expenseDescription") ?? "Descripción"}
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    {t("projects.detail.expenseDate") ?? "Fecha"}
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wider text-slate-500">
                    {t("projects.detail.expenseAmount") ?? "Importe"}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {rows.map((g) => (
                  <tr key={g.id}>
                    <td className="px-4 py-2 text-sm text-slate-700">{g.descripcion}</td>
                    <td className="px-4 py-2 text-sm text-slate-700">{g.fechaLabel}</td>
                    <td className="px-4 py-2 text-right text-sm text-slate-700">
                      {g.importeValue != null
                        ? g.importeValue.toLocaleString(undefined, {
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
            {t("projects.detail.totalProjectExpenses") ?? "Total"}:{" "}
          </span>
          <span className="ml-2 text-sm font-semibold text-slate-900">
            {totalImporte.toLocaleString(undefined, { style: "currency", currency: "EUR" })}
          </span>
        </div>
      </div>

      <Dialog
        open={createOpen}
        onOpenChange={(open) => {
          setCreateOpen(open)
          if (!open) resetForm()
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t("projects.detail.newProjectExpenseTitle") ?? "Crear gasto"}
            </DialogTitle>
            <DialogDescription>
              {t("projects.detail.newProjectExpenseDescription") ??
                "Añade un nuevo gasto al proyecto."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="gasto_descripcion">
                {t("projects.detail.expenseDescription") ?? "Descripción"}
              </Label>
              <Input
                id="gasto_descripcion"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder={t("projects.detail.expenseDescriptionPlaceholder") ?? "Ej: gasto viaje"}
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="gasto_importe">
                  {t("projects.detail.expenseAmount") ?? "Importe"}
                </Label>
                <Input
                  id="gasto_importe"
                  value={importe}
                  onChange={(e) => setImporte(e.target.value)}
                  placeholder={t("projects.detail.expenseAmountPlaceholder") ?? "1200"}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gasto_fecha">
                  {t("projects.detail.expenseDate") ?? "Fecha"}
                </Label>
                <Input
                  id="gasto_fecha"
                  type="date"
                  value={fechaGasto}
                  onChange={(e) => setFechaGasto(e.target.value)}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
              {t("projects.detail.cancel") ?? "Cancelar"}
            </Button>
            <Button
              type="button"
              className="bg-blue-600 text-white hover:bg-blue-600/90"
              disabled={saving || !descripcion.trim() || !importe.trim()}
              onClick={() => void handleCreate()}
            >
              {saving
                ? t("projects.detail.saving") ?? "Guardando..."
                : t("projects.detail.save") ?? "Guardar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ProjectGastosCard

