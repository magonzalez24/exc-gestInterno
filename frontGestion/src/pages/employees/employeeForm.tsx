import { FormEvent, useEffect, useState } from "react"
import * as yup from "yup"
import { useNavigate, useParams } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { PageBreadcrumb } from "@/components/PageBreadcrumb"
import { CustomInput } from "@/components/CustomInput"
import CustomSelect, { CatalogOption } from "@/components/CustomSelect"
import { useI18n } from "@/i18n"
import { useAppToast } from "@/hooks/useAppToast"
import { LoadingScreen } from "@/components/loadingScreen"
import { createEmpleado, getEmpleadoById, updateEmpleado } from "@/services/empleadosService"
import { getDimensiones } from "@/services/dimensiones"
import { getPerfiles } from "@/services/perfiles"
import { getModeloContratacion } from "@/services/modeloContratacion"
import { getPaises } from "@/services/pais"

type TFunction = (key: string) => string

const getEmployeeSchema = (t: TFunction) =>
  yup.object({
    codigo_empleado: yup
      .string()
      .trim()
      .required(t("employeeForm.validation.requiredCodigo")),
    nombre: yup.string().trim().required(t("employeeForm.validation.requiredNombre")),
    apellido: yup.string().trim().required(t("employeeForm.validation.requiredApellido")),
    email: yup
      .string()
      .trim()
      .email(t("employeeForm.validation.invalidEmail"))
      .required(t("employeeForm.validation.requiredEmail")),
    telefono: yup.string().trim().required(t("employeeForm.validation.requiredTelefono")),
    perfil_id: yup.string().required(t("employeeForm.validation.requiredPerfil")),
    dimension_id: yup.string().required(t("employeeForm.validation.requiredDimension")),
    modelo_contratacion_id: yup
      .string()
      .required(t("employeeForm.validation.requiredModeloContratacion")),
    pais_id: yup.string().required(t("employeeForm.validation.requiredPais")),
    fecha_alta: yup.string().required(t("employeeForm.validation.requiredFechaAlta")),
    sba: yup.string().optional(),
    cv_url: yup.string().url(t("employeeForm.validation.invalidUrl")).optional(),
    activo: yup.boolean().required(),
  })

type FieldError = {
  message: string
}

type EmployeeFormValues = {
  codigo_empleado: string
  nombre: string
  apellido: string
  email: string
  telefono: string
  perfil_id: string
  dimension_id: string
  modelo_contratacion_id: string
  pais_id: string
  fecha_alta: string 
  sba?: string
  cv_url?: string
  activo: boolean
}

type EmployeeFormErrors = Partial<Record<keyof EmployeeFormValues, FieldError>>

const EmployeeForm = () => {
  const navigate = useNavigate()
  const { t } = useI18n()
  const { showToast } = useAppToast()
  const employeeSchema = getEmployeeSchema(t)
  const { id } = useParams()

  const [dimensionOptions, setDimensionOptions] = useState<CatalogOption[]>([])
  const [perfilOptions, setPerfilOptions] = useState<CatalogOption[]>([])
  const [modeloContratacionOptions, setModeloContratacionOptions] = useState<CatalogOption[]>([])
  const [paisOptions, setPaisOptions] = useState<CatalogOption[]>([])

  const [values, setValues] = useState<EmployeeFormValues>({
    codigo_empleado: "",
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    perfil_id: "",
    dimension_id: "",
    modelo_contratacion_id: "",
    pais_id: "",
    fecha_alta: "",
    sba: "",
    cv_url: "",
    activo: true,
  })

  const [errors, setErrors] = useState<EmployeeFormErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [loadingInitial, setLoadingInitial] = useState(true)


  useEffect(() => {
    let cancelled = false

    const loadAll = async () => {
      setLoadingInitial(true)
      try {
        const [dimensiones, perfiles, modeloContratacion, paises] = await Promise.all([
          getDimensiones(),
          getPerfiles(),
          getModeloContratacion(),
          getPaises(),
        ])

        if (cancelled) return
        setDimensionOptions(dimensiones as CatalogOption[])
        setPerfilOptions(perfiles as CatalogOption[])
        setModeloContratacionOptions(modeloContratacion as CatalogOption[])
        setPaisOptions(paises as CatalogOption[])

        if (id) {
          const empleado = await getEmpleadoById(Number(id)) as Record<string, unknown>
          if (!cancelled && empleado) {
            setValues({
              codigo_empleado: String(empleado.codigo_empleado ?? ""),
              nombre: String(empleado.nombre ?? ""),
              apellido: String(empleado.apellido ?? ""),
              email: String(empleado.email ?? ""),
              telefono: String(empleado.telefono ?? ""),
              perfil_id: String(empleado.perfil_id ?? ""),
              dimension_id: String(empleado.dimension_id ?? ""),
              modelo_contratacion_id: String(empleado.modelo_contratacion_id ?? ""),
              pais_id: String(empleado.pais_id ?? ""),
              fecha_alta: String(empleado.fecha_alta ?? "").slice(0, 10),
              sba: empleado.sba != null ? String(empleado.sba) : "",
              cv_url: empleado.cv_url != null ? String(empleado.cv_url) : "",
              activo: Boolean(empleado.activo ?? true),
            })
          }
        }
      } catch (error) {
        if (!cancelled) console.error("Error al cargar datos iniciales", error)
      } finally {
        if (!cancelled) setLoadingInitial(false)
      }
    }

    loadAll()
    return () => {
      cancelled = true
    }
  }, [id])

  const handleChange =
    (field: keyof EmployeeFormValues) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value =
        event.target.type === "checkbox"
          ? (event.target as HTMLInputElement).checked
          : event.target.value

      setValues((prev) => ({ ...prev, [field]: value }))
    }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrors({})
    if (id) {
      try {
        await updateEmpleado(Number(id), values)
        showToast("success", t("employeeForm.toastSuccess"))
        navigate("/employees")
      } catch (err) {
        console.error("Error al actualizar empleado", err)
        showToast("error", t("employeeForm.toastError"), t("employeeForm.toastErrorDefault"))
      }
    } else {
    
    try {
      const parsed = (await employeeSchema.validate(values, {
        abortEarly: false,
      })) as EmployeeFormValues

      setSubmitting(true)

      await createEmpleado({
        codigo_empleado: parsed.codigo_empleado,
        nombre: parsed.nombre,
        apellido: parsed.apellido,
        email: parsed.email,
        telefono: parsed.telefono,
        perfil_id: Number(parsed.perfil_id),
        dimension_id: Number(parsed.dimension_id),
        modelo_contratacion_id: Number(parsed.modelo_contratacion_id),
        pais_id: Number(parsed.pais_id),
        fecha_alta: parsed.fecha_alta,
        sba: parsed.sba ? Number(parsed.sba) : undefined,
        cv_url: parsed.cv_url || undefined,
        activo: parsed.activo,
      })

      showToast("success", t("employeeForm.toastSuccess"))
      navigate("/employees")
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const fieldErrors: EmployeeFormErrors = {}
        err.inner.forEach((e) => {
          if (e.path) {
            fieldErrors[e.path as keyof EmployeeFormValues] = {
              message: e.message,
            }
          }
        })
        setErrors(fieldErrors)
        return
      }

      console.error("Error al crear empleado", err)
      const message =
        err instanceof Error ? err.message : t("employeeForm.toastErrorDefault")
      showToast("error", t("employeeForm.toastError"), message)
    } finally {
      setSubmitting(false)
    }
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
            backHref="/employees"
            backLabel={t("sidebar.employees") ?? "Empleados"}
            title={t("employeeForm.title")}
          />
          <p className="text-sm text-slate-600">
            {t("employeeForm.subtitle")}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información personal */}
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-slate-900">
                {t("employeeForm.sectionPersonalTitle")}
              </CardTitle>
              <CardDescription>
                {t("employeeForm.sectionPersonalDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              <div className="grid gap-4 md:grid-cols-2">
                <CustomInput
                  id="nombre"
                  label={t("employeeForm.fieldNombre")}
                  required
                  requiredLabel={t("employeeForm.required")}
                  value={values.nombre}
                  onChange={handleChange("nombre")}
                  placeholder={t("employeeForm.placeholderNombre")}
                  error={errors.nombre?.message}
                />
                <CustomInput
                  id="apellido"
                  label={t("employeeForm.fieldApellido")}
                  required
                  requiredLabel={t("employeeForm.required")}
                  value={values.apellido}
                  onChange={handleChange("apellido")}
                  placeholder={t("employeeForm.placeholderApellido")}
                  error={errors.apellido?.message}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <CustomInput
                  id="email"
                  label={t("employeeForm.fieldEmail")}
                  required
                  requiredLabel={t("employeeForm.required")}
                  type="email"
                  value={values.email}
                  onChange={handleChange("email")}
                  placeholder={t("employeeForm.placeholderEmail")}
                  error={errors.email?.message}
                />
                <CustomInput
                  id="telefono"
                  label={t("employeeForm.fieldTelefono")}
                  required
                  requiredLabel={t("employeeForm.required")}
                  value={values.telefono}
                  onChange={handleChange("telefono")}
                  placeholder={t("employeeForm.placeholderTelefono")}
                  error={errors.telefono?.message}
                />
              </div>
            </CardContent>
          </Card>

          {/* Detalles de empleo */}
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-slate-900">
                {t("employeeForm.sectionEmploymentTitle")}
              </CardTitle>
              <CardDescription>
                {t("employeeForm.sectionEmploymentDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              <div className="grid gap-4 md:grid-cols-2">
                <CustomInput
                  id="codigo_empleado"
                  label={t("employeeForm.fieldCodigoEmpleado")}
                  required
                  requiredLabel={t("employeeForm.required")}
                  value={values.codigo_empleado}
                  onChange={handleChange("codigo_empleado")}
                  placeholder={t("employeeForm.placeholderCodigoEmpleado")}
                  error={errors.codigo_empleado?.message}
                />

                <CustomSelect
                  label={t("employeeForm.fieldPerfil")}
                  required
                  placeholder={t("employeeForm.selectPerfil")}
                  value={values.perfil_id}
                  onChange={(value) =>
                    setValues((prev) => ({ ...prev, perfil_id: value }))
                  }
                  options={perfilOptions}
                  error={errors.perfil_id?.message}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <CustomSelect
                  label={t("employeeForm.fieldDimension")}
                  required
                  placeholder={t("employeeForm.selectDimension")}
                  value={values.dimension_id}
                  onChange={(value) =>
                    setValues((prev) => ({ ...prev, dimension_id: value }))
                  }
                  options={dimensionOptions}
                  error={errors.dimension_id?.message}
                />

                <CustomSelect
                  label={t("employeeForm.fieldModeloContratacion")}
                  required
                  placeholder={t("employeeForm.selectModeloContratacion")}
                  value={values.modelo_contratacion_id}
                  onChange={(value) =>
                    setValues((prev) => ({
                      ...prev,
                      modelo_contratacion_id: value,
                    }))
                  }
                  options={modeloContratacionOptions}
                  error={errors.modelo_contratacion_id?.message}
                />

                <CustomSelect
                  label={t("employeeForm.fieldPais")}
                  required
                  placeholder={t("employeeForm.selectPais")}
                  value={values.pais_id}
                  onChange={(value) =>
                    setValues((prev) => ({ ...prev, pais_id: value }))
                  }
                  options={paisOptions}
                  error={errors.pais_id?.message}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <CustomInput
                  id="fecha_alta"
                  label={t("employeeForm.fieldFechaAlta")}
                  required
                  requiredLabel={t("employeeForm.required")}
                  type="date"
                  value={values.fecha_alta}
                  onChange={handleChange("fecha_alta")}
                  error={errors.fecha_alta?.message}
                />
                <CustomInput
                  id="sba"
                  label={t("employeeForm.fieldSba")}
                  type="number"
                  min={0}
                  step={0.01}
                  value={values.sba ?? ""}
                  onChange={handleChange("sba")}
                  placeholder={t("employeeForm.placeholderSba")}
                  error={errors.sba?.message}
                />
              </div>
            </CardContent>
          </Card>

          {/* Información adicional */}
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-slate-900">
                {t("employeeForm.sectionAdditionalTitle")}
              </CardTitle>
              <CardDescription>
                {t("employeeForm.sectionAdditionalDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              <CustomInput
                id="cv_url"
                label={t("employeeForm.fieldCvUrl")}
                value={values.cv_url ?? ""}
                onChange={handleChange("cv_url")}
                placeholder={t("employeeForm.placeholderCvUrl")}
                error={errors.cv_url?.message}
                hint={t("employeeForm.cvHint")}
              />

              <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {t("employeeForm.fieldActivo")}
                  </p>
                  <p className="text-xs text-slate-600">
                    {t("employeeForm.activeStatusDescription")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="activo"
                    checked={values.activo}
                    onCheckedChange={(checked) =>
                      setValues((prev) => ({
                        ...prev,
                        activo: Boolean(checked),
                      }))
                    }
                  />
                  <Label htmlFor="activo" className="text-sm text-slate-800">
                    {values.activo ? t("employeeForm.activeLabel") : t("employeeForm.inactiveLabel")}
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Acciones */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/employees")}
            >
              {t("employeeForm.buttonCancel")}
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 text-white hover:bg-blue-600/90"
              disabled={submitting}
            >
              {submitting ? t("employeeForm.buttonSaving") : t("employeeForm.buttonSave")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EmployeeForm