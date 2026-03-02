-- CreateTable
CREATE TABLE "asignacion_proyecto_empleado" (
    "id" SERIAL NOT NULL,
    "codigo" VARCHAR(50) NOT NULL,
    "proyecto_id" INTEGER NOT NULL,
    "empleado_id" INTEGER NOT NULL,
    "rol_proyecto_id" INTEGER NOT NULL,
    "fecha_inicio" DATE NOT NULL,
    "fecha_final" DATE,
    "activo" BOOLEAN DEFAULT true,
    "porcentaje_asignacion" DECIMAL(5,2),
    "costo_asignacion" DECIMAL(12,2),

    CONSTRAINT "asignacion_proyecto_empleado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asignacion_proyecto_empleado_log" (
    "id" SERIAL NOT NULL,
    "asignacion_id" INTEGER NOT NULL,
    "fecha_inicio" DATE NOT NULL,
    "fecha_final" DATE,
    "porcentaje_asignacion" DECIMAL(5,2) NOT NULL,
    "costo_asignacion_periodo" DECIMAL(12,2) NOT NULL,
    "costo_hora_utilizado" DECIMAL(10,2) NOT NULL,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "asignacion_proyecto_empleado_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dimension" (
    "id" SERIAL NOT NULL,
    "codigo" VARCHAR(20) NOT NULL,
    "descripcion" VARCHAR(200) NOT NULL,
    "activo" BOOLEAN DEFAULT true,

    CONSTRAINT "dimension_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "empleado" (
    "id" SERIAL NOT NULL,
    "codigo_empleado" VARCHAR(50) NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "apellido" VARCHAR(100) NOT NULL,
    "perfil_id" INTEGER NOT NULL,
    "dimension_id" INTEGER NOT NULL,
    "modelo_contratacion_id" INTEGER NOT NULL,
    "pais_id" INTEGER NOT NULL,
    "fecha_alta" DATE NOT NULL,
    "fecha_baja" DATE,
    "razon_baja" VARCHAR(500),
    "activo" BOOLEAN DEFAULT true,
    "sba" DECIMAL(12,2),
    "coste_empresa" DECIMAL(12,2),
    "coste_hora" DECIMAL(10,2),
    "email" VARCHAR(100),
    "telefono" VARCHAR(20),
    "cv_url" VARCHAR(500),
    "username" VARCHAR(50),
    "password_hash" VARCHAR(255),
    "fecha_ultimo_acceso" TIMESTAMP(3),

    CONSTRAINT "empleado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "empleado_rol" (
    "id" SERIAL NOT NULL,
    "empleado_id" INTEGER NOT NULL,
    "rol_id" INTEGER NOT NULL,
    "fecha_asignacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "empleado_rol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gastos_proyecto" (
    "id" SERIAL NOT NULL,
    "proyecto_id" INTEGER NOT NULL,
    "descripcion" VARCHAR(500),
    "importe" DECIMAL(12,2) NOT NULL,
    "fecha_gasto" DATE NOT NULL,

    CONSTRAINT "gastos_proyecto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "horas_semana_empleado" (
    "id" SERIAL NOT NULL,
    "asignacion_proyecto_id" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "semana_numero" INTEGER NOT NULL,
    "fecha_inicio_semana" DATE NOT NULL,
    "fecha_fin_semana" DATE NOT NULL,
    "horas_trabajadas" DECIMAL(6,2) NOT NULL DEFAULT 0,
    "observaciones" VARCHAR(500),

    CONSTRAINT "horas_semana_empleado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ingresos_proyecto" (
    "id" SERIAL NOT NULL,
    "proyecto_id" INTEGER NOT NULL,
    "descripcion" VARCHAR(500),
    "importe" DECIMAL(12,2) NOT NULL,
    "fecha_ingreso" DATE NOT NULL,

    CONSTRAINT "ingresos_proyecto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "modelo_contratacion" (
    "id" SERIAL NOT NULL,
    "codigo" VARCHAR(20) NOT NULL,
    "descripcion" VARCHAR(200) NOT NULL,
    "activo" BOOLEAN DEFAULT true,

    CONSTRAINT "modelo_contratacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "modelo_proyecto" (
    "id" SERIAL NOT NULL,
    "codigo" VARCHAR(20) NOT NULL,
    "descripcion" VARCHAR(200) NOT NULL,
    "activo" BOOLEAN DEFAULT true,

    CONSTRAINT "modelo_proyecto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pais" (
    "id" SERIAL NOT NULL,
    "codigo" VARCHAR(10) NOT NULL,
    "descripcion" VARCHAR(100) NOT NULL,
    "activo" BOOLEAN DEFAULT true,

    CONSTRAINT "pais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "perfil" (
    "id" SERIAL NOT NULL,
    "codigo" VARCHAR(20) NOT NULL,
    "descripcion" VARCHAR(200) NOT NULL,
    "activo" BOOLEAN DEFAULT true,

    CONSTRAINT "perfil_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proyecto" (
    "id" SERIAL NOT NULL,
    "codigo" INTEGER NOT NULL,
    "nombre" VARCHAR(200) NOT NULL,
    "cliente" VARCHAR(200),
    "modelo_proyecto_id" INTEGER NOT NULL,
    "descripcion" TEXT,
    "tarifa" DECIMAL(12,2),
    "fecha_inicio" DATE NOT NULL,
    "fecha_final_prevista" DATE,
    "fecha_final" DATE,
    "pais_id" INTEGER NOT NULL,
    "ciudad" VARCHAR(100),
    "responsable_id" INTEGER NOT NULL,

    CONSTRAINT "proyecto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rol" (
    "id" SERIAL NOT NULL,
    "codigo" VARCHAR(20) NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "descripcion" VARCHAR(200),
    "activo" BOOLEAN DEFAULT true,

    CONSTRAINT "rol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rol_proyecto" (
    "id" SERIAL NOT NULL,
    "codigo" VARCHAR(20) NOT NULL,
    "descripcion" VARCHAR(200) NOT NULL,
    "activo" BOOLEAN DEFAULT true,

    CONSTRAINT "rol_proyecto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sesion" (
    "id" SERIAL NOT NULL,
    "empleado_id" INTEGER NOT NULL,
    "token" VARCHAR(500) NOT NULL,
    "ip_address" VARCHAR(45),
    "user_agent" TEXT,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_expiracion" TIMESTAMP(3) NOT NULL,
    "activa" BOOLEAN DEFAULT true,

    CONSTRAINT "sesion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "asignacion_proyecto_empleado_codigo_key" ON "asignacion_proyecto_empleado"("codigo");

-- CreateIndex
CREATE INDEX "idx_asignacion_activo" ON "asignacion_proyecto_empleado"("activo");

-- CreateIndex
CREATE INDEX "idx_asignacion_empleado" ON "asignacion_proyecto_empleado"("empleado_id");

-- CreateIndex
CREATE INDEX "idx_asignacion_fechas" ON "asignacion_proyecto_empleado"("fecha_inicio", "fecha_final");

-- CreateIndex
CREATE INDEX "idx_asignacion_proyecto" ON "asignacion_proyecto_empleado"("proyecto_id");

-- CreateIndex
CREATE INDEX "idx_asignacion_log_asignacion" ON "asignacion_proyecto_empleado_log"("asignacion_id");

-- CreateIndex
CREATE UNIQUE INDEX "dimension_codigo_key" ON "dimension"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "empleado_codigo_empleado_key" ON "empleado"("codigo_empleado");

-- CreateIndex
CREATE UNIQUE INDEX "empleado_username_key" ON "empleado"("username");

-- CreateIndex
CREATE INDEX "idx_empleado_activo" ON "empleado"("activo");

-- CreateIndex
CREATE INDEX "idx_empleado_email" ON "empleado"("email");

-- CreateIndex
CREATE INDEX "idx_empleado_email_login" ON "empleado"("email");

-- CreateIndex
CREATE INDEX "idx_empleado_pais" ON "empleado"("pais_id");

-- CreateIndex
CREATE INDEX "idx_empleado_perfil" ON "empleado"("perfil_id");

-- CreateIndex
CREATE INDEX "idx_empleado_username" ON "empleado"("username");

-- CreateIndex
CREATE UNIQUE INDEX "uq_empleado_rol" ON "empleado_rol"("empleado_id", "rol_id");

-- CreateIndex
CREATE INDEX "idx_gastos_proyecto" ON "gastos_proyecto"("proyecto_id");

-- CreateIndex
CREATE INDEX "idx_horas_asignacion" ON "horas_semana_empleado"("asignacion_proyecto_id");

-- CreateIndex
CREATE INDEX "idx_horas_year_semana" ON "horas_semana_empleado"("year", "semana_numero");

-- CreateIndex
CREATE UNIQUE INDEX "uq_horas_asignacion_semana" ON "horas_semana_empleado"("asignacion_proyecto_id", "year", "semana_numero");

-- CreateIndex
CREATE INDEX "idx_ingresos_proyecto" ON "ingresos_proyecto"("proyecto_id");

-- CreateIndex
CREATE UNIQUE INDEX "modelo_contratacion_codigo_key" ON "modelo_contratacion"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "modelo_proyecto_codigo_key" ON "modelo_proyecto"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "pais_codigo_key" ON "pais"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "perfil_codigo_key" ON "perfil"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "proyecto_codigo_key" ON "proyecto"("codigo");

-- CreateIndex
CREATE INDEX "idx_proyecto_fechas" ON "proyecto"("fecha_inicio", "fecha_final");

-- CreateIndex
CREATE INDEX "idx_proyecto_pais" ON "proyecto"("pais_id");

-- CreateIndex
CREATE INDEX "idx_proyecto_responsable" ON "proyecto"("responsable_id");

-- CreateIndex
CREATE UNIQUE INDEX "rol_codigo_key" ON "rol"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "rol_proyecto_codigo_key" ON "rol_proyecto"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "sesion_token_key" ON "sesion"("token");

-- CreateIndex
CREATE INDEX "idx_sesion_activa" ON "sesion"("activa", "fecha_expiracion");

-- CreateIndex
CREATE INDEX "idx_sesion_empleado" ON "sesion"("empleado_id");

-- CreateIndex
CREATE INDEX "idx_sesion_token" ON "sesion"("token");

-- AddForeignKey
ALTER TABLE "asignacion_proyecto_empleado" ADD CONSTRAINT "fk_asignacion_empleado" FOREIGN KEY ("empleado_id") REFERENCES "empleado"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "asignacion_proyecto_empleado" ADD CONSTRAINT "fk_asignacion_proyecto" FOREIGN KEY ("proyecto_id") REFERENCES "proyecto"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "asignacion_proyecto_empleado" ADD CONSTRAINT "fk_asignacion_rol_proyecto" FOREIGN KEY ("rol_proyecto_id") REFERENCES "rol_proyecto"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "asignacion_proyecto_empleado_log" ADD CONSTRAINT "fk_asignacion_log_asignacion" FOREIGN KEY ("asignacion_id") REFERENCES "asignacion_proyecto_empleado"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "empleado" ADD CONSTRAINT "fk_empleado_dimension" FOREIGN KEY ("dimension_id") REFERENCES "dimension"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "empleado" ADD CONSTRAINT "fk_empleado_modelo_contratacion" FOREIGN KEY ("modelo_contratacion_id") REFERENCES "modelo_contratacion"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "empleado" ADD CONSTRAINT "fk_empleado_pais" FOREIGN KEY ("pais_id") REFERENCES "pais"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "empleado" ADD CONSTRAINT "fk_empleado_perfil" FOREIGN KEY ("perfil_id") REFERENCES "perfil"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "empleado_rol" ADD CONSTRAINT "fk_empleado_rol_empleado" FOREIGN KEY ("empleado_id") REFERENCES "empleado"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "empleado_rol" ADD CONSTRAINT "fk_empleado_rol_rol" FOREIGN KEY ("rol_id") REFERENCES "rol"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "gastos_proyecto" ADD CONSTRAINT "fk_gastos_proyecto" FOREIGN KEY ("proyecto_id") REFERENCES "proyecto"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "horas_semana_empleado" ADD CONSTRAINT "fk_horas_asignacion" FOREIGN KEY ("asignacion_proyecto_id") REFERENCES "asignacion_proyecto_empleado"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ingresos_proyecto" ADD CONSTRAINT "fk_ingresos_proyecto" FOREIGN KEY ("proyecto_id") REFERENCES "proyecto"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "proyecto" ADD CONSTRAINT "fk_proyecto_modelo_proyecto" FOREIGN KEY ("modelo_proyecto_id") REFERENCES "modelo_proyecto"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "proyecto" ADD CONSTRAINT "fk_proyecto_pais" FOREIGN KEY ("pais_id") REFERENCES "pais"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "proyecto" ADD CONSTRAINT "fk_proyecto_responsable" FOREIGN KEY ("responsable_id") REFERENCES "empleado"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sesion" ADD CONSTRAINT "fk_sesion_empleado" FOREIGN KEY ("empleado_id") REFERENCES "empleado"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
