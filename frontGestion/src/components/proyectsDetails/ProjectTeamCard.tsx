import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type TFunction = (key: string, options?: Record<string, unknown>) => string | undefined

export type TeamMemberAssignment = {
  id: number
  nombre: string
  apellido: string
  perfilNombre?: string | null
  rol: string
  fecha_inicio?: string | null
  fecha_fin?: string | null
  porcentaje?: string | number | null
}

type Props = {
  t: TFunction
  members: TeamMemberAssignment[]
  summaryCount?: number
  showAssignButton?: boolean
  onAssignClick?: () => void
  assignButtonDisabled?: boolean
}

export const ProjectTeamCard = ({
  t,
  members,
  summaryCount,
  showAssignButton = false,
  onAssignClick,
  assignButtonDisabled,
}: Props) => {
  const count = summaryCount ?? members.length

  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader className="pb-3 flex flex-row items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div>
            <CardTitle className="text-base font-semibold text-slate-900">
              {t("projectForm.sectionTeamTitle") ?? "Equipo del proyecto"}
            </CardTitle>
            <CardDescription>
              {t("projectForm.sectionTeamDescription") ??
                "Asigna los empleados que participarán en este proyecto."}
            </CardDescription>
          </div>

          {members.length > 0 && (
            <div className="mt-2 overflow-hidden rounded-lg border border-slate-200 bg-slate-50/60">
              <Table className="text-[11px]">
                <TableHeader className="bg-slate-100/80 uppercase tracking-wide text-slate-500">
                  <TableRow>
                    <TableHead className="px-3 py-2 text-left">
                      {t("projectForm.teamColumnEmployee") ?? "Empleado"}
                    </TableHead>
                    <TableHead className="px-3 py-2 text-right">
                      {t("projectForm.assignDialogFieldRol") ?? "Rol"}
                    </TableHead>
                    <TableHead className="px-3 py-2 text-right">
                      {t("projectForm.assignDialogFieldStart") ?? "Inicio"}
                    </TableHead>
                    <TableHead className="px-3 py-2 text-right">
                      {t("projectForm.assignDialogFieldEnd") ?? "Fin"}
                    </TableHead>
                    <TableHead className="px-3 py-2 text-right">
                      {t("projectForm.assignDialogFieldPercent") ?? "% dedicación"}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map(
                    ({
                      id,
                      nombre,
                      apellido,
                      perfilNombre,
                      rol,
                      fecha_inicio,
                      fecha_fin,
                      porcentaje,
                    }) => (
                      <TableRow key={id} className="align-middle text-slate-700">
                        <TableCell className="px-3 py-2 text-left">
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-medium text-slate-900">
                              {nombre} {apellido}
                            </p>
                            <p className="truncate text-slate-500">
                              {perfilNombre ?? "-"}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="px-3 py-2 text-right">
                          <span className="inline-flex rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700">
                            {rol || (t("projectForm.assignDialogPlaceholderRol") ?? "-")}
                          </span>
                        </TableCell>
                        <TableCell className="px-3 py-2 text-right">
                          {fecha_inicio || "-"}
                        </TableCell>
                        <TableCell className="px-3 py-2 text-right">
                          {fecha_fin || "-"}
                        </TableCell>
                        <TableCell className="px-3 py-2 text-right">
                          <span className="inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                            {porcentaje ?? "-"}%
                          </span>
                        </TableCell>
                      </TableRow>
                    ),
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
        <div className="flex flex-col items-end gap-1 text-right">
          <p className="text-xs text-slate-500">
            {t("projectForm.teamSummary", {
              count,
            }) ?? `Empleados seleccionados: ${count}`}
          </p>
          {showAssignButton && (
            <Button
              type="button"
              size="sm"
              className="bg-blue-600 text-white hover:bg-blue-600/90"
              onClick={onAssignClick}
              disabled={assignButtonDisabled}
            >
              {t("projectForm.buttonAssignEmployees") ?? "Asignar empleados"}
            </Button>
          )}
        </div>
      </CardHeader>
    </Card>
  )
}

