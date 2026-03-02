import { Suspense, lazy } from 'react';
import { LoadingScreen } from '@/components/loadingScreen';
import EmployeeDetail from '@/pages/employees/employeeDetail';

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

export const employeesRoutes = [
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
    path: '/employees/detail/:id',
    element: (
      <Suspense fallback={<LoadingScreen />}>
        <EmployeeDetail />
      </Suspense>
    ),
  },
  {
    path: '/employees/edit/:id',
    element: (
      <Suspense fallback={<LoadingScreen />}>
        <EmployeeForm />
      </Suspense>
    ),
  },
];

