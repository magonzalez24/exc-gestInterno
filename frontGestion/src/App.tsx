
import { RouterProvider } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import { AuthProvider } from './context/AuthContext';
import { router } from './routes/router';

function App() {
  return (
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster />
      </AuthProvider>
  );
}

export default App;

