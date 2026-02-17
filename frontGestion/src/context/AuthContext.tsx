import { useCallback, useEffect, useState, type ReactNode } from 'react';
import type { AuthContextValue } from './authContextConfig';
import { AuthContext } from './authContextConfig';
import * as authService from '@/services/auth/authService';

const AUTH_TOKEN_KEY = 'auth_token';

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthContextValue['user']>(null);
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const clearSession = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(AUTH_TOKEN_KEY);
  };

  const fetchMe = useCallback(
    async () => {
      try {
        setLoading(true);
        const data = await authService.me();
        setUser(data);
      } catch (err) {
        console.error('Error al obtener el usuario actual', err);
        clearSession();
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (!token) return;
    void fetchMe();
  }, [token, fetchMe]);

  const login: AuthContextValue['login'] = async ({ usernameOrEmail, password }) => {
    setLoading(true);
    setError(null);
    try {
      const { token: newToken } = await authService.login({
        usernameOrEmail,
        password,
      });

      setToken(newToken);
      localStorage.setItem(AUTH_TOKEN_KEY, newToken);
    } catch (err) {
      console.error('Error en login', err);
      const message =
        err instanceof Error ? err.message : 'Error inesperado al iniciar sesión';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout: AuthContextValue['logout'] = async () => {
    try {
      await authService.logout(token); // POST /auth/logout con el token para invalidar sesión en el backend
    } catch (err) {
      console.error('Error al cerrar sesión', err);
    } finally {
      clearSession(); // Limpia token, user y localStorage
    }
  };

  const value: AuthContextValue = {
    user,
    token,
    loading,
    error,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
