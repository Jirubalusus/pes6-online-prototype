# PES 6 Online Lab

Prototipo Vite/React para un portal experimental de launcher y streaming BYOC ("bring your own copy") inspirado en portales web de juego clásico, pero sin incluir ni replicar material protegido.

## Enfoque

PES 6 Online Lab plantea una experiencia futura de emulación remota/local:

- El usuario aporta su copia legítima del juego.
- El portal no aloja ni distribuye ISO, ejecutables, BIOS, option files comerciales, música, logos ni assets originales.
- La UI usa carátulas abstractas propias y una estética consola/fútbol de los 2000 sin marcas de terceros.

## Arquitectura propuesta

Flujo conceptual:

```text
Browser input -> Session server -> PES/PCSX2/Wine -> WebRTC video/audio
```

El prototipo simula sesiones, estados de compatibilidad, consola de emulación, métricas y progreso. No ejecuta emuladores reales ni procesa archivos de juego.

## Instalación local

```bash
npm install
npm run dev
```

Build de producción:

```bash
npm run build
npm run preview
```

## GitHub Pages

`vite.config.js` usa:

```js
base: '/pes6-online-prototype/'
```

El workflow `.github/workflows/deploy.yml` construye `dist` y lo publica en GitHub Pages cuando se haga push a `main` o se ejecute manualmente desde Actions.

En GitHub, configura Pages con "GitHub Actions" como fuente de despliegue.

## Limitaciones legales y técnicas

- No se incluye PES 6, ISO, ejecutables, BIOS, audio, comentarios, logos, option files comerciales ni assets oficiales.
- La sección de sesión es una simulación visual para validar UX.
- La emulación remota real requeriría aislamiento por sesión, subida/verificación de archivos aportados por el usuario, licencias claras, servidor GPU/CPU, streaming WebRTC, input de baja latencia y políticas de borrado.
- PCSX2, Wine u otros componentes se mencionan solo como posibles piezas de arquitectura futura; no se empaquetan en este prototipo.
