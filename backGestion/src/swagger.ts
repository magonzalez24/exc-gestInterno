const swaggerDocument = {
  openapi: '3.0.3',
  info: {
    title: 'API de Gestión',
    description: 'API REST para la gestión de empleados, proyectos, asignaciones y más',
    version: '1.0.0',
  },
  servers: [
    {
      url: '/api',
      description: 'API base (relativo al host actual)',
    },
    {
      url: 'http://localhost:3000/api',
      description: 'Servidor local',
    },
  ],
  paths: {
    '/auth/login': {
      post: {
        summary: 'Iniciar sesión',
        tags: ['Autenticación'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['password'],
                properties: {
                  username: { type: 'string', description: 'Usuario (alternativa a email)' },
                  email: { type: 'string', format: 'email', description: 'Email (alternativa a username)' },
                  password: { type: 'string', format: 'password', description: 'Contraseña' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Login exitoso',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    token: { type: 'string', description: 'JWT para usar en Authorization: Bearer' },
                    empleado: { type: 'object', description: 'Datos del empleado (sin password)' },
                    expiresAt: { type: 'string', format: 'date-time', description: 'Fecha de expiración del token' },
                  },
                },
              },
            },
          },
          401: { description: 'Credenciales inválidas o usuario inactivo' },
        },
      },
    },
    '/auth/logout': {
      post: {
        summary: 'Cerrar sesión',
        tags: ['Autenticación'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  token: { type: 'string', description: 'Token (alternativa a header Authorization)' },
                },
              },
            },
          },
        },
        responses: {
          204: { description: 'Sesión cerrada' },
          400: { description: 'Token requerido' },
        },
      },
    },
    '/auth/me': {
      get: {
        summary: 'Obtener usuario actual',
        tags: ['Autenticación'],
        description: 'Verifica el token y devuelve los datos del empleado autenticado',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'token', in: 'query', schema: { type: 'string' }, description: 'Token (alternativa a header)' },
        ],
        responses: {
          200: { description: 'Datos del empleado autenticado' },
          401: { description: 'Token inválido o expirado' },
        },
      },
    },
    '/paises': {
      get: {
        summary: 'Listar países',
        tags: ['Países'],
        parameters: [
          { name: 'activo', in: 'query', schema: { type: 'boolean' }, description: 'Filtrar por estado activo' },
        ],
        responses: { 200: { description: 'Lista de países' } },
      },
      post: {
        summary: 'Crear país',
        tags: ['Países'],
        requestBody: {
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/PaisInput' },
            },
          },
        },
        responses: { 201: { description: 'País creado' } },
      },
    },
    '/paises/codigo/{codigo}': {
      get: {
        summary: 'Obtener país por código',
        tags: ['Países'],
        parameters: [{ name: 'codigo', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'País encontrado' }, 404: { description: 'No encontrado' } },
      },
    },
    '/paises/{id}': {
      get: {
        summary: 'Obtener país por ID',
        tags: ['Países'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'País encontrado' }, 404: { description: 'No encontrado' } },
      },
      put: {
        summary: 'Actualizar país',
        tags: ['Países'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/PaisInput' } } } },
        responses: { 200: { description: 'País actualizado' } },
      },
      delete: {
        summary: 'Eliminar país',
        tags: ['Países'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 204: { description: 'Eliminado' } },
      },
    },

    '/dimensiones': {
      get: {
        summary: 'Listar dimensiones',
        tags: ['Dimensiones'],
        parameters: [
          { name: 'activo', in: 'query', schema: { type: 'boolean' } },
        ],
        responses: { 200: { description: 'Lista de dimensiones' } },
      },
      post: {
        summary: 'Crear dimensión',
        tags: ['Dimensiones'],
        requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/CatalogoInput' } } } },
        responses: { 201: { description: 'Creado' } },
      },
    },
    '/dimensiones/codigo/{codigo}': {
      get: {
        summary: 'Obtener por código',
        tags: ['Dimensiones'],
        parameters: [{ name: 'codigo', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Encontrado' } },
      },
    },
    '/dimensiones/{id}': {
      get: { summary: 'Obtener por ID', tags: ['Dimensiones'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: {} } },
      put: { summary: 'Actualizar', tags: ['Dimensiones'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/CatalogoInput' } } } }, responses: { 200: {} } },
      delete: { summary: 'Eliminar', tags: ['Dimensiones'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 204: {} } },
    },

    '/perfiles': {
      get: { summary: 'Listar perfiles', tags: ['Perfiles'], parameters: [{ name: 'activo', in: 'query', schema: { type: 'boolean' } }], responses: { 200: {} } },
      post: { summary: 'Crear perfil', tags: ['Perfiles'], requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/CatalogoInput' } } } }, responses: { 201: {} } },
    },
    '/perfiles/codigo/{codigo}': { get: { summary: 'Obtener por código', tags: ['Perfiles'], parameters: [{ name: 'codigo', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: {} } } },
    '/perfiles/{id}': {
      get: { summary: 'Obtener por ID', tags: ['Perfiles'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: {} } },
      put: { summary: 'Actualizar', tags: ['Perfiles'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/CatalogoInput' } } } }, responses: { 200: {} } },
      delete: { summary: 'Eliminar', tags: ['Perfiles'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 204: {} } },
    },

    '/modelos-contratacion': {
      get: { summary: 'Listar modelos de contratación', tags: ['Modelos Contratación'], parameters: [{ name: 'activo', in: 'query', schema: { type: 'boolean' } }], responses: { 200: {} } },
      post: { summary: 'Crear', tags: ['Modelos Contratación'], requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/CatalogoInput' } } } }, responses: { 201: {} } },
    },
    '/modelos-contratacion/codigo/{codigo}': { get: { summary: 'Obtener por código', tags: ['Modelos Contratación'], parameters: [{ name: 'codigo', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: {} } } },
    '/modelos-contratacion/{id}': {
      get: { summary: 'Obtener por ID', tags: ['Modelos Contratación'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: {} } },
      put: { summary: 'Actualizar', tags: ['Modelos Contratación'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/CatalogoInput' } } } }, responses: { 200: {} } },
      delete: { summary: 'Eliminar', tags: ['Modelos Contratación'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 204: {} } },
    },

    '/modelos-proyecto': {
      get: { summary: 'Listar modelos de proyecto', tags: ['Modelos Proyecto'], parameters: [{ name: 'activo', in: 'query', schema: { type: 'boolean' } }], responses: { 200: {} } },
      post: { summary: 'Crear', tags: ['Modelos Proyecto'], requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/CatalogoInput' } } } }, responses: { 201: {} } },
    },
    '/modelos-proyecto/codigo/{codigo}': { get: { summary: 'Obtener por código', tags: ['Modelos Proyecto'], parameters: [{ name: 'codigo', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: {} } } },
    '/modelos-proyecto/{id}': {
      get: { summary: 'Obtener por ID', tags: ['Modelos Proyecto'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: {} } },
      put: { summary: 'Actualizar', tags: ['Modelos Proyecto'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/CatalogoInput' } } } }, responses: { 200: {} } },
      delete: { summary: 'Eliminar', tags: ['Modelos Proyecto'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 204: {} } },
    },

    '/roles': {
      get: { summary: 'Listar roles', tags: ['Roles'], parameters: [{ name: 'activo', in: 'query', schema: { type: 'boolean' } }], responses: { 200: {} } },
      post: { summary: 'Crear rol', tags: ['Roles'], requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/RolInput' } } } }, responses: { 201: {} } },
    },
    '/roles/codigo/{codigo}': { get: { summary: 'Obtener por código', tags: ['Roles'], parameters: [{ name: 'codigo', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: {} } } },
    '/roles/{id}': {
      get: { summary: 'Obtener por ID', tags: ['Roles'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: {} } },
      put: { summary: 'Actualizar', tags: ['Roles'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/RolInput' } } } }, responses: { 200: {} } },
      delete: { summary: 'Eliminar', tags: ['Roles'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 204: {} } },
    },

    '/roles-proyecto': {
      get: { summary: 'Listar roles de proyecto', tags: ['Roles Proyecto'], parameters: [{ name: 'activo', in: 'query', schema: { type: 'boolean' } }], responses: { 200: {} } },
      post: { summary: 'Crear', tags: ['Roles Proyecto'], requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/CatalogoInput' } } } }, responses: { 201: {} } },
    },
    '/roles-proyecto/codigo/{codigo}': { get: { summary: 'Obtener por código', tags: ['Roles Proyecto'], parameters: [{ name: 'codigo', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: {} } } },
    '/roles-proyecto/{id}': {
      get: { summary: 'Obtener por ID', tags: ['Roles Proyecto'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: {} } },
      put: { summary: 'Actualizar', tags: ['Roles Proyecto'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/CatalogoInput' } } } }, responses: { 200: {} } },
      delete: { summary: 'Eliminar', tags: ['Roles Proyecto'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 204: {} } },
    },

    '/empleados': {
      get: {
        summary: 'Listar empleados',
        tags: ['Empleados'],
        parameters: [
          { name: 'activo', in: 'query', schema: { type: 'boolean' } },
        ],
        responses: {
          200: {
            description: 'Lista de empleados (datos públicos, sin credenciales)',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Empleado' },
                },
              },
            },
          },
        },
      },
      post: {
        summary: 'Crear empleado',
        tags: ['Empleados'],
        requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/EmpleadoInput' } } } },
        responses: { 201: {} },
      },
    },
    '/empleados/codigo/{codigo}': { get: { summary: 'Obtener por código empleado', tags: ['Empleados'], parameters: [{ name: 'codigo', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: {} } } },
    '/empleados/email/{email}': { get: { summary: 'Obtener por email', tags: ['Empleados'], parameters: [{ name: 'email', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: {} } } },
    '/empleados/username/{username}': { get: { summary: 'Obtener por username', tags: ['Empleados'], parameters: [{ name: 'username', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: {} } } },
    '/empleados/{id}': {
      get: {
        summary: 'Obtener empleado por ID',
        tags: ['Empleados'],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        responses: {
          200: {
            description: 'Empleado encontrado (datos públicos, sin credenciales)',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Empleado' },
              },
            },
          },
          404: { description: 'Empleado no encontrado' },
        },
      },
      put: {
        summary: 'Actualizar empleado',
        tags: ['Empleados'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/EmpleadoInput' },
            },
          },
        },
        responses: { 200: {} },
      },
      delete: {
        summary: 'Desactivar empleado (activo = false)',
        description: 'Marca el empleado como inactivo en lugar de eliminarlo físicamente (soft delete).',
        tags: ['Empleados'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          204: { description: 'Empleado desactivado correctamente' },
          400: { description: 'ID inválido' },
          500: { description: 'Error al desactivar empleado' },
        },
      },
    },

    '/proyectos': {
      get: {
        summary: 'Listar proyectos',
        tags: ['Proyectos'],
        parameters: [{ name: 'include', in: 'query', schema: { type: 'string', enum: ['relations'] } }],
        responses: { 200: {} },
      },
      post: {
        summary: 'Crear proyecto',
        tags: ['Proyectos'],
        requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/ProyectoInput' } } } },
        responses: { 201: {} },
      },
    },
    '/proyectos/codigo/{codigo}': { get: { summary: 'Obtener por código', tags: ['Proyectos'], parameters: [{ name: 'codigo', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: {} } } },
    '/proyectos/{id}': {
      get: {
        summary: 'Obtener proyecto por ID',
        tags: ['Proyectos'],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
          { name: 'include', in: 'query', schema: { type: 'string', enum: ['relations'] } },
        ],
        responses: { 200: {} },
      },
      put: { summary: 'Actualizar proyecto', tags: ['Proyectos'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/ProyectoInput' } } } }, responses: { 200: {} } },
      delete: { summary: 'Eliminar proyecto', tags: ['Proyectos'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 204: {} } },
    },
    '/proyectos/{proyectoId}/asignaciones': { get: { summary: 'Asignaciones del proyecto', tags: ['Proyectos'], parameters: [{ name: 'proyectoId', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: {} } } },
    '/proyectos/{proyectoId}/gastos': { get: { summary: 'Gastos del proyecto', tags: ['Proyectos'], parameters: [{ name: 'proyectoId', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: {} } } },
    '/proyectos/{proyectoId}/ingresos': { get: { summary: 'Ingresos del proyecto', tags: ['Proyectos'], parameters: [{ name: 'proyectoId', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: {} } } },

    '/asignaciones': {
      get: {
        summary: 'Listar asignaciones',
        tags: ['Asignaciones'],
        parameters: [{ name: 'include', in: 'query', schema: { type: 'string', enum: ['relations'] } }],
        responses: { 200: {} },
      },
      post: {
        summary: 'Crear asignación',
        tags: ['Asignaciones'],
        requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/AsignacionInput' } } } },
        responses: { 201: {} },
      },
    },
    '/asignaciones/codigo/{codigo}': {
      get: {
        summary: 'Obtener asignación por código',
        tags: ['Asignaciones'],
        parameters: [{ name: 'codigo', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: {} },
      },
    },
    '/asignaciones/empleado/{empleadoId}': {
      get: {
        summary: 'Asignaciones de un empleado',
        tags: ['Asignaciones'],
        parameters: [{ name: 'empleadoId', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: {} },
      },
    },
    '/asignaciones/finalizaciones': {
      get: {
        summary: 'Asignaciones con fecha de fin próxima',
        description:
          'Devuelve las asignaciones cuya fecha_final está dentro de los próximos 2 meses (o el número de meses indicado en el query param "months").',
        tags: ['Asignaciones'],
        parameters: [
          {
            name: 'months',
            in: 'query',
            required: false,
            schema: { type: 'integer', minimum: 1, default: 2 },
            description: 'Número de meses hacia adelante a considerar (por defecto 2).',
          },
        ],
        responses: {
          200: { description: 'Lista de asignaciones con fecha de fin próxima' },
        },
      },
    },
    '/asignaciones/{id}': {
      get: { summary: 'Obtener por ID', tags: ['Asignaciones'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: {} } },
      put: { summary: 'Actualizar', tags: ['Asignaciones'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/AsignacionInput' } } } }, responses: { 200: {} } },
      delete: { summary: 'Eliminar', tags: ['Asignaciones'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 204: {} } },
    },
    '/asignaciones/{asignacionId}/horas': { get: { summary: 'Horas de la asignación', tags: ['Asignaciones'], parameters: [{ name: 'asignacionId', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: {} } } },

    '/empleados-roles': {
      get: {
        summary: 'Listar roles de empleados',
        tags: ['Empleados-Roles'],
        parameters: [{ name: 'include', in: 'query', schema: { type: 'string', enum: ['relations'] } }],
        responses: { 200: {} },
      },
      post: {
        summary: 'Asignar rol a empleado',
        tags: ['Empleados-Roles'],
        requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/EmpleadoRolInput' } } } },
        responses: { 201: {} },
      },
    },
    '/empleados-roles/empleado/{empleadoId}': { get: { summary: 'Roles de un empleado', tags: ['Empleados-Roles'], parameters: [{ name: 'empleadoId', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: {} } } },
    '/empleados-roles/{id}': {
      get: { summary: 'Obtener por ID', tags: ['Empleados-Roles'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: {} } },
      delete: { summary: 'Eliminar asignación rol', tags: ['Empleados-Roles'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 204: {} } },
    },
    '/empleados-roles/empleado/{empleadoId}/rol/{rolId}': { delete: { summary: 'Eliminar rol de empleado', tags: ['Empleados-Roles'], parameters: [{ name: 'empleadoId', in: 'path', required: true, schema: { type: 'integer' } }, { name: 'rolId', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 204: {} } } },

    '/gastos-proyecto': {
      get: {
        summary: 'Listar gastos',
        tags: ['Gastos Proyecto'],
        parameters: [{ name: 'proyecto_id', in: 'query', schema: { type: 'integer' } }],
        responses: { 200: {} },
      },
      post: {
        summary: 'Crear gasto',
        tags: ['Gastos Proyecto'],
        requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/GastoInput' } } } },
        responses: { 201: {} },
      },
    },
    '/gastos-proyecto/{id}': {
      get: { summary: 'Obtener por ID', tags: ['Gastos Proyecto'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: {} } },
      put: { summary: 'Actualizar', tags: ['Gastos Proyecto'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/GastoInput' } } } }, responses: { 200: {} } },
      delete: { summary: 'Eliminar', tags: ['Gastos Proyecto'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 204: {} } },
    },

    '/ingresos-proyecto': {
      get: {
        summary: 'Listar ingresos',
        tags: ['Ingresos Proyecto'],
        parameters: [{ name: 'proyecto_id', in: 'query', schema: { type: 'integer' } }],
        responses: { 200: {} },
      },
      post: {
        summary: 'Crear ingreso',
        tags: ['Ingresos Proyecto'],
        requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/IngresoInput' } } } },
        responses: { 201: {} },
      },
    },
    '/ingresos-proyecto/{id}': {
      get: { summary: 'Obtener por ID', tags: ['Ingresos Proyecto'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: {} } },
      put: { summary: 'Actualizar', tags: ['Ingresos Proyecto'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/IngresoInput' } } } }, responses: { 200: {} } },
      delete: { summary: 'Eliminar', tags: ['Ingresos Proyecto'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 204: {} } },
    },

    '/horas-semana': {
      get: {
        summary: 'Listar horas',
        tags: ['Horas Semana'],
        parameters: [{ name: 'asignacion_proyecto_id', in: 'query', schema: { type: 'integer' } }],
        responses: { 200: {} },
      },
      post: {
        summary: 'Registrar horas',
        tags: ['Horas Semana'],
        requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/HorasInput' } } } },
        responses: { 201: {} },
      },
    },
    '/horas-semana/year/{year}/semana/{semanaNumero}': { get: { summary: 'Horas por año y semana', tags: ['Horas Semana'], parameters: [{ name: 'year', in: 'path', required: true, schema: { type: 'integer' } }, { name: 'semanaNumero', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: {} } } },
    '/horas-semana/{id}': {
      get: { summary: 'Obtener por ID', tags: ['Horas Semana'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: {} } },
      put: { summary: 'Actualizar', tags: ['Horas Semana'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/HorasInput' } } } }, responses: { 200: {} } },
      delete: { summary: 'Eliminar', tags: ['Horas Semana'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 204: {} } },
    },

    '/sesiones': {
      get: { summary: 'Listar sesiones', tags: ['Sesiones'], responses: { 200: {} } },
      post: {
        summary: 'Crear sesión',
        tags: ['Sesiones'],
        requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/SesionInput' } } } },
        responses: { 201: {} },
      },
    },
    '/sesiones/token/{token}': { get: { summary: 'Obtener por token', tags: ['Sesiones'], parameters: [{ name: 'token', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: {} } } },
    '/sesiones/empleado/{empleadoId}': { get: { summary: 'Sesiones de un empleado', tags: ['Sesiones'], parameters: [{ name: 'empleadoId', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: {} } } },
    '/sesiones/empleado/{empleadoId}/activas': { get: { summary: 'Sesiones activas del empleado', tags: ['Sesiones'], parameters: [{ name: 'empleadoId', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: {} } } },
    '/sesiones/{id}': {
      get: { summary: 'Obtener por ID', tags: ['Sesiones'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: {} } },
      put: { summary: 'Actualizar', tags: ['Sesiones'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/SesionInput' } } } }, responses: { 200: {} } },
      delete: { summary: 'Eliminar', tags: ['Sesiones'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 204: {} } },
    },
    '/sesiones/{id}/invalidar': { put: { summary: 'Invalidar sesión por ID', tags: ['Sesiones'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: {} } } },
    '/sesiones/token/{token}/invalidar': { put: { summary: 'Invalidar sesión por token', tags: ['Sesiones'], parameters: [{ name: 'token', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: {} } } },
    '/sesiones/empleado/{empleadoId}/invalidar-todas': { put: { summary: 'Invalidar todas las sesiones del empleado', tags: ['Sesiones'], parameters: [{ name: 'empleadoId', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: {} } } },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Token obtenido del endpoint /auth/login',
      },
    },
    schemas: {
      PaisInput: {
        type: 'object',
        required: ['codigo', 'descripcion'],
        properties: {
          codigo: { type: 'string', maxLength: 10 },
          descripcion: { type: 'string', maxLength: 100 },
          activo: { type: 'boolean' },
        },
      },
      CatalogoInput: {
        type: 'object',
        required: ['codigo', 'descripcion'],
        properties: {
          codigo: { type: 'string', maxLength: 20 },
          descripcion: { type: 'string', maxLength: 200 },
          activo: { type: 'boolean' },
        },
      },
      RolInput: {
        type: 'object',
        required: ['codigo', 'nombre'],
        properties: {
          codigo: { type: 'string', maxLength: 20 },
          nombre: { type: 'string', maxLength: 50 },
          descripcion: { type: 'string', maxLength: 200 },
          activo: { type: 'boolean' },
        },
      },
      EmpleadoInput: {
        type: 'object',
        required: ['codigo_empleado', 'nombre', 'apellido', 'perfil_id', 'dimension_id', 'modelo_contratacion_id', 'pais_id', 'fecha_alta'],
        properties: {
          codigo_empleado: { type: 'string', maxLength: 50 },
          nombre: { type: 'string', maxLength: 100 },
          apellido: { type: 'string', maxLength: 100 },
          perfil_id: { type: 'integer' },
          dimension_id: { type: 'integer' },
          modelo_contratacion_id: { type: 'integer' },
          pais_id: { type: 'integer' },
          fecha_alta: { type: 'string', format: 'date' },
          fecha_baja: { type: 'string', format: 'date-time' },
          razon_baja: { type: 'string', maxLength: 500 },
          activo: { type: 'boolean' },
          sba: { type: 'number', format: 'decimal' },
          coste_empresa: { type: 'number', format: 'decimal' },
          coste_hora: { type: 'number', format: 'decimal' },
          email: { type: 'string', maxLength: 100 },
          telefono: { type: 'string', maxLength: 20 },
          cv_url: { type: 'string', maxLength: 500 },
          username: { type: 'string', maxLength: 50 },
          password: { type: 'string', format: 'password', description: 'Se hashea automáticamente (alternativa a password_hash)' },
          password_hash: { type: 'string', maxLength: 255 },
        },
      },
      Empleado: {
        type: 'object',
        description: 'Representación pública de empleado (sin credenciales)',
        properties: {
          id: { type: 'integer' },
          codigo_empleado: { type: 'string', maxLength: 50 },
          nombre: { type: 'string', maxLength: 100 },
          apellido: { type: 'string', maxLength: 100 },
          perfil_id: { type: 'integer' },
          perfil_nombre: { type: 'string', nullable: true },
          dimension_id: { type: 'integer' },
          dimension_nombre: { type: 'string', nullable: true },
          modelo_contratacion_id: { type: 'integer' },
          modelo_contratacion_nombre: { type: 'string', nullable: true },
          pais_id: { type: 'integer' },
          pais_nombre: { type: 'string', nullable: true },
          fecha_alta: { type: 'string', format: 'date-time' },
          fecha_baja: { type: 'string', format: 'date-time', nullable: true },
          razon_baja: { type: 'string', maxLength: 500, nullable: true },
          activo: { type: 'boolean' },
        },
      },
      ProyectoInput: {
        type: 'object',
        required: ['codigo', 'nombre', 'modelo_proyecto_id', 'fecha_inicio', 'pais_id', 'responsable_id'],
        properties: {
          codigo: { type: 'integer' },
          nombre: { type: 'string', maxLength: 200 },
          cliente: { type: 'string', maxLength: 200 },
          modelo_proyecto_id: { type: 'integer' },
          descripcion: { type: 'string' },
          tarifa: { type: 'number', format: 'decimal' },
          fecha_inicio: { type: 'string', format: 'date' },
          fecha_final_prevista: { type: 'string', format: 'date-time' },
          fecha_final: { type: 'string', format: 'date-time' },
          pais_id: { type: 'integer' },
          ciudad: { type: 'string', maxLength: 100 },
          responsable_id: { type: 'integer' },
        },
      },
      AsignacionInput: {
        type: 'object',
        required: ['codigo', 'proyecto_id', 'empleado_id', 'rol_proyecto_id', 'fecha_inicio'],
        properties: {
          codigo: { type: 'string', maxLength: 50 },
          proyecto_id: { type: 'integer' },
          empleado_id: { type: 'integer' },
          rol_proyecto_id: { type: 'integer' },
          fecha_inicio: { type: 'string', format: 'date' },
          fecha_final: { type: 'string', format: 'date-time' },
          activo: { type: 'boolean' },
          porcentaje_asignacion: { type: 'number', format: 'decimal' },
        },
      },
      EmpleadoRolInput: {
        type: 'object',
        required: ['empleado_id', 'rol_id'],
        properties: {
          empleado_id: { type: 'integer' },
          rol_id: { type: 'integer' },
        },
      },
      GastoInput: {
        type: 'object',
        required: ['proyecto_id', 'importe', 'fecha_gasto'],
        properties: {
          proyecto_id: { type: 'integer' },
          descripcion: { type: 'string', maxLength: 500 },
          importe: { type: 'number', format: 'decimal' },
          fecha_gasto: { type: 'string', format: 'date' },
        },
      },
      IngresoInput: {
        type: 'object',
        required: ['proyecto_id', 'importe', 'fecha_ingreso'],
        properties: {
          proyecto_id: { type: 'integer' },
          descripcion: { type: 'string', maxLength: 500 },
          importe: { type: 'number', format: 'decimal' },
          fecha_ingreso: { type: 'string', format: 'date' },
        },
      },
      HorasInput: {
        type: 'object',
        required: ['asignacion_proyecto_id', 'year', 'semana_numero', 'fecha_inicio_semana', 'fecha_fin_semana'],
        properties: {
          asignacion_proyecto_id: { type: 'integer' },
          year: { type: 'integer' },
          semana_numero: { type: 'integer' },
          fecha_inicio_semana: { type: 'string', format: 'date' },
          fecha_fin_semana: { type: 'string', format: 'date' },
          horas_trabajadas: { type: 'number', format: 'decimal' },
          observaciones: { type: 'string', maxLength: 500 },
        },
      },
      SesionInput: {
        type: 'object',
        required: ['empleado_id', 'token', 'fecha_expiracion'],
        properties: {
          empleado_id: { type: 'integer' },
          token: { type: 'string', maxLength: 500 },
          ip_address: { type: 'string', maxLength: 45 },
          user_agent: { type: 'string' },
          fecha_expiracion: { type: 'string', format: 'date-time' },
          activa: { type: 'boolean' },
        },
      },
    },
  },
};

export default swaggerDocument;
