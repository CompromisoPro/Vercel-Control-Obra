# 🏗️ Control de Obra Gerencial

Sistema de seguimiento y control de avance de obras de construcción a nivel gerencial.

## 🚀 Deploy en Vercel (5 minutos)

### Opción 1: Deploy directo (más fácil)

1. Ve a [vercel.com](https://vercel.com) y crea cuenta con Google o GitHub
2. Haz clic en "New Project"
3. Selecciona "Import Git Repository" o arrastra esta carpeta
4. Haz clic en "Deploy"
5. ¡Listo! Te dará un link tipo `tu-proyecto.vercel.app`

### Opción 2: Desde GitHub

1. Sube esta carpeta a un repositorio de GitHub
2. Conecta tu GitHub con Vercel
3. Importa el repositorio
4. Deploy automático

## 📁 Estructura del Proyecto

```
control-obra-vercel/
├── public/
│   ├── favicon.svg
│   └── manifest.json
├── src/
│   ├── App.jsx          # Componente principal
│   ├── main.jsx         # Entry point
│   └── index.css        # Estilos Tailwind
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 🛠️ Desarrollo Local

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build
```

## 📊 Características

- ✅ Dashboard con KPIs principales
- ✅ Mapa visual de departamentos por piso
- ✅ Detalle de avance por partida
- ✅ Sistema de alertas
- ✅ Gráficos de evolución
- ✅ Diseño responsive
- ✅ PWA instalable

## 🔮 Próximos Pasos

1. Conectar con Google Sheets para datos en tiempo real
2. Agregar sistema de login
3. Configuración dinámica de proyectos
4. Exportar reportes PDF
5. Notificaciones de alertas

---

Desarrollado con 💜 usando React + Vite + Tailwind
