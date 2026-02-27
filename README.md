## Zot

Monorepo para las aplicaciones y paquetes de Zot, construido con **TypeScript**, **Next.js** y **Turborepo**.

### Estructura del proyecto

- **apps/**
  - **client**: aplicación principal (panel / app autenticada).
  - **landing-page**: sitio de marketing / landing pública.
- **packages/**: paquetes compartidos (librerías internas, configuración, etc.).

### Requisitos

- Node.js (versión recomendada según `package.json`)
- npm (o el gestor que utilices en tu entorno)

### Instalación

```bash
npm install
```

### Scripts principales

- **Desarrollo (todas las apps)**:

  ```bash
  npm run dev
  ```

- **Build**:

  ```bash
  npm run build
  ```

- **Lint**:

  ```bash
  npm run lint
  ```

Consulta los scripts en `package.json` para ver comandos adicionales específicos.

### Flujo de trabajo recomendado

- Crear nuevas features dentro de la app correspondiente (`apps/client` o `apps/landing-page`).
- Extraer lógica compartida a `packages/` cuando tenga sentido.
- Mantener las pruebas, tipados y linting pasando antes de hacer commit.

### Licencia

Este proyecto está licenciado bajo los términos indicados en `LICENSE`.

