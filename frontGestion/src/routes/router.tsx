import { Suspense, lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { LoadingScreen } from '@/components/loadingScreen';
import ProyectForm from '@/pages/proyects/proyectForm';

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

const EmployeesTable = lazy(() =>
  import('@/pages/employees/employeesTable').then((m) => ({
    default: m.default,
  })),
);

const EmployeeForm = lazy(() =>
  import('@/pages/employees/employeeForm').then((m) => ({
    default: m.default,
  })),
);

const ProyectsTable = lazy(() =>
  import('@/pages/proyects/proyectsTable').then((m) => ({
    default: m.default,
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
      {
        path: '/employees',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <EmployeesTable />
          </Suspense>
        ),
      },
      {
        path: '/employees/new',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <EmployeeForm />
          </Suspense>
        ),
      },
      {
        path: '/employees/:id',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <EmployeeForm />
          </Suspense>
        ),
      },
      {
        path: '/proyects',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <ProyectsTable />
          </Suspense>
        ),
      },
      {
        path: '/proyects/new',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <ProyectForm />
          </Suspense>
        ),
      },
    ],
  },
]);
