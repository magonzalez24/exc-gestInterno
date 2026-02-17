import { RollerCoaster } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

if (!API_BASE_URL) {
  // Aviso en consola para detectar rápidamente errores de configuración
  console.warn(
    '[API] VITE_API_BASE_URL no está definida. Revisa tu archivo .env en el front.'
  );
}

export const API_ROUTES = {
  AUTH_LOGIN: `/auth/login`,
  AUTH_LOGOUT: `/auth/logout`,
  AUTH_ME: `/auth/me`,
  PROYECTOS: `/proyectos`,
  EMPLEADOS: `/empleados`,      
  DIMENSIONES: `/dimensiones`,
  PERFILES: `/perfiles`,
  MODELO_CONTRATACION: `/modelos-contratacion`,
  PAISES: `/paises`,
  MODELO_PROYECTO: `/modelos-proyecto`,
  ROL_PROYECTO: `/roles-proyecto`,
  ASIGNACIONES: `/asignaciones`,
} as const; 

export type ApiRouteKey = keyof typeof API_ROUTES;

export { API_BASE_URL };

