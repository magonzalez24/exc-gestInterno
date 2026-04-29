import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/useAuth";
import CardProyects from "@/components/dashboardPage/cardProyects";
import CardAsignacionesFinalizacion from "@/components/dashboardPage/cardAsignacionesFinalizacion";


export const DashboardPage = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  console.log(user);

  return (
    <div className="min-h-screen bg-background px-6 py-8">
      <div className="mb-6 flex flex-row items-end gap-2">
        <h1 className="text-3xl font-bold text-primary">
          Bienvenido! 
        </h1>
        <p className="text-3xl text-muted-foreground">
          {String(user.nombre)} {String(user.apellido)}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <>
          <CardProyects />
          <CardAsignacionesFinalizacion />
        </>
      </div>
    </div>
  );
};

export default DashboardPage;
