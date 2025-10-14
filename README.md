# 📱 GPS OT Manager - Sistema de Órdenes de Trabajo

<div align="center">

![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.0.8-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![CSS3](https://img.shields.io/badge/CSS3-Modern-1572B6?style=for-the-badge&logo=css3&logoColor=white)

Sistema web moderno para gestión de órdenes de trabajo de instalaciones de equipos GPS en vehículos.

[Demo](#) · [Reportar Bug](../../issues) · [Solicitar Feature](../../issues)

</div>

---

## 🌟 Características Principales

### ✅ Gestión de Órdenes de Trabajo
- **Creación de OT** con numeración automática por empresa (LWE0001, U0001, etc.)
- **Múltiples OT** en una sesión con datos de empresa persistentes
- **CheckList interactivo** del vehículo con sistema de estados (Bueno/Con Detalles)
- **Formularios completos** para GPS, vehículo y datos técnicos

### 📊 Base de Datos Local
- **Almacenamiento local** usando LocalStorage
- **CRUD completo**: Crear, Leer, Actualizar, Eliminar
- **Búsqueda y filtrado** por patente, IMEI, modelo, etc.
- **Retención automática** de OTs de los últimos 2 meses
- **Exportación** de datos a JSON

### ✍️ Firma Digital
- **Canvas de firma** táctil para móviles y tabletas
- **Formulario de cliente** con validación de datos
- **Encuesta de satisfacción** con sistema de estrellas

### 🎨 Diseño Moderno
- **UI Futurista** con efectos glassmorphism
- **Responsive Design** optimizado para móviles
- **Animaciones suaves** y transiciones fluidas
- **Paleta de colores** moderna (azul/púrpura)

---

## 🚀 Inicio Rápido

### Requisitos Previos

- **Node.js** 16.x o superior
- **npm** 7.x o superior

### Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/gps-ot-manager.git

# 2. Entrar al directorio
cd gps-ot-manager

# 3. Instalar dependencias
npm install

# 4. Iniciar servidor de desarrollo
npm run dev
```

La aplicación se abrirá automáticamente en `http://localhost:3000`

---

## 📦 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia el servidor de desarrollo

# Producción
npm run build        # Compila para producción
npm run preview      # Previsualiza la build de producción
```

---

## 🏗️ Estructura del Proyecto

```
gps-ot-app/
│
├── public/                    # Archivos estáticos
│
├── src/
│   ├── components/           # Componentes React
│   │   ├── Index.jsx        # Menú principal
│   │   ├── ModalEmpresa.jsx # Modal selección de empresa
│   │   ├── CrearOT.jsx      # Formulario principal
│   │   ├── DatosEmpresa.jsx # Datos de la empresa
│   │   ├── DatosGPS.jsx     # Datos del servicio GPS
│   │   ├── DatosVehiculo.jsx # Datos del vehículo
│   │   ├── CheckList.jsx    # CheckList interactivo
│   │   ├── FormularioCliente.jsx # Datos del cliente
│   │   ├── FirmaDigital.jsx # Canvas de firma
│   │   ├── Encuesta.jsx     # Encuesta de satisfacción
│   │   ├── BaseDatos.jsx    # Listado de OTs
│   │   └── DetalleOT.jsx    # Ver/Editar OT
│   │
│   ├── styles/              # Archivos CSS
│   │   ├── global.css       # Estilos globales
│   │   ├── index.css        # Estilos menú principal
│   │   ├── modalEmpresa.css # Estilos modal
│   │   ├── crearOT.css      # Estilos creación OT
│   │   ├── checkList.css    # Estilos checklist
│   │   ├── formularioCliente.css # Estilos formulario
│   │   ├── encuesta.css     # Estilos encuesta
│   │   ├── baseDatos.css    # Estilos base datos
│   │   └── detalleOT.css    # Estilos detalle
│   │
│   ├── utils/               # Utilidades
│   │   └── storage.js       # Funciones LocalStorage
│   │
│   ├── App.jsx              # Componente principal
│   └── main.jsx             # Punto de entrada
│
├── index.html               # HTML base
├── package.json             # Dependencias
├── vite.config.js          # Configuración Vite
└── README.md               # Documentación

```

---

## 💡 Uso de la Aplicación

### 1. Crear Orden de Trabajo

1. En el menú principal, clic en **"Crear Orden de Trabajo"**
2. Selecciona la **empresa** (LW-Entel, UGPS, u Otra)
3. Completa los **datos de la empresa**
4. Ingresa **datos del servicio GPS** (técnico, tipo de servicio, accesorios)
5. Registra los **datos del vehículo**
6. Completa el **CheckList** (Luces, Radio, Tablero, Check Engine, Batería)
7. Haz clic en **"Finalizar Orden de Trabajo"**
8. Decide si crear otra OT o finalizar
9. Al finalizar, ingresa **datos del cliente** y obtén su **firma digital**
10. Completa la **encuesta de satisfacción**

### 2. Gestionar Base de Datos

1. Selecciona **"Base de Datos"** en el menú principal
2. Visualiza todas las OTs (últimos 2 meses)
3. Usa el **buscador** para filtrar
4. Opciones disponibles:
   - **👁️ Ver**: Visualizar detalles completos
   - **✏️ Editar**: Modificar información
   - **🗑️ Eliminar**: Borrar OT
   - **📥 Exportar**: Descargar todas las OTs en JSON

---

## 🎨 Tecnologías Utilizadas

- **React 18** - Librería de UI
- **Vite** - Build tool y dev server
- **CSS3 Moderno** - Estilos con variables CSS y animaciones
- **LocalStorage API** - Almacenamiento persistente
- **Google Fonts** - Tipografías (Russo One, Changa, Quantico)

---

## 📱 Características Móviles

- ✅ **Diseño mobile-first** optimizado para smartphones
- ✅ **Touch-friendly** con botones y áreas táctiles grandes
- ✅ **Firma digital** con soporte para dedo o stylus
- ✅ **Responsive** adaptable a tablets y desktop
- ✅ **Performance** optimizado para conexiones lentas

---

## 🔒 Privacidad y Seguridad

- **Datos locales**: Toda la información se almacena en el navegador del usuario
- **Sin servidor**: No se envían datos a servidores externos
- **Sin autenticación**: Diseñado para uso personal/individual
- **Backup manual**: Usa "Exportar a JSON" para respaldos

---

## 🚀 Despliegue

### Opción 1: Vercel (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
vercel
```

### Opción 2: Netlify

```bash
# Build
npm run build

# Arrastra la carpeta 'dist' a Netlify
```

### Opción 3: GitHub Pages

```bash
# Instalar gh-pages
npm install --save-dev gh-pages

# Agregar en package.json
"homepage": "https://tu-usuario.github.io/gps-ot-manager",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}

# Desplegar
npm run deploy
```

---

## 🤝 Contribuir

Las contribuciones son bienvenidas. Para cambios importantes:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add: nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 👨‍💻 Autor

**Tu Nombre**
- GitHub: [@tu-usuario](https://github.com/tu-usuario)
- Email: tu-email@ejemplo.com

---

## 🙏 Agradecimientos

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Google Fonts](https://fonts.google.com/)

---

<div align="center">

**⭐ Si este proyecto te fue útil, considera darle una estrella ⭐**

Hecho con ❤️ y ☕

</div>