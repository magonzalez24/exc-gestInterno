import { Request, Response } from 'express';
import { authService } from '../services';

export const authController = {
  async login(req: Request, res: Response) {
    try {
      const { username, email, password } = req.body;
      const ip_address = req.ip || req.socket.remoteAddress;
      const user_agent = req.get('user-agent');

      const result = await authService.login({
        username,
        email,
        password,
        ip_address,
        user_agent,
      });

      res.json({ token: result.token });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error en el login';
      const status =
        message === 'Credenciales inválidas' || message === 'Usuario inactivo'
          ? 401
          : 400;
      res.status(status).json({ error: message });
    }
  },

  async logout(req: Request, res: Response) {
    try {
      const authHeader = req.get('Authorization');
      const token = authHeader?.startsWith('Bearer ')
        ? authHeader.slice(7)
        : req.body?.token;

      if (!token) {
        return res.status(400).json({ error: 'Token requerido' });
      }

      await authService.logout(token);
      res.status(204).send();
    } catch (error) {
      console.error('Error en authController.logout:', error);
      res.status(500).json({ error: 'Error al cerrar sesión' });
    }
  },

  async me(req: Request, res: Response) {
    try {
      const authHeader = req.get('Authorization');
      const token = authHeader?.startsWith('Bearer ')
        ? authHeader.slice(7)
        : req.query?.token;

      if (!token || typeof token !== 'string') {
        return res.status(401).json({ error: 'Token requerido' });
      }

      const empleado = await authService.verifyToken(token);
      if (!empleado) {
        return res.status(401).json({ error: 'Token inválido o expirado' });
      }else{
        res.json({
          codigo_empleado: empleado.codigo_empleado,
          nombre: empleado.nombre,
          apellido: empleado.apellido,
          perfil_id: empleado.perfil_id,
        });
      }

      
    } catch (error) {
      console.error('Error en authController.me:', error);
      res.status(500).json({ error: 'Error al verificar sesión' });
    }
  },
};
