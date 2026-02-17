import { API_ROUTES } from "@/const/api";
import { axiosInstance } from "./http";
import { MasterType } from "@/types/masterTypes";


export async function getPerfiles() {
    const { data } = await axiosInstance.get<MasterType[]>(API_ROUTES.PERFILES);
    return data;
}