import { FormEvent, useEffect, useState } from "react"
import * as yup from "yup"
import { useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProjectTeamCard, TeamMemberAssignment } from "@/components/proyectsDetails/ProjectTeamCard"
import { PageBreadcrumb } from "@/components/PageBreadcrumb"
import { CustomInput } from "@/components/CustomInput"
import CustomSelect, { CatalogOption } from "@/components/CustomSelect"
import { useI18n } from "@/i18n"
import { useAppToast } from "@/hooks/useAppToast"
import { LoadingScreen } from "@/components/loadingScreen"
import { ProjectEmployeesDialog, AsignacionEmpleado } from "@/components/ProjectEmployeesDialog"
import { createProyecto, getModelosProyecto } from "@/services/proyectosService"
import { getPaises } from "@/services/pais"
import { Empleado, getEmpleados } from "@/services/empleadosService"

type TFunction = (key: string) => string

const getProyectoSchema = (t: TFunction) =>
  yup.object({
    codigo: yup.string().trim().required(t("projectForm.validation.requiredCodigo")),
    nombre: yup.string().trim().required(t("projectForm.validation.requiredNombre")),
    cliente: yup.string().trim().required(t("projectForm.validation.requiredCliente")),
    modelo_proyecto_id: yup
      .string()
      .required(t("projectForm.validation.requiredModeloProyecto")),
    descripcion: yup.string().optional(),
    tarifa: yup.string().trim().required(t("projectForm.validation.requiredTarifa")),
    fecha_inicio: yup
      .string()
      .required(t("projectForm.validation.requiredFechaInicio")),
    fecha_final_prevista: yup.string().optional(),
    pais_id: yup.string().required(t("projectForm.validation.requiredPais")),
    ciudad: yup.string().trim().required(t("projectForm.validation.requiredCiudad")),
    responsable_id: yup
      .string()
      .required(t("projectForm.validation.requiredResponsable")),
  })

type FieldError = {
  message: string
}

type ProyectoFormValues = {
  codigo: string
  nombre: string
  cliente: string
  modelo_proyecto_id: string
  descripcion?: string
  tarifa: string
  fecha_inicio: string
  fecha_final_prevista?: string
  pais_id: string
  ciudad: string
  responsable_id: string
}

type ProyectoFormErrors = Partial<Record<keyof ProyectoFormValues, FieldError>>

const ProyectForm = () => {
  const navigate = useNavigate()
  const { t } = useI18n()
  const { showToast } = useAppToast()
  const proyectoSchema = getProyectoSchema(t)

  const [modeloProyectoOptions, setModeloProyectoOptions] = useState<CatalogOption[]>([])
  const [paisOptions, setPaisOptions] = useState<CatalogOption[]>([])
  const [responsableOptions, setResponsableOptions] = useState<CatalogOption[]>([])
  const [empleados, setEmpleados] = useState<Empleado[]>([])

  const [asignaciones, setAsignaciones] = useState<Record<number, AsignacionEmpleado>>({})
  const [empleadosSeleccionadosIds, setEmpleadosSeleccionadosIds] = useState<number[]>([])
  const [assignDialogOpen, setAssignDialogOpen] = useState(false)
  const [searchEmpleado, setSearchEmpleado] = useState("")

  const [values, setValues] = useState<ProyectoFormValues>({
    codigo: "",
    nombre: "",
    cliente: "",
    modelo_proyecto_id: "",
    descripcion: "",
    tarifa: "",
    fecha_inicio: "",
    fecha_final_prevista: "",
    pais_id: "",
    ciudad: "",
    responsable_id: "",
  })

  const [errors, setErrors] = useState<ProyectoFormErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [loadingInitial, setLoadingInitial] = useState(true)

  useEffect(() => {
    let cancelled = false

    const loadAll = async () => {
      setLoadingInitial(true)
      try {
        const [modelosProyecto, paises, empleadosPage] = await Promise.all([
          getModelosProyecto(),
          getPaises(),
          getEmpleados({ page: 1, limit: 999 }),
        ])

        if (cancelled) return

        setModeloProyectoOptions(modelosProyecto as CatalogOption[])
        setPaisOptions(paises as CatalogOption[])
        setEmpleados(empleadosPage.items)
        setResponsableOptions(
          empleadosPage.items.map((empleado) => ({
            id: empleado.id,
            codigo: empleado.codigo_empleado,
            descripcion: `${empleado.nombre} ${empleado.apellido}`.trim(),
            value: String(empleado.id),
            label: `${empleado.nombre} ${empleado.apellido}`.trim(),
          })) as CatalogOption[],
        )
      } catch (error) {
        if (!cancelled) {
          console.error("Error al cargar datos iniciales de proyecto", error)
        }
      } finally {
        if (!cancelled) setLoadingInitial(false)
      }
    }

    void loadAll()

    return () => {
      cancelled = true
    }
  }, [])

  const handleChange =
    (field: keyof ProyectoFormValues) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value
      setValues((prev) => ({ ...prev, [field]: value }))
    }

  const empleadosFiltrados = empleados.filter((empleado) => {
    const termino = searchEmpleado.toLowerCase().trim()
    if (!termino) return true
    const nombreCompleto = `${empleado.nombre} ${empleado.apellido}`.toLowerCase()
    return (
      nombreCompleto.includes(termino) ||
      empleado.codigo_empleado.toLowerCase().includes(termino) ||
      (empleado.perfil_nombre ?? "").toLowerCase().includes(termino)
    )
  })

  const toggleEmpleadoSeleccion = (empleado: Empleado) => {
    setEmpleadosSeleccionadosIds((prev) => {
      const alreadySelected = prev.includes(empleado.id)
      if (alreadySelected) {
        const next = prev.filter((id) => id !== empleado.id)
        setAsignaciones((asignacionesPrevias) => {
          const { [empleado.id]: _, ...rest } = asignacionesPrevias
          return rest
        })
        return next
      }

      setAsignaciones((asignacionesPrevias) => ({
        ...asignacionesPrevias,
        [empleado.id]: {
          empleado,
          rol: "",
          fecha_inicio: values.fecha_inicio,
          fecha_fin: values.fecha_final_prevista ?? "",
          porcentaje: "100",
        },
      }))

      return [...prev, empleado.id]
    })
  }

  const handleCambioAsignacion = (
    empleadoId: number,
    campo: keyof Omit<AsignacionEmpleado, "empleado">,
    valor: string,
  ) => {
    setAsignaciones((prev) => {
      const actual = prev[empleadoId]
      if (!actual) return prev
      return {
        ...prev,
        [empleadoId]: {
          ...actual,
          [campo]: valor,
        },
      }
    })
  }


  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrors({})

    try {
      const parsed = (await proyectoSchema.validate(values, {
        abortEarly: false,
      })) as ProyectoFormValues

      setSubmitting(true)

      // Construimos el payload de asignaciones para el backend
      const asignacionesPayload = empleadosSeleccionadosIds
        .map((id, index) => {
          const asignacion = asignaciones[id]
          if (!asignacion) return null

          const empleadoId = asignacion.empleado.id
          const rolProyectoId = asignacion.rol ? Number(asignacion.rol) : null

          if (!empleadoId) return null

          return {
            // Código de asignación: combinamos código de proyecto + índice para garantizar unicidad
            codigo: `ASIG-${parsed.codigo}-${index + 1}`,
            fecha_inicio: new Date(asignacion.fecha_inicio).toISOString() || parsed.fecha_inicio,
            fecha_final: asignacion.fecha_fin
              ? new Date(asignacion.fecha_fin).toISOString()
              : null,
            activo: true,
            porcentaje_asignacion: asignacion.porcentaje
              ? Number(asignacion.porcentaje)
              : 100,
            empleado_id: empleadoId,
            // Permitimos que el rol sea opcional (null) si el usuario no lo ha seleccionado aún
            rol_proyecto_id: rolProyectoId,
          }
        })
        .filter((item): item is NonNullable<typeof item> => item !== null)

      await createProyecto({
        // Campos gestionados en el formulario
        codigo: Number(parsed.codigo),
        nombre: parsed.nombre,
        cliente: parsed.cliente,
        modelo_proyecto_id: Number(parsed.modelo_proyecto_id),
        descripcion: parsed.descripcion || null,
        tarifa: parsed.tarifa,
        fecha_inicio: new Date(parsed.fecha_inicio).toISOString(),
        fecha_final_prevista: new Date(parsed.fecha_final_prevista ?? "").toISOString() || null,
        // Campos derivados / no presentes en el formulario
        fecha_final: null,
        pais_id: Number(parsed.pais_id),
        ciudad: parsed.ciudad,
        responsable_id: Number(parsed.responsable_id),
        id: 0,
        // NUEVO: asignaciones de empleados al proyecto
        asignaciones: asignacionesPayload,
      } as any)

      showToast("success", t("projectForm.toastSuccess") ?? "Proyecto creado correctamente")
      navigate("/proyects")
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const fieldErrors: ProyectoFormErrors = {}
        err.inner.forEach((e) => {
          if (e.path) {
            fieldErrors[e.path as keyof ProyectoFormValues] = {
              message: e.message,
            }
          }
        })
        setErrors(fieldErrors)
        return
      }

      console.error("Error al crear proyecto", err)
      const message = err instanceof Error ? err.message : t("projectForm.toastErrorDefault")
      showToast(
        "error",
        t("projectForm.toastError") ?? "Error al crear proyecto",
        message,
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (loadingInitial) {
    return <LoadingScreen />
  }

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Encabezado de página */}
        <div className="space-y-2">
          <PageBreadcrumb
            backHref="/proyects"
            backLabel={t("sidebar.projects") ?? "Proyectos"}
            title={t("projectForm.title") ?? "Nuevo proyecto"}
          />
          <p className="text-sm text-slate-600">
            {t("projectForm.subtitle") ??
              "Completa la información para dar de alta un nuevo proyecto."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información principal */}
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-slate-900">
                {t("projectForm.sectionMainTitle") ?? "Información del proyecto"}
              </CardTitle>
              <CardDescription>
                {t("projectForm.sectionMainDescription") ??
                  "Datos básicos del proyecto y cliente."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              <div className="grid gap-4 md:grid-cols-2">
                <CustomInput
                  id="nombre"
                  label={t("projectForm.fieldNombre") ?? "Nombre"}
                  required
                  requiredLabel={t("projectForm.required") ?? "Requerido"}
                  value={values.nombre}
                  onChange={handleChange("nombre")}
                  placeholder={t("projectForm.placeholderNombre") ?? "Nombre del proyecto"}
                  error={errors.nombre?.message}
                />
                <CustomInput
                  id="cliente"
                  label={t("projectForm.fieldCliente") ?? "Cliente"}
                  required
                  requiredLabel={t("projectForm.required") ?? "Requerido"}
                  value={values.cliente}
                  onChange={handleChange("cliente")}
                  placeholder={t("projectForm.placeholderCliente") ?? "Nombre del cliente"}
                  error={errors.cliente?.message}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <CustomInput
                  id="codigo"
                  label={t("projectForm.fieldCodigo") ?? "Código"}
                  required
                  requiredLabel={t("projectForm.required") ?? "Requerido"}
                  value={values.codigo}
                  onChange={handleChange("codigo")}
                  placeholder={t("projectForm.placeholderCodigo") ?? "Código interno"}
                  error={errors.codigo?.message}
                />

                <CustomSelect
                  label={t("projectForm.fieldModeloProyecto") ?? "Modelo de proyecto"}
                  required
                  placeholder={
                    t("projectForm.selectModeloProyecto") ?? "Selecciona un modelo de proyecto"
                  }
                  value={values.modelo_proyecto_id}
                  onChange={(value) =>
                    setValues((prev) => ({ ...prev, modelo_proyecto_id: value }))
                  }
                  options={modeloProyectoOptions}
                  error={errors.modelo_proyecto_id?.message}
                />

                <CustomInput
                  id="tarifa"
                  label={t("projectForm.fieldTarifa") ?? "Tarifa"}
                  required
                  requiredLabel={t("projectForm.required") ?? "Requerido"}
                  value={values.tarifa}
                  onChange={handleChange("tarifa")}
                  placeholder={t("projectForm.placeholderTarifa") ?? "Tarifa del proyecto"}
                  error={errors.tarifa?.message}
                />
              </div>

              <CustomInput
                id="descripcion"
                label={t("projectForm.fieldDescripcion") ?? "Descripción"}
                value={values.descripcion ?? ""}
                onChange={handleChange("descripcion")}
                placeholder={
                  t("projectForm.placeholderDescripcion") ??
                  "Descripción breve del alcance del proyecto"
                }
                error={errors.descripcion?.message}
              />
            </CardContent>
          </Card>

          {/* Fechas y localización */}
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-slate-900">
                {t("projectForm.sectionDatesLocationTitle") ??
                  "Fechas y localización"}
              </CardTitle>
              <CardDescription>
                {t("projectForm.sectionDatesLocationDescription") ??
                  "Planificación temporal y ubicación del proyecto."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              <div className="grid gap-4 md:grid-cols-3">
                <CustomInput
                  id="fecha_inicio"
                  label={t("projectForm.fieldFechaInicio") ?? "Fecha de inicio"}
                  required
                  requiredLabel={t("projectForm.required") ?? "Requerido"}
                  type="date"
                  value={values.fecha_inicio}
                  onChange={handleChange("fecha_inicio")}
                  error={errors.fecha_inicio?.message}
                />

                <CustomInput
                  id="fecha_final_prevista"
                  label={t("projectForm.fieldFechaFinalPrevista") ?? "Fecha fin prevista"}
                  type="date"
                  value={values.fecha_final_prevista ?? ""}
                  onChange={handleChange("fecha_final_prevista")}
                  error={errors.fecha_final_prevista?.message}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <CustomSelect
                  label={t("projectForm.fieldPais") ?? "País"}
                  required
                  placeholder={t("projectForm.selectPais") ?? "Selecciona un país"}
                  value={values.pais_id}
                  onChange={(value) =>
                    setValues((prev) => ({ ...prev, pais_id: value }))
                  }
                  options={paisOptions}
                  error={errors.pais_id?.message}
                />

                <CustomInput
                  id="ciudad"
                  label={t("projectForm.fieldCiudad") ?? "Ciudad"}
                  required
                  requiredLabel={t("projectForm.required") ?? "Requerido"}
                  value={values.ciudad}
                  onChange={handleChange("ciudad")}
                  placeholder={t("projectForm.placeholderCiudad") ?? "Ciudad principal"}
                  error={errors.ciudad?.message}
                />
              </div>
            </CardContent>
          </Card>

          {/* Responsable */}
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-slate-900">
                {t("projectForm.sectionResponsableTitle") ?? "Responsable del proyecto"}
              </CardTitle>
              <CardDescription>
                {t("projectForm.sectionResponsableDescription") ??
                  "Selecciona la persona responsable del proyecto."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              <CustomSelect
                label={t("projectForm.fieldResponsable") ?? "Responsable"}
                required
                placeholder={t("projectForm.selectResponsable") ?? "Selecciona un responsable"}
                value={values.responsable_id}
                onChange={(value) =>
                  setValues((prev) => ({ ...prev, responsable_id: value }))
                }
                options={responsableOptions}
                error={errors.responsable_id?.message}
              />
            </CardContent>
          </Card>

          {/* Equipo del proyecto */}
          <ProjectTeamCard
            t={t}
            members={empleadosSeleccionadosIds
              .map((id) => {
                const asignacion = asignaciones[id]
                if (!asignacion) return null

                const { empleado, rol, fecha_inicio, fecha_fin, porcentaje } = asignacion

                const member: TeamMemberAssignment = {
                  id,
                  nombre: empleado.nombre,
                  apellido: empleado.apellido,
                  perfilNombre: empleado.perfil_nombre,
                  rol,
                  fecha_inicio,
                  fecha_fin,
                  porcentaje,
                }

                return member
              })
              .filter((m): m is TeamMemberAssignment => m !== null)}
            summaryCount={empleadosSeleccionadosIds.length}
            showAssignButton
            onAssignClick={() => setAssignDialogOpen(true)}
            assignButtonDisabled={empleados.length === 0}
          />

          <ProjectEmployeesDialog
            open={assignDialogOpen}
            onOpenChange={setAssignDialogOpen}
            t={t}
            empleadosFiltrados={empleadosFiltrados}
            empleadosSeleccionadosIds={empleadosSeleccionadosIds}
            searchEmpleado={searchEmpleado}
            onSearchEmpleadoChange={setSearchEmpleado}
            asignaciones={asignaciones}
            toggleEmpleadoSeleccion={toggleEmpleadoSeleccion}
            handleCambioAsignacion={handleCambioAsignacion}
          />

          {/* Acciones */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/proyects")}
            >
              {t("projectForm.buttonCancel") ?? "Cancelar"}
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 text-white hover:bg-blue-600/90"
              disabled={submitting}
            >
              {submitting
                ? t("projectForm.buttonSaving") ?? "Guardando..."
                : t("projectForm.buttonSave") ?? "Guardar proyecto"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProyectForm

