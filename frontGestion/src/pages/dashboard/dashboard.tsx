import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/useAuth";
import { useI18n } from "@/i18n";
import CardProyects from "@/components/dashboardPage/cardProyects";
import CardAsignacionesFinalizacion from "@/components/dashboardPage/cardAsignacionesFinalizacion";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export const DashboardPage = () => {
  const { user } = useAuth();
  const { t } = useI18n();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background px-6 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary">
          {t("dashboard.welcome")}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <>
          <CardProyects />
          <CardAsignacionesFinalizacion />
          <Card className="overflow-hidden rounded-xl border-0 bg-white shadow-md">
            <CardHeader>
              <CardTitle>Empleados</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Empleados</p>
            </CardContent>
          </Card>
          <Card className="overflow-hidden rounded-xl border-0 bg-white shadow-md">
            <CardHeader>
              <CardTitle>Empleados</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Empleados</p>
            </CardContent>
          </Card>
        </>
      </div>
    </div>
  );
};

export default DashboardPage;
