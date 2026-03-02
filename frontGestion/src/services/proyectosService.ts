import { API_ROUTES } from "@/const/api"
import { axiosInstance } from "@/services/http"
import { MasterType } from "@/types/masterTypes"

export type ProyectoAsignacion = {
  id: number
  codigo: string
  empleado_id: number
  empleado_name: string
  empleado_email: string
  rol_proyecto_id: number
  rol_proyecto_name: string
  fecha_inicio: string
  fecha_final: string | null
  activo: boolean
  porcentaje_asignacion: string
}

export type Proyecto = {
  id: number
  codigo: number
  nombre: string
  cliente: string
  modelo_proyecto_id: number
  descripcion: string | null
  tarifa: string
  fecha_inicio: string
  fecha_final_prevista: string | null
  fecha_final: string | null
  pais_id: number
  ciudad: string
  responsable_id: number
  responsable_nombre: string
  asignaciones?: ProyectoAsignacion[]
}

export type ProyectoListResponse = {
  items: Proyecto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export async function getProyectos(params?: { page?: number; limit?: number }) {
  const { page, limit } = params ?? {}
  const { data } = await axiosInstance.get<ProyectoListResponse>(API_ROUTES.PROYECTOS, {
    params: {
      page,
      limit,
    },
  })
  return data
}

export async function createProyecto(proyecto: Proyecto) {
  const { data } = await axiosInstance.post<Proyecto>(API_ROUTES.PROYECTOS, proyecto)
  return data
}

export async function getProyectoById(id: number) {
  const { data } = await axiosInstance.get<Proyecto>(`${API_ROUTES.PROYECTOS}/${id}`)
  return data
}

export async function deleteProyecto(id: number) {
  await axiosInstance.delete(`${API_ROUTES.PROYECTOS}/${id}`)
}

export async function updateProyecto(proyecto: Proyecto) {
  const { data } = await axiosInstance.put<Proyecto>(`${API_ROUTES.PROYECTOS}/${proyecto.id}`, proyecto)
  return data
}

export async function getModelosProyecto() {
  const { data } = await axiosInstance.get<MasterType[]>(API_ROUTES.MODELO_PROYECTO)
  return data
}

export async function getRolesProyecto() {
  const { data } = await axiosInstance.get<MasterType[]>(API_ROUTES.ROL_PROYECTO)
  return data
}
