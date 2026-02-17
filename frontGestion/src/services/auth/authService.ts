import { API_ROUTES } from '@/const/api';
import { axiosInstance } from '@/services/http';

export type Empleado = {
  id: number;
  username: string | null;
  email: string | null;
  activo: boolean | null;
  [key: string]: unknown;
};

export type LoginParams = {
  usernameOrEmail: string;
  password: string;
};

export type LoginResponse = {
  token: string;
};

export async function login({ usernameOrEmail, password }: LoginParams) {
  const body: Record<string, string> = { password };

  if (usernameOrEmail.includes('@')) {
    body.email = usernameOrEmail;
  } else {
    body.username = usernameOrEmail;
  }

  const { data } = await axiosInstance.post<LoginResponse>(API_ROUTES.AUTH_LOGIN, body);
  return data;
}

export async function logout(token: string | null) {
  if (!token) return;
  try {
    await axiosInstance.post(
      API_ROUTES.AUTH_LOGOUT,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  } catch (error) {
    console.error('Error en logout', error);
  }
}

export async function me( ) {
  const { data } = await axiosInstance.get<Empleado>(API_ROUTES.AUTH_ME);
  return data;
}

