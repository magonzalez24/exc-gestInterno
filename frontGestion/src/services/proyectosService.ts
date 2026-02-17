import { API_ROUTES } from '@/const/api';
import { axiosInstance } from '@/services/http';
import { MasterType } from '@/types/masterTypes';

export type Proyecto = {
  id: number;
  codigo: number;
  nombre: string;
  cliente: string;
  modelo_proyecto_id: number;
  descripcion: string | null;
  tarifa: string;
  fecha_inicio: string;
  fecha_final_prevista: string | null;
  fecha_final: string | null;
  pais_id: number;
  ciudad: string;
  responsable_id: number;
  responsable_nombre: string;
};


export async function getProyectos() {
  const { data } = await axiosInstance.get<Proyecto[]>(API_ROUTES.PROYECTOS);
  return data;
}

export async function createProyecto(proyecto: Proyecto) {
  const { data } = await axiosInstance.post<Proyecto>(API_ROUTES.PROYECTOS, proyecto);
  return data;
}

export async function deleteProyecto(id: number) {
  await axiosInstance.delete(`${API_ROUTES.PROYECTOS}/${id}`);
}

export async function getModelosProyecto() {
  const { data } = await axiosInstance.get<MasterType[]>(API_ROUTES.MODELO_PROYECTO);
  return data;
}

export async function getRolesProyecto() {
  const { data } = await axiosInstance.get<MasterType[]>(API_ROUTES.ROL_PROYECTO);
  return data;
}
