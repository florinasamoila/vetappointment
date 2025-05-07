  
# 🐾 VetAppointment – Software de Gestión Veterinaria

**Proyecto Final – CFGS Desarrollo de Aplicaciones Multiplataforma**  
**Autora**: Florina-Viorica Samoila  
**Curso**: 2024–2025

---

## 📌 Introducción

VetAppointment es una aplicación pensada para optimizar la **gestión interna de clínicas veterinarias**. Está orientada exclusivamente al personal clínico (recepcionistas, veterinarios y administradores) y permite centralizar la información médica, citas, historiales y tareas administrativas desde una única interfaz, moderna y adaptable a múltiples dispositivos.

---

## 🩺 Descripción del Proyecto

La aplicación permite:

- Registrar **mascotas** y sus datos clínicos.
- Programar, modificar y anular **citas médicas**.
- Consultar y registrar el **historial médico** de los pacientes.
- Dividir el sistema por **roles** con permisos diferenciados.
- Facilitar la **organización del personal veterinario**.
- Consultar agenda diaria y filtros por estado/hora.

Todo el sistema está desarrollado como una aplicación **web y móvil responsive** usando tecnologías modernas como Angular, Ionic y NestJS, con MongoDB como base de datos en la nube (MongoDB Atlas).

---

## 🎯 Objetivo General

Crear una solución digital integral que permita a clínicas veterinarias:
- **Centralizar** la gestión de pacientes y citas.
- **Reducir errores administrativos**.
- **Mejorar la trazabilidad médica** de cada animal atendido.
- **Aumentar la eficiencia operativa** diaria del equipo clínico.

---

## 📅 Planificación

El desarrollo se organizó en 5 etapas:
1. Análisis de requerimientos y tecnologías.
2. Diseño de interfaces y estructura.
3. Desarrollo del backend y modelos de datos.
4. Desarrollo del frontend e integración.
5. Pruebas funcionales y documentación.


---

## 📈 Análisis de Mercado

A pesar de que existen softwares como **VetWin**, **ClinicCloud** y **GestVet**, estos suelen presentar una o varias de las siguientes limitaciones:
- Interfaces anticuadas o poco intuitivas.
- Alto coste mensual.
- Falta de adaptación a pequeñas clínicas.

**VetAppointment** propone una alternativa **moderna, gratuita, personalizada y escalable**, desarrollada con tecnologías libres y pensada para entornos reales.

---

## 👥 Público Objetivo

- **Recepcionistas**: agendan citas, gestionan clientes y mascotas.
- **Veterinarios**: registran tratamientos, consultan historial y citas.
- **Administradores**: supervisan todo el sistema, usuarios y estadísticas.

No está pensada para los clientes (dueños de mascotas), lo cual simplifica su uso y la hace más eficiente internamente.

---

## 📌 Propuesta y Especificaciones Técnicas

- Registro y gestión de **clientes, mascotas, veterinarios y servicios prestados**.
- **Citas médicas** gestionables con filtros, estados y calendario.
- **Control de acceso por roles**.
- Interfaz limpia, rápida y responsive (Ionic + Bootstrap).
- Conexión segura con base de datos **MongoDB Atlas**.
- Backoffice intuitivo para gestionar operaciones clínicas.

---

## 🎨 Diseño de Interfaces

- **Fidelidad baja**: bocetos en papel para definir pantallas y flujos.
- **Fidelidad media**: prototipos wireframe (estructura y jerarquía).
- **Fidelidad alta**: interfaz real desarrollada con Angular + Ionic + Bootstrap, respetando la identidad visual profesional.

---

## 🏗️ Desarrollo y Arquitectura

### Frontend
- SPA con Angular e Ionic.
- Módulos organizados por funciones: clientes, mascotas, citas, historial, etc.
- Formularios validados con Angular Forms.
- Comunicación con backend vía `HttpClient`.

### Backend
- NestJS (Node.js + TypeScript).
- Arquitectura modular: controladores, servicios, DTOs y validaciones.
- Autenticación con JWT, encriptación de contraseñas con bcrypt. (Trabajo futuro)
- WebSocket Gateway (opcional para notificaciones en tiempo real). (Trabajo futuro)

### Base de Datos
- MongoDB Atlas (NoSQL)
- Colecciones principales:
  - `cliente`, `mascota`, `veterinario`, `cita`, `historialMedico`, `facturacion`, `servicioPrestado`

---

## 🧪 Herramientas de Desarrollo

- **VSCode** – Entorno principal.
- **Postman** – Testeo de la API REST.
- **MongoDB Compass** – Visualización de base de datos.
- **Figma** – Prototipado de interfaces.
- **Git + GitHub** – Control de versiones.
- **Swagger** – Documentación OpenApi.

---

## 🚀 Instrucciones de Despliegue

1. Clonar el proyecto:
```bash
git clone https://github.com/florinasamoila/vetappointment.git
cd vetappointment/back-front
```

2. Configurar `.env` en `backend` con la URI de MongoDB Atlas


3. Instalar dependencias e iniciar backend:
```bash
cd backend
npm install
npm run start:dev
```

4. Iniciar frontend:
```bash
cd ../frontend
npm install
ng serve
```

---

## ✅ Conclusiones

VetAppointment ha logrado:
- Desarrollar una solución modular, escalable y usable.
- Optimizar la gestión de datos clínicos y de agenda.
- Mejorar la organización interna del trabajo veterinario.

---

## 🌱 Líneas de Futuro

- Módulo completo de **facturación** con generación de comprobantes.
- **Notificaciones** internas, por email o SMS.
- **Dashboard** de estadísticas y rendimiento clínico.
- **Gestión de stock** de medicamentos e insumos.
- **Backups automáticos** y funcionalidades de recuperación.
- **Internacionalización (i18n)** para múltiples idiomas.

---

