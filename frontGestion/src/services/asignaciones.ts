import { API_ROUTES } from "@/const/api"
import { axiosInstance } from "@/services/http"

export type AsignacionFinalizacion = {
  id: number
  proyecto_id: number
  empleado_id: number
  nombre: string | null
  apellido: string | null
  perfil_id: number | null
  perfil_name: string | null
  rol_proyecto_id: number
  rol_proyecto_name: string | null
  fecha_final: string | null
  activo: boolean | null
  porcentaje_asignacion: string | number | null
  nombre_proyecto: string | null
  cliente: string | null
  modelo_proyecto_id: number | null
  modelo_proyecto_name: string | null
  responsable_id: number | null
  responsable_name: string | null
  rol_proyecto: string | null
}

export async function getFinalizaciones() {
  const { data } = await axiosInstance.get<AsignacionFinalizacion[]>(
    API_ROUTES.ASIGNACIONES + "/finalizaciones",
  )
  return data
}

export async function updateAsignacionPorcentaje(
  asignacionId: number,
  porcentajeAsignacion: number,
) {
  await axiosInstance.put(`${API_ROUTES.ASIGNACIONES}/${asignacionId}`, {
    porcentaje_asignacion: porcentajeAsignacion,
  })
}