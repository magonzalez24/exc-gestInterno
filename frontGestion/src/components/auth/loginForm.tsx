import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { useAuth } from '@/context/useAuth';
import { useI18n } from '@/i18n';
import { useAppToast } from '@/hooks/useAppToast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import LogoExcelia from '@/assets/excelia.jpg';

type FieldError = {
  message: string;
};

type FormErrors = {
  email?: FieldError;
  password?: FieldError;
};

const loginSchema = yup.object({
  email: yup.string().trim().required('El email es obligatorio'),
  password: yup.string().trim().required('La contraseña es obligatoria'),
});

export const LoginForm = () => {
  const { login, loading } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const { showToast } = useAppToast();
  

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormErrors({});

    try {
      await loginSchema.validate({ email, password }, { abortEarly: false });
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const fieldErrors: FormErrors = {};
        err.inner.forEach((e) => {
          if (e.path) {
            fieldErrors[e.path as keyof FormErrors] = { message: e.message };
          }
        });
        setFormErrors(fieldErrors);
        return;
      }
    }

    try {
      await login({ usernameOrEmail: email, password });
      showToast(
        'success',
        t('auth.loginSuccess') ?? 'Inicio de sesión correcto'
      );
      navigate('/home');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Error inesperado al iniciar sesión';
      showToast(
        'error',
        t('auth.loginError') ?? 'Error al iniciar sesión',
        message
      );
    }
  };

  const isLoading = loading;
  const errors = formErrors;

  return (
    <div className="flex items-center justify-center min-h-screen bg-background  rounded-lg">
      <Card className="w-full max-w-md shadow-2xl rounded-lg">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
          <img src={LogoExcelia} alt="Logo" className="h-10" />
          </div>
          <CardTitle className="text-2xl text-center">
            {t('auth.loginTitle')}
          </CardTitle>
          <CardDescription className="text-center">
            {t('auth.loginDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('auth.email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email?.message && (
                <p className="text-sm text-destructive">
                  {String(errors.email.message)}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('auth.password')}</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password?.message && (
                <p className="text-sm text-destructive">
                  {String(errors.password.message)}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full cursor-pointer bg-blue-900 text-white hover:bg-blue-800/90"
              disabled={isLoading}
            >
              {isLoading ? t('auth.loggingIn') : t('auth.login')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;

