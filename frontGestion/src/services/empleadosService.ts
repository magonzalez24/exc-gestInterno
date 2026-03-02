import { API_ROUTES } from '@/const/api';
import { axiosInstance } from '@/services/http';

export type Asignacion = {
  id: number;
  codigo: string;
  proyecto_id: number;
  proyecto_name: string | null;
  rol_proyecto_id: number;
  rol_proyecto_name: string | null;
  fecha_inicio: string;
  fecha_final: string | null;
  activo: boolean;
  porcentaje_asignacion: string;
  responsable_id: number | null;
  responsable_name: string;
};

export type Empleado = {
  id: number;
  codigo_empleado: string;
  nombre: string;
  apellido: string;
  email: string | null;
  telefono: string | null;
  perfil_id: number;
  perfil_nombre: string | null;
  dimension_id: number;
  dimension_nombre: string | null;
  modelo_contratacion_id: number;
  modelo_contratacion_nombre: string | null;
  pais_id: number;
  pais_nombre: string | null;
  fecha_alta: string;
  fecha_baja: string | null;
  razon_baja: string | null;
  activo: boolean | null;
  sba: number | null;
  cv_url: string | null;
  asignaciones?: Asignacion[];
};

export type EmpleadosPageParams = {
  page?: number;
  limit?: number;
};

export type EmpleadosPageResponse = {
  items: Empleado[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export async function getEmpleados(params?: EmpleadosPageParams): Promise<EmpleadosPageResponse> {
  const searchParams = new URLSearchParams();
  if (params?.page != null) searchParams.set('page', String(params.page));
  if (params?.limit != null) searchParams.set('limit', String(params.limit));
  const query = searchParams.toString();
  const url = query ? `${API_ROUTES.EMPLEADOS}?${query}` : API_ROUTES.EMPLEADOS;
  const { data } = await axiosInstance.get<EmpleadosPageResponse>(url);
  return data;
}

export type DeleteEmpleadoOptions = {
  razon_baja?: string;
};

export async function deleteEmpleado(id: number, options?: DeleteEmpleadoOptions) {
  const today = new Date().toISOString().slice(0, 10);
  await axiosInstance.delete(`${API_ROUTES.EMPLEADOS}/${id}`, {
    data: {
      fecha_baja: today,
      razon_baja: options?.razon_baja ?? null,
    },
  });
}

export async function createEmpleado(empleado: any) {
  const { data } = await axiosInstance.post<any>(API_ROUTES.EMPLEADOS, empleado);
  return data;
}

export async function getEmpleadoById(id: number) {
  const { data } = await axiosInstance.get<Empleado>(`${API_ROUTES.EMPLEADOS}/${id}`);
  return data;
}

export async function updateEmpleado(id: number, empleado: any) {
  const { data } = await axiosInstance.put<any>(`${API_ROUTES.EMPLEADOS}/${id}`, empleado);
  return data;
}