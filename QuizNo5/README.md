# 🐉 Bocaraká Arcade — Bothriechis Edition

[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![CSS3](https://img.shields.io/badge/CSS3-Custom-1572B6?style=for-the-badge&logo=css3)](https://w3.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**Bocaraká Arcade** es una reinterpretación retro-futurista de estilo cyberpunk del clásico juego *Snake*, inspirada en la víbora de pestañas costarricense (*Bothriechis schlegelii*). Diseñada con maquetación de gabinete arcade CRT, efectos cromáticos de glitch, síntesis de audio nativa y estructurada para su integración con flujos de automatización en **n8n**.

---

## 🚀 Características Principales

* 🕹️ **Interfaz de Gabinete Arcade CRT**: Estética retro con líneas de escaneo (*scanlines*), iluminación neón y contornos de pantalla cibernética.
* 👾 **Pantalla Game Over con Efecto Glitch**: Transición visual con distorsión cibernética, animación RGB split y tabla integrada de mejores puntuaciones (*Top High Scores*).
* 🎵 **Efectos de Sonido Sintetizados**: Audio generado en tiempo real mediante la **Web Audio API** nativa (sin consumo de archivos multimedia externos).
* 🐍 **Mecánica de Juego Adaptativa**: Detección de colisiones, escalado de velocidad progresivo por niveles y gestión de vidas/puntuación.
* ⚡ **Integración con n8n & JSON Server**: Documento `db.json` configurado para sincronizar récords y telemetría de partida a través de nodos HTTP / Webhooks.

---

## 🛠️ Tecnologías Utilizadas

| Tecnología | Uso / Función |
| :--- | :--- |
| **React 18** | Arquitectura de componentes de interfaz y gestión del estado del juego. |
| **Vite** | Entorno de desarrollo y empaquetador de aplicaciones web de alta velocidad. |
| **CSS3 Puro** | Estilos personalizados, efectos neón, animaciones `@keyframes` y diseño responsivo. |
| **Web Audio API** | Generación sintética de ondas cuadradas y diente de sierra para efectos arcade. |
| **JSON Server / n8n** | Almacenamiento local de datos y conector para flujos de automatización. |

---

## 📁 Estructura del Proyecto

```text
bocaraka-arcade/
├── public/
├── src/
│   ├── Components/
│   │   └── Tablero.jsx        # Renderizado de la cuadrícula, serpiente y objetivos
│   ├── Pages/
│   │   ├── Inicio.jsx         # Pantalla principal con marquesina e Insert Coin
│   │   └── Juego.jsx          # Lógica de bucle de juego, estados y overlay de Glitch
│   ├── Utils/
│   │   └── sound.js           # Sintetizador de efectos de sonido con Web Audio API
│   ├── App.jsx                # Enrutador de vistas (Inicio / Juego)
│   ├── index.css              # Hoja de estilos global, temas neón y animación Glitch
│   └── main.jsx               # Punto de entrada de la aplicación Vite
├── db.json                    # Base de datos JSON preparada para Webhooks de n8n
├── package.json
└── README.md