import { Suspense, lazy } from 'react';
import { LoadingScreen } from '@/components/loadingScreen';

const ProyectsTable = lazy(() =>
  import('@/pages/proyects/proyectsTable').then((m) => ({
    default: m.default,
  })),
);

const ProyectForm = lazy(() =>
  import('@/pages/proyects/proyectForm').then((m) => ({
    default: m.default,
  })),
);

const ProyectDetail = lazy(() =>
  import('@/pages/proyects/proyectDetail').then((m) => ({
    default: m.default,
  })),
);

export const proyectsRoutes = [
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
  {
    path: '/proyects/:id',
    element: (
      <Suspense fallback={<LoadingScreen />}>
        <ProyectDetail />
      </Suspense>
    ),
  },
];

