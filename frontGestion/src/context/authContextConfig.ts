import { createContext } from 'react';
import type { Empleado } from '@/services/auth/authService';

export type AuthContextValue = {
  user: Empleado | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (params: { usernameOrEmail: string; password: string }) => Promise<void>;
  /** Llama al servicio de logout (POST /auth/logout) y luego limpia token y usuario en el cliente */
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
