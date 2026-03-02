import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { getEmpleadoById, type Empleado } from "@/services/empleadosService";
import { LoadingScreen } from "@/components/loadingScreen";
import { useI18n } from "@/i18n";
import {
  FileText,
  Calendar,
  Clock,
  Edit,
  Camera,
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const EmployeeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useI18n();
  const [empleado, setEmpleado] = useState<Empleado | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadEmpleado = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await getEmpleadoById(Number(id));
        setEmpleado(data);
      } catch (error) {
        console.error("Error al cargar empleado:", error);
      } finally {
        setLoading(false);
      }
    };

    void loadEmpleado();
  }, [id]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!empleado) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 py-8">
        <div className="mx-auto max-w-7xl">
          <p>{t("employeeDetail.notFound")}</p>
        </div>
      </div>
    );
  }

  const asignaciones = empleado.asignaciones || [];
  const filteredAsignaciones = asignaciones.filter((asig) =>
    asig.proyecto_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calcular métricas
  const totalProjects = asignaciones.length;
  const activeProjects = asignaciones.filter((a) => a.activo).length;
  const totalUtilization = asignaciones.reduce((sum, a) => {
    return sum + (Number(a.porcentaje_asignacion) || 0);
  }, 0);
  const currentUtilization = Math.min(100, totalUtilization);

  // Calcular antigüedad en años
  const fechaAlta = new Date(empleado.fecha_alta);
  const hoy = new Date();
  const diffTime = Math.abs(hoy.getTime() - fechaAlta.getTime());
  const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);
  const tenure = diffYears.toFixed(1);

  // Formatear fechas
  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      month: "short",
      year: "numeric",
    });
  };

  const formatDateRange = (start: string, end: string | null) => {
    const startFormatted = formatDate(start);
    const endFormatted = end ? formatDate(end) : t("employeeDetail.present");
    return `${startFormatted} - ${endFormatted}`;
  };

  const getStatusColor = (activo: boolean, fechaFinal: string | null) => {
    if (!activo) return "text-gray-500";
    if (fechaFinal) {
      const endDate = new Date(fechaFinal);
      const today = new Date();
      const daysUntilEnd = Math.ceil(
        (endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysUntilEnd < 30) return "text-red-500";
      if (daysUntilEnd < 90) return "text-yellow-500";
    }
    return "text-green-500";
  };

  const getStatusText = (activo: boolean, fechaFinal: string | null) => {
    if (!activo) return t("employeeDetail.statusFinished");
    if (fechaFinal) {
      const endDate = new Date(fechaFinal);
      const today = new Date();
      const daysUntilEnd = Math.ceil(
        (endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysUntilEnd < 30) return t("employeeDetail.statusCritical");
      if (daysUntilEnd < 90) return t("employeeDetail.statusEndingSoon");
      return t("employeeDetail.statusInProgress");
    }
    return t("employeeDetail.statusInProgress");
  };

  const getRoleBadgeColor = (rol: string | null) => {
    if (!rol) return "bg-gray-100 text-gray-700";
    const rolLower = rol.toLowerCase();
    if (rolLower.includes("lead") || rolLower.includes("líder")) {
      return "bg-blue-100 text-blue-700";
    }
    if (rolLower.includes("senior")) {
      return "bg-blue-100 text-blue-700";
    }
    if (rolLower.includes("auditor")) {
      return "bg-yellow-100 text-yellow-700";
    }
    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header con breadcrumb y botones de acción */}
        <div className="flex items-center justify-between">
          <PageBreadcrumb
            backHref="/employees"
            backLabel={t("sidebar.employees")}
            title={`${empleado.nombre} ${empleado.apellido}`}
          />
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              <FileText className="h-4 w-4" />
              {t("employeeDetail.header.exportPdf")}
            </Button>
            <Button className="gap-2 bg-blue-600 text-white hover:bg-blue-700">
              <Edit className="h-4 w-4" />
              {t("employeeDetail.header.saveChanges")}
            </Button>
          </div>
        </div>

        {/* Sección de Perfil del Empleado */}
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-2xl font-semibold">
                  {empleado.nombre.charAt(0)}
                  {empleado.apellido.charAt(0)}
                </div>
                <button className="absolute bottom-0 right-0 rounded-full bg-white p-2 shadow-md border border-slate-200 hover:bg-slate-50">
                  <Camera className="h-4 w-4 text-slate-600" />
                </button>
              </div>

              {/* Información Principal */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-slate-900">
                    {empleado.nombre} {empleado.apellido}
                  </h2>
                  <Badge
                    className={
                      empleado.activo
                        ? "bg-green-100 text-green-700 border-green-200"
                        : "bg-red-100 text-red-700 border-red-200"
                    }
                  >
                    {empleado.activo ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <p className="text-base text-slate-600">
                    {empleado.perfil_nombre || t("employeeDetail.noProfile")}
                  </p>
                  <span className="text-slate-400">•</span>
                  <p className="text-base text-slate-600">
                    {empleado.dimension_nombre || t("employeeDetail.noDimension")}
                  </p>
                </div>

                {/* Detalles del Empleado */}
                <div className="grid grid-cols-2 gap-6 mt-4">
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        {t("employeeDetail.employeeIdLabel")}
                      </p>
                      <p className="text-sm text-slate-900 mt-1">
                        {empleado.codigo_empleado}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        {t("employeeDetail.locationLabel")}
                      </p>
                      <p className="text-sm text-slate-900 mt-1">
                        {empleado.pais_nombre || t("employeeDetail.notAvailable")}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        {t("employeeDetail.emailLabel")}
                      </p>
                      <p className="text-sm text-slate-900 mt-1">
                        {empleado.email || t("employeeDetail.notAvailable")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        {t("employeeDetail.phoneLabel")}
                      </p>
                      <p className="text-sm text-slate-900 mt-1">
                        {empleado.telefono || t("employeeDetail.notAvailable")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        {t("employeeDetail.joinDateLabel")}
                      </p>
                      <p className="text-sm text-slate-900 mt-1">
                        {formatDate(empleado.fecha_alta) || t("employeeDetail.notAvailable")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botón de edición */}
              <button className="text-slate-400 hover:text-slate-600">
                <Edit className="h-5 w-5" />
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Tarjetas de Resumen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Total Projects */}
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">
                    {t("employeeDetail.totalProjectsTitle")}
                  </p>
                  <p className="text-3xl font-bold text-slate-900">
                    {totalProjects}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    {t("employeeDetail.totalProjectsActive", {
                      count: activeProjects,
                    })}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Utilization */}
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-600 mb-1">
                    {t("employeeDetail.utilizationTitle")}
                  </p>
                  <p className="text-3xl font-bold text-slate-900">
                    {currentUtilization}%
                  </p>
                  <p
                    className={`text-xs mt-1 ${
                      currentUtilization <= 100
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {currentUtilization <= 100
                      ? t("employeeDetail.utilizationWithinTarget")
                      : t("employeeDetail.utilizationOverAllocated")}
                  </p>
                  <div className="mt-2 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        currentUtilization <= 100
                          ? "bg-blue-600"
                          : "bg-red-600"
                      }`}
                      style={{ width: `${Math.min(100, currentUtilization)}%` }}
                    />
                  </div>
                </div>
                <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center ml-4">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tenure */}
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">
                    {t("employeeDetail.tenureTitle")}
                  </p>
                  <p className="text-3xl font-bold text-slate-900">{tenure}</p>
                  <p className="text-xs text-slate-600 mt-1">
                    {t("employeeDetail.tenureYears")}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sección de Proyectos Asignados */}
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg font-semibold text-slate-900">
              {t("employeeDetail.assignedProjectsTitle")}
            </CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  type="text"
                  placeholder={t("employeeDetail.searchProjectsPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <Button className="gap-2 bg-blue-600 text-white hover:bg-blue-700">
                <Plus className="h-4 w-4" />
                {t("employeeDetail.assignProjectButton")}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table className="border-0">
                <TableHeader>
                  <TableRow className="border-b border-gray-200 bg-gray-50/80 hover:bg-transparent">
                    <TableHead className="h-11 px-5 font-semibold text-gray-600">
                      {t("employeeDetail.table.projectName")}
                    </TableHead>
                    <TableHead className="px-5 font-semibold text-gray-600">
                      {t("employeeDetail.table.role")}
                    </TableHead>
                    <TableHead className="px-5 font-semibold text-gray-600">
                      {t("employeeDetail.table.timeline")}
                    </TableHead>
                    <TableHead className="px-5 font-semibold text-gray-600">
                      {t("employeeDetail.table.involvement")}
                    </TableHead>
                    <TableHead className="px-5 text-right font-semibold text-gray-600">
                      {t("employeeDetail.table.actions")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAsignaciones.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-8 text-slate-500"
                      >
                        {t("employeeDetail.noProjects")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAsignaciones.map((asignacion) => {
                      const porcentaje = Number(
                        asignacion.porcentaje_asignacion
                      );
                      const isOver100 = porcentaje > 100;
                      const fechaFinal = asignacion.fecha_final;
                      const endDate = fechaFinal ? new Date(fechaFinal) : null;
                      const today = new Date();
                      const daysLeft = endDate
                        ? Math.ceil(
                            (endDate.getTime() - today.getTime()) /
                              (1000 * 60 * 60 * 24)
                          )
                        : null;

                      return (
                        <TableRow
                          key={asignacion.id}
                          className="hover:bg-slate-50"
                        >
                          <TableCell className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                <FileText className="h-4 w-4 text-blue-600" />
                              </div>
                              <span className="text-sm font-medium text-slate-900">
                                {asignacion.proyecto_name || t("employeeDetail.noProjectName")}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="px-5 py-4">
                            <Badge
                              className={getRoleBadgeColor(
                                asignacion.rol_proyecto_name
                              )}
                            >
                              {asignacion.rol_proyecto_name || t("employeeDetail.noRole")}
                            </Badge>
                          </TableCell>
                          <TableCell className="px-5 py-4">
                            <div className="text-sm text-slate-900">
                              {formatDateRange(
                                asignacion.fecha_inicio,
                                asignacion.fecha_final
                              )}
                            </div>
                            {daysLeft !== null && asignacion.activo && (
                              <div className="text-xs text-slate-500 mt-1">
                                {daysLeft > 0
                                  ? t("employeeDetail.daysLeft", {
                                      count: daysLeft,
                                    })
                                  : t("employeeDetail.statusFinished")}
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${
                                    isOver100
                                      ? "bg-red-500"
                                      : "bg-blue-600"
                                  }`}
                                  style={{ width: `${Math.min(100, porcentaje)}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium text-slate-900 min-w-12 text-right">
                                {porcentaje}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="px-5 py-4">
                            <span
                              className={`text-sm ${getStatusColor(
                                asignacion.activo,
                                asignacion.fecha_final
                              )}`}
                            >
                              {getStatusText(
                                asignacion.activo,
                                asignacion.fecha_final
                              )}
                            </span>
                          </TableCell>
                          <TableCell className="px-5 py-4 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                navigate(`/proyects/${asignacion.proyecto_id}`)
                              }
                            >
                              {t("employeeDetail.button.viewProject")}
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Advertencia si la asignación total excede 100% */}
            {totalUtilization > 100 && (
              <div className="mt-4 px-5 pb-4">
                <p className="text-sm text-yellow-600 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2">
                  {t("employeeDetail.warning.overAllocation")}
                </p>
              </div>
            )}

            {/* Paginación */}
            {filteredAsignaciones.length > 0 && (
              <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-slate-200">
                <Button variant="outline" size="sm" disabled>
                  <ChevronLeft className="h-4 w-4" />
                  {t("employeeDetail.pagination.previous")}
                </Button>
                <Button variant="outline" size="sm" disabled>
                  {t("employeeDetail.pagination.next")}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeDetail;
