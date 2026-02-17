import { MasterType } from "@/types/masterTypes";
import { axiosInstance } from "./http";
import { API_ROUTES } from "@/const/api";



export async function getModeloContratacion() {
    const { data } = await axiosInstance.get<MasterType[]>(API_ROUTES.MODELO_CONTRATACION);
    return data;
}