# PokeBattle

Una aplicación web para crear y gestionar equipos de Pokémon con funcionalidades de batalla simulada. Construida con React, Vite y TailwindCSS siguiendo la arquitectura **Bulletproof React**.

## 🚀 Características

- **Exploración de Pokémon**: Navega por todos los Pokémon con búsqueda, filtros y scroll infinito
- **Constructor de Equipos**: Crea equipos de hasta 6 Pokémon con validación de restricciones
- **Gestión de Estado**: Sistema robusto con Zustand y React Query para caché optimizado
- **Interfaz Responsiva**: Diseño adaptativo con TailwindCSS
- **Testing**: Suite de tests con Jest y React Testing Library
- **Drag & Drop**: Reordena Pokémon en equipos con dnd-kit

## 📋 Requisitos

- **Node.js**: v18.0.0 o superior (recomendado v22.17.1)
- **npm**: v9.0.0 o superior (recomendado v10.9.2)

## 🛠️ Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd pokebattle

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

## 📝 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo (http://localhost:5173)
npm run build        # Build de producción
npm run preview      # Vista previa del build
npm test             # Ejecutar tests una vez
npm run test:watch   # Ejecutar tests en modo watch
npm run test:coverage # Ejecutar tests con coverage
npm run lint         # Linting con Biome
npm run format       # Formateo de código
npm run check        # Verificación completa (lint + format)
```

## 🏗️ Arquitectura del Proyecto

- Se ha usado una estructura bulletproof: https://github.com/alan2207/bulletproof-react?ref=madewithreactjs.com

```
src/
├── app/                    # Configuración de la aplicación
│   ├── App.jsx            # Componente raíz
│   └── providers/         # Providers globales (Router, Query, etc.)
├── components/            # Componentes reutilizables
│   ├── common/           # Componentes UI genéricos
│   └── layout/           # Componentes de layout
├── features/             # Módulos por funcionalidad
│   ├── battle/          # Sistema de batallas
│   ├── pokemon/         # Gestión de Pokémon
│   │   ├── api/        # Llamadas a PokéAPI
│   │   ├── components/ # Componentes específicos
│   │   ├── hooks/      # Hooks personalizados
│   │   └── utils/      # Utilidades y extractores
│   └── teams/          # Gestión de equipos
│       ├── components/ # Constructor de equipos
│       ├── hooks/      # Lógica de negocio
│       └── store/      # Estado global con Zustand
├── hooks/               # Hooks globales
├── config/             # Constantes y configuración
└── styles/             # Estilos globales
```

## 🔧 Tecnologías Principales

### Core
- **React 19.1.1** - Framework principal
- **Vite 7.1.2** - Build tool y dev server
- **TailwindCSS 4.1.12** - Framework CSS utility-first

### Estado y Data Fetching
- **Zustand 5.0.8** - Gestión de estado global
- **TanStack Query 5.85.5** - Server state y caché
- **React Router 7.8.2** - Enrutamiento

### UI/UX
- **dnd-kit 6.3.1** - Drag and drop
- **React Hot Toast 2.6.0** - Notificaciones

### Testing y Calidad
- **Jest 30.1.1** - Framework de testing principal
- **React Testing Library 16.3.0** - Testing de componentes React
- **Biome 2.2.2** - Linting y formatting

## 🎮 Uso

### Explorar Pokémon
1. Navega a la página principal
2. Mira tus equipos o borradores

### Crear Equipos
1. Ve a "Constructor de Equipos"
2. Usa la barra de búsqueda para encontrar Pokémon específicos
4. Haz scroll para cargar más Pokémon automáticamente
2. Sselecciona hasta 6 Pokémon
3. Arrastra y suelta para reordenar
4. Guarda tu equipo con un nombre personalizado

### Batallas (Simuladas)
1. Selecciona dos equipos
2. Ejecuta la simulación de batalla
3. Ve los resultados basados en stats y tipos

## 🧪 Testing

```bash
# Ejecutar todos los tests una vez
npm test

# Ejecutar tests en modo watch
npm run test:watch

# Tests con coverage
npm run test:coverage

# Tests específicos
npm test PokemonCard
npm test TeamBuilder
```

## 📦 Build y Despliegue

```bash
# Generar build optimizado
npm run build

# Vista previa local del build
npm run preview
```

Los archivos se generan en `/dist` listos para despliegue.

## 🌟 Patrones de Código

### Bulletproof Architecture
Cada funcionalidad está encapsulada en su propio módulo con:
- Componentes específicos
- Hooks de lógica de negocio  
- Llamadas API dedicadas
- Tests aislados

### Estado Centralizado
- **Zustand** para estado global de equipos y UI
- **React Query** para estado del servidor y caché
- **Local state** para estado de componentes

### Componentes Reutilizables
- Componentes UI genéricos en `/common`