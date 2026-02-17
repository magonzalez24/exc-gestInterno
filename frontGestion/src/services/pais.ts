import { API_ROUTES } from "@/const/api";
import { axiosInstance } from "./http";
import { MasterType } from "@/types/masterTypes";



export async function getPaises() {
    const { data } = await axiosInstance.get<MasterType[]>(API_ROUTES.PAISES);
    return data;
}