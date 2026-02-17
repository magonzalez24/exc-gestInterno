import { API_ROUTES } from "@/const/api"
import { axiosInstance } from "@/services/http"

export type Dimension = {
  id: number
  codigo: string
  descripcion: string
  activo: boolean | null
}

export async function getDimensiones() {
  const { data } = await axiosInstance.get<Dimension[]>(API_ROUTES.DIMENSIONES)
  return data
}