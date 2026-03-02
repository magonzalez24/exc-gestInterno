import { Info } from "lucide-react";
import { Card, CardTitle, CardHeader, CardContent } from "../ui/card";
import { Proyecto } from "@/services/proyectosService";

interface ProyectOverviewCardProps {
    proyecto: Proyecto;
  }
  
  export default function ProyectOverviewCard({ proyecto }: ProyectOverviewCardProps) {
    return (
      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader className="flex flex-row items-center gap-3 pb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50">
            <Info className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              Proyecto
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Pais
            </p>
            <p className="text-sm font-semibold text-slate-900">
              {proyecto.pais_id || "-"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Duracion
            </p>
            <p className="text-sm font-semibold text-slate-900">
              {proyecto.fecha_inicio?.split('T')[0] || "-"} - {proyecto.fecha_final_prevista?.split('T')[0] || "-"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Responsable / Proyect Manager
            </p>
            <p className="text-sm text-slate-700">
              {proyecto.responsable_nombre || "-"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Tarifa
            </p>
            <p className="text-sm text-slate-700">
              {proyecto.tarifa || "-"} €
            </p>
          </div>
        </CardContent>
      </Card>
    );
  };