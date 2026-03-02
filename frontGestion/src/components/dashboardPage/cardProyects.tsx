import { useEffect, useState } from "react";
import { Card, CardTitle, CardHeader, CardContent, CardDescription } from "../ui/card"
import { getProyectos, Proyecto } from "@/services/proyectosService";

 const CardProyects = () => {
    const [proyectos, setProyectos] = useState<Proyecto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
    const loadProyectos = async () => {
      try {
        const data = await getProyectos();
        console.log(data);
        const firstFiveProjects = data.items.slice(0, 5);
        console.log(firstFiveProjects);
        setProyectos(firstFiveProjects);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Error al cargar los proyectos'
        );
      } finally {
        setLoading(false);
      }
    };

    void loadProyectos();
  }, []);


    return (
    <Card className="overflow-hidden rounded-xl border-0 bg-white shadow-md">
        <CardHeader className="flex flex-row justify-between items-center">
        <div>
          <CardTitle className="text-base font-semibold">Últimos Proyectos</CardTitle>
          <CardDescription className="text-xs">
            Últimos proyectos creados.
          </CardDescription>
        </div>
          <h1>{proyectos.length} Total</h1>
        </CardHeader>
        <CardContent>
          <ul>
            {proyectos.map((proyecto) => (
              <li className="text-sm text-muted-foreground" key={proyecto.id}>{proyecto.nombre}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    )    
}


export default CardProyects;