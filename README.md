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


![diagrama_gantt_completo](https://github.com/user-attachments/assets/f9234f07-a816-4d15-88e0-26a6cdc7ff1a)



*Diagrama de Gantt que muestra las fases de análisis, diseño, desarrollo y despliegue.*



## Análisis de Mercado en España

**Panorama General**
En España operan más de **7 100** clínicas veterinarias distribuidas por todo el territorio, con Madrid, Barcelona, Valencia, Alicante, Málaga y Sevilla a la cabeza en número de centros. El sector de animales de compañía facturó **2 613 millones de euros** en 2023, con un crecimiento interanual del **8,3%**.

### Tamaño y Crecimiento del Mercado de Software

* **Global:** el mercado mundial de software veterinario se estima en **USD 1,85 mil millones** para 2025, con una tasa de crecimiento anual compuesta (CAGR) del **6,1%** hasta 2030.
* **España:** aunque no hay datos públicos detallados, se estima que el gasto en software de gestión representa el **1 – 2%** de la facturación clínica anual, lo que supondría un mercado de **26 – 52 millones de euros** en 2023, con un crecimiento anual cercano al **6 – 7%**.

### Factores Impulsores

1. **Humanización de las mascotas:** el censo de perros supera los **9,29 millones** y el de gatos los **1,6 millones**, creando demanda de servicios veterinarios especializados.
2. **Normativa y trazabilidad:** nuevas regulaciones sobre receta electrónica y dispensación de fármacos exigen sistemas que garanticen el cumplimiento legal.
3. **Digitalización post-COVID:** aumento de teleconsulta y gestión remota, favoreciendo soluciones en la nube y acceso multi-dispositivo.

### Segmentación del Mercado

* **Por tamaño de clínica:**

  * **Pequeñas (1–2 veterinarios):** soluciones SaaS desde **25–50 €/mes**.
  * **Medianas (3–5 veterinarios):** paquetes con facturación avanzada, CRM y agendas compartidas.
  * **Grandes (>5 veterinarios):** sistemas on-premise personalizables e integraciones con laboratorio y ERP.
* **Por modelo de despliegue:**

  * **Cloud/SaaS (\~60%):** escalado sencillo y coste inicial bajo.
  * **Instalado (Windows/Linux):** preferido por clínicas con infraestructura TI propia.

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

1. Crear, modificar, visualizar y eliminar citas médicas.
2. Registrar y consultar historiales clínicos completos.
3. Gestionar veterinarios y sus horarios.
4. Agenda visual diaria, semanal y mensual.
5. Control de acceso por roles.
6. Compatibilidad con dispositivos de escritorio y móviles.

## Diseño

### Diagramas de Navegación (User Flow)

```mermaid
flowchart TD
  A["Login (Usuario)"] -->|Credenciales válidas| B["Página Inicio"]
  
  subgraph Navegación Superior
    B --> C["Inicio"]
    B --> D["Citas"]
    B --> E["Clientes"]
    B --> F["Consultas"]
    B --> G["Historial Médico"]
    B --> H["Perfil (admin@…)"]
    B --> I["Ayuda"]
  end

  C --> C1["Ver citas del día seleccionadas en Calendario"]
  D --> D1["Crear / Modificar / Eliminar citas"]
  E --> E1["Registrar Cliente + Mascotas"]
  F --> F1["Búsqueda transversal (borrar / editar / ver)"]
  G --> G1["Gestionar Historial Médico de Mascotas"]
  H --> H1["Administración de Veterinarios"]
  H --> H2["Administración de Servicios"]
  I --> I1["Abrir Swagger UI"]

  style Navegación Superior fill:#f9f,stroke:#333,stroke-width:1px
  style A fill:#ff9,stroke:#333,stroke-width:1px
  style B fill:#9f9,stroke:#333,stroke-width:1px


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

**Base de Datos:** MongoDB (no-relacional)

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
| Base Datos | MongoDB     | Almacenamiento no-relacional                |
| Seguridad  | JWT, Bcrypt               | Autenticación y cifrado de contraseñas (Trabajo futuro)   |
| Otros      | RxJS, Angular Forms       | Manejo reactivo y gestión de formularios |

### Modelo de Datos

![ER_vetAPPointment](https://github.com/user-attachments/assets/1f0e1a4e-edda-4c24-8863-84273c30aab7)


Entidades principales: Cliente ↔ Mascota → Historial Médico → Entrada Historial; Veterinario ↔ Cita; Servicio Prestado.

## Despliegue

1. Clonar repositorio: `git clone [https://github.com/tu-org/vetappointment.git](https://github.com/florinasamoila/vetappointment)`
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
   ng serve --open      # Frontend
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
