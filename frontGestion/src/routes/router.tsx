import { Suspense, lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { LoadingScreen } from '@/components/loadingScreen';
import { employeesRoutes } from '@/routes/employeesRoutes';
import { proyectsRoutes } from '@/routes/proyectsRoutes';

const LoginPage = lazy(() =>
  import('@/pages/login/login').then((m) => ({ default: m.LoginPage })),
);

const DashboardPage = lazy(() =>
  import('@/pages/dashboard/dashboard').then((m) => ({
    default: m.DashboardPage,
  })),
);

const AppLayout = lazy(() =>
  import('@/components/layout/AppLayout').then((m) => ({
    default: m.AppLayout,
  })),
);

export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <Suspense fallback={<LoadingScreen />}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: '/',
    element: (
      <Suspense fallback={<LoadingScreen />}>
        <AppLayout />
      </Suspense>
    ),
    children: [
      {
        path: '/home',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <DashboardPage />
          </Suspense>
        ),
      },
      ...employeesRoutes,
      ...proyectsRoutes,
    ],
  },
]);