import { Info } from "lucide-react";
import { Card, CardTitle, CardHeader, CardContent } from "../ui/card";
import { Proyecto } from "@/services/proyectosService";

interface ProjectGeneralInfoCardProps {
    proyecto: Proyecto;
  }
  
  export default function ProjectGeneralInfoCard({ proyecto }: ProjectGeneralInfoCardProps) {
    return (
      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader className="flex flex-row items-center gap-3 pb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50">
            <Info className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              General Information
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Client
            </p>
            <p className="text-sm font-semibold text-slate-900">
              {proyecto.cliente || "-"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Project Model
            </p>
            <p className="text-sm font-semibold text-slate-900">
              {proyecto.modelo_proyecto_id || "-"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Description
            </p>
            <p className="text-sm text-slate-700">
              {proyecto.descripcion || "-"}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  };