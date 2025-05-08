# VetAppointment

![logo_vetappointment](https://github.com/user-attachments/assets/a06e807f-2753-4290-b682-a4d22a30d3f6)


Software de gestión veterinaria para la administración de citas, pacientes e historiales médicos en clínicas.

## Tabla de Contenidos

* [Descripción](#descripción)
* [Objetivos](#objetivos)
* [Planificación](#planificación)
* [Presupuesto](#presupuesto)
* [Análisis de Mercado](#análisis-de-mercado)

  * [Público Objetivo y Perfiles de Usuario](#público-objetivo-y-perfiles-de-usuario)
  * [Competencia](#competencia)
* [Propuesta](#propuesta)
* [Especificaciones del Producto](#especificaciones-del-producto)
* [Diseño](#diseño)

  * [Diagramas de Navegación (User Flow)](#diagramas-de-navegación-user-flow)
  * [Wireframes](#wireframes)

    * [Fidelidad Baja](#fidelidad-baja)
    * [Fidelidad Media](#fidelidad-media)
    * [Fidelidad Alta](#fidelidad-alta)
* [Desarrollo](#desarrollo)

  * [Arquitectura de la Aplicación](#arquitectura-de-la-aplicación)
  * [Herramientas de Desarrollo](#herramientas-de-desarrollo)
  * [Tecnologías Utilizadas](#tecnologías-utilizadas)
  * [Modelo de Datos](#modelo-de-datos)
* [Despliegue](#despliegue)
* [Conclusiones](#conclusiones)
* [Líneas de Futuro](#líneas-de-futuro)

---

## Descripción

VetAppointment es una aplicación diseñada para uso exclusivo del personal clínico de una clínica veterinaria. Permite optimizar la programación de citas, la gestión de pacientes (mascotas) y el control de historiales médicos, reduciendo errores administrativos y mejorando la eficiencia en las consultas.

## Objetivos

* Centralizar la gestión de citas médicas.
* Almacenar y consultar historiales clínicos de mascotas.
* Organizar la agenda y asignar profesionales veterinarios.
* Control de acceso por roles (recepcionista, veterinario, administrador).
* Soporte multiplataforma (escritorio y móvil en red interna).

## Planificación

![Diagrama de Gantt](docs/images/gantt.png)

*Diagrama de Gantt que muestra las fases de análisis, diseño, desarrollo y despliegue.*

## Presupuesto

* Coste estimado de desarrollo: \[detalle de horas y recursos].
* Licencias de software libre: sin costes adicionales.

## Análisis de Mercado

### Público Objetivo y Perfiles de Usuario

* **Recepcionistas:** Gestionan citas y vinculan mascotas con propietarios.
* **Veterinarios:** Acceden y actualizan el historial clínico, consultan su agenda.
* **Administradores:** Gestionan usuarios, supervisan estadísticas y salud del sistema.

### Competencia

* **VetWin:** Completo, pero interfaz anticuada y curva de aprendizaje elevada.
* **ClinicCloud:** Basado en la nube, con coste mensual y funcionalidades genéricas.
* **GestVet:** Sencillo, pero limitado en personalización y escalabilidad.

VetAppointment destaca por ser modular, escalable y sin costes de licencia, aprovechando software libre.

## Propuesta

Desarrollar una plataforma interna que permita registrar, consultar y administrar citas, pacientes y profesionales de forma centralizada, segura y eficiente, con una interfaz intuitiva centrada en el personal clínico.

## Especificaciones del Producto

1. Crear, modificar y eliminar citas médicas.
2. Registrar y consultar historiales clínicos completos.
3. Gestionar veterinarios y sus horarios.
4. Agenda visual diaria, semanal y mensual.
5. Control de acceso por roles.
6. Compatibilidad con dispositivos de escritorio y móviles.

## Diseño

### Diagramas de Navegación (User Flow)

![User Flow](docs/images/user-flow.png)

Flujo de tareas principales: login → gestión de pacientes → programación de cita → registro de diagnóstico.

### Wireframes

#### Fidelidad Baja

![Wireframe Baja Fidelidad](docs/images/wireframe-low.png)

Bosquejo inicial en papel para definir estructura y jerarquía de elementos.

#### Fidelidad Media

![Wireframe Media Fidelidad](docs/images/wireframe-medium.png)

Prototipo digital con componentes básicos y navegación definida.

#### Fidelidad Alta

![Wireframe Alta Fidelidad](docs/images/wireframe-high.png)

Diseño final con tipografía, colores y elementos de UI reales.

## Desarrollo

### Arquitectura de la Aplicación

**Frontend:** Angular v14 modularizado en CoreModule, SharedModule y módulos funcionales (Clientes, Mascotas, Citas, Facturación, Historial Médico, Servicios, Veterinarios). Estilos con Angular Material.

**Backend:** NestJS con módulos específicos para cada entidad, validación con class-validator y documentación via Swagger.

**Base de Datos:** PostgreSQL con Sequelize ORM (migraciones y seeders).

### Herramientas de Desarrollo

* Visual Studio Code
* Git & GitHub
* Postman
* Figma
* Angular CLI & Nest CLI

### Tecnologías Utilizadas

| Capa       | Tecnología / Biblioteca   | Uso Principal                            |
| ---------- | ------------------------- | ---------------------------------------- |
| Frontend   | Angular, Ionic, Bootstrap | SPA y responsive móvil/web               |
| Backend    | NestJS (TypeScript)       | API REST y lógica de negocio             |
| Base Datos | PostgreSQL, Sequelize     | Almacenamiento relacional                |
| Seguridad  | JWT, Bcrypt               | Autenticación y cifrado de contraseñas   |
| Otros      | RxJS, Angular Forms       | Manejo reactivo y gestión de formularios |

### Modelo de Datos

![Diagrama ER](docs/images/erd.png)

Entidades principales: Cliente ↔ Mascota → Historial Médico → Entrada Historial; Veterinario ↔ Cita; Servicio Prestado.

## Despliegue

1. Clonar repositorio: `git clone https://github.com/tu-org/vetappointment.git`
2. Configurar `.env` con credenciales de base de datos.
3. Instalar dependencias:

   ```bash
   npm install
   cd backend && npm install
   ```
4. Ejecutar migraciones y seeders:

   ```bash
   npm run migrate:up
   npm run seed:run
   ```
5. Iniciar servidores:

   ```bash
   npm run start:dev      # Frontend
   cd backend && npm run start:dev # Backend
   ```

## Conclusiones

VetAppointment ofrece una solución moderna y eficiente para la gestión interna de clínicas veterinarias, con una arquitectura escalable y una interfaz enfocada en mejorar la productividad del personal.

## Líneas de Futuro

* Módulo completo de facturación y generación de comprobantes.
* Notificaciones por email/SMS para recordatorios de citas.
* Dashboard de métricas clínicas.
* Gestión de stock médico.
* Internacionalización (i18n).
* Backups automáticos y herramientas de recuperación.
