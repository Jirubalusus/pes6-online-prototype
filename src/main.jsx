import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const modes = [
  {
    id: 'pc-remote',
    title: 'PES 6 PC',
    label: 'Remote Session',
    status: 'Prototype ready',
    compatibility: 'Alta prioridad: Wine/Windows host, pad mapping y streaming WebRTC.',
    accent: 'cyan',
    art: 'ball',
    metrics: ['60 FPS target', '<45 ms input', 'BYOC required'],
  },
  {
    id: 'ps2-slot',
    title: 'PES 6 PS2',
    label: 'Emulator Slot',
    status: 'Research track',
    compatibility: 'Pendiente: slot aislado con BIOS y disco aportados por el usuario.',
    accent: 'amber',
    art: 'chip',
    metrics: ['PCSX2 path', 'Save states off', 'No BIOS hosted'],
  },
  {
    id: 'master-league',
    title: 'Liga Master 2006',
    label: 'Campaign Shell',
    status: 'UX mock',
    compatibility: 'Capa de launcher para partidas, saves privados y calendario.',
    accent: 'green',
    art: 'pitch',
    metrics: ['Private saves', 'Season hub', 'Cloud sync mock'],
  },
  {
    id: 'quick-match',
    title: 'Partido rapido',
    label: 'Fast Boot',
    status: 'Prototype ready',
    compatibility: 'Flujo directo para configurar mandos, sala y arranque.',
    accent: 'blue',
    art: 'tunnel',
    metrics: ['One-click lobby', 'Pad preset', 'Low-latency mode'],
  },
  {
    id: 'option-file',
    title: 'Option File Manager',
    label: 'User Files',
    status: 'Local only',
    compatibility: 'Gestor futuro para importar archivos aportados por el usuario.',
    accent: 'violet',
    art: 'card',
    metrics: ['Checksum view', 'No sharing', 'User-owned data'],
  },
  {
    id: 'online-rooms',
    title: 'Salas online',
    label: 'Lobby Layer',
    status: 'Design pass',
    compatibility: 'Matchmaking, invitaciones, permisos y estado de hosts.',
    accent: 'red',
    art: 'controller',
    metrics: ['Room codes', 'Spectator later', 'Host health'],
  },
];

const bootLines = [
  'LAB firmware: sandbox profile loaded',
  'Input bridge: gamepad slot 1 listening',
  'Storage: no user game image mounted',
  'Renderer: WebRTC target pipeline armed',
  'Policy: copyrighted content unavailable',
  'State: Waiting for user-provided game files',
];

function App() {
  const [selected, setSelected] = useState(null);
  const [progress, setProgress] = useState(0);
  const [preparing, setPreparing] = useState(false);

  useEffect(() => {
    if (!preparing) return undefined;
    const timer = window.setInterval(() => {
      setProgress((value) => {
        if (value >= 100) {
          window.clearInterval(timer);
          setPreparing(false);
          return 100;
        }
        return Math.min(value + 8, 100);
      });
    }, 180);

    return () => window.clearInterval(timer);
  }, [preparing]);

  const activeMode = useMemo(
    () => modes.find((mode) => mode.id === selected),
    [selected],
  );

  const openMode = (modeId) => {
    setSelected(modeId);
    setProgress(0);
    setPreparing(false);
  };

  const prepareSession = () => {
    setProgress(4);
    setPreparing(true);
  };

  return (
    <main className="app-shell">
      <div className="crt-layer" aria-hidden="true" />
      <Header />

      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow">Remote play prototype / BYOC</p>
          <h1 id="hero-title">PES 6 Online Lab</h1>
          <p className="subtitle">Launcher experimental - usa tu propia copia</p>
          <div className="hero-actions">
            <a className="primary-action" href="#modes">Explorar modos</a>
            <a className="secondary-action" href="#console">Ver consola</a>
          </div>
        </div>
        <ConsolePreview compact />
      </section>

      <section className="mode-section" id="modes" aria-labelledby="modes-title">
        <div className="section-heading">
          <p className="eyebrow">Session catalog</p>
          <h2 id="modes-title">Modos y versiones</h2>
        </div>
        <div className="mode-grid">
          {modes.map((mode) => (
            <button
              className={`mode-card accent-${mode.accent}`}
              key={mode.id}
              type="button"
              onClick={() => openMode(mode.id)}
            >
              <CardArt type={mode.art} />
              <span className="mode-label">{mode.label}</span>
              <strong>{mode.title}</strong>
              <span className="mode-status">{mode.status}</span>
              <span className="mode-cta">Abrir panel</span>
            </button>
          ))}
        </div>
      </section>

      <Architecture />

      <section className="console-section" id="console" aria-labelledby="console-title">
        <div className="section-heading">
          <p className="eyebrow">Emulation Console</p>
          <h2 id="console-title">Monitor de sesion</h2>
        </div>
        <ConsolePreview />
      </section>

      <LegalPanel />

      <footer className="footer">
        <span>PES 6 Online Lab prototype</span>
        <span>No official assets. No game files. BYOC only.</span>
      </footer>

      {activeMode && (
        <SessionPanel
          mode={activeMode}
          progress={progress}
          preparing={preparing}
          onPrepare={prepareSession}
          onClose={() => setSelected(null)}
        />
      )}
    </main>
  );
}

function Header() {
  return (
    <header className="topbar">
      <a className="brand" href="#top" aria-label="PES 6 Online Lab home">
        <span className="brand-mark" aria-hidden="true" />
        <span>PES 6 Online Lab</span>
      </a>
      <nav className="nav-links" aria-label="Navegacion principal">
        <a href="#modes">Modos</a>
        <a href="#architecture">Arquitectura</a>
        <a href="#console">Consola</a>
      </nav>
    </header>
  );
}

function CardArt({ type }) {
  return (
    <span className={`card-art art-${type}`} aria-hidden="true">
      <span />
      <i />
      <b />
    </span>
  );
}

function Architecture() {
  const nodes = ['Browser input', 'Session server', 'PES/PCSX2/Wine', 'WebRTC video/audio'];

  return (
    <section className="architecture" id="architecture" aria-labelledby="architecture-title">
      <div className="section-heading">
        <p className="eyebrow">Arquitectura propuesta</p>
        <h2 id="architecture-title">Del navegador al stream</h2>
      </div>
      <div className="diagram" role="list" aria-label="Flujo de arquitectura propuesta">
        {nodes.map((node, index) => (
          <React.Fragment key={node}>
            <div className="diagram-node" role="listitem">
              <span className="node-index">0{index + 1}</span>
              <strong>{node}</strong>
            </div>
            {index < nodes.length - 1 && <div className="diagram-link" aria-hidden="true" />}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}

function ConsolePreview({ compact = false }) {
  return (
    <div className={`console ${compact ? 'console-compact' : ''}`}>
      <div className="console-screen">
        <div className="boot-mark" aria-hidden="true">
          <span />
        </div>
        <div className="log-lines">
          {bootLines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </div>
      <div className="telemetry" aria-label="Indicadores de sesion">
        <Meter label="FPS" value="--" state="standby" />
        <Meter label="Latency" value="-- ms" state="standby" />
        <Meter label="Audio" value="Armed" state="ok" />
        <Meter label="Input" value="Idle" state="warn" />
      </div>
      <p className="console-state">Waiting for user-provided game files</p>
    </div>
  );
}

function Meter({ label, value, state }) {
  return (
    <div className={`meter meter-${state}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function LegalPanel() {
  return (
    <section className="legal-panel" aria-labelledby="legal-title">
      <div>
        <p className="eyebrow">Legal / seguridad</p>
        <h2 id="legal-title">Contenido aportado por el usuario</h2>
      </div>
      <p>
        Este prototipo no aloja ni distribuye el juego, BIOS, ejecutables, audio,
        comentarios, logos, option files comerciales ni material oficial. La experiencia
        esta disenada como BYOC: cada usuario debe aportar su copia legitima y gestionar
        sus propios archivos.
      </p>
    </section>
  );
}

function SessionPanel({ mode, progress, preparing, onPrepare, onClose }) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className={`session-panel accent-${mode.accent}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="session-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="close-button" type="button" onClick={onClose} aria-label="Cerrar panel">
          x
        </button>
        <div className="session-hero">
          <CardArt type={mode.art} />
          <div>
            <span className="mode-label">{mode.label}</span>
            <h2 id="session-title">{mode.title}</h2>
            <p>{mode.compatibility}</p>
          </div>
        </div>

        <div className="compatibility">
          <span>Estado de compatibilidad</span>
          <strong>{mode.status}</strong>
        </div>

        <ol className="steps">
          <li>
            <span>01</span>
            <p>Subir copia propia o seleccionar una ruta local futura.</p>
          </li>
          <li>
            <span>02</span>
            <p>Configurar region, mando, aislamiento de sesion y almacenamiento privado.</p>
          </li>
          <li>
            <span>03</span>
            <p>Iniciar streaming de video/audio con input de baja latencia.</p>
          </li>
        </ol>

        <div className="metric-row">
          {mode.metrics.map((metric) => (
            <span key={metric}>{metric}</span>
          ))}
        </div>

        <button className="prepare-button" type="button" onClick={onPrepare} disabled={preparing}>
          {preparing ? 'Preparando...' : progress === 100 ? 'Sesion preparada' : 'Preparar sesion'}
        </button>
        <div className="progress-track" aria-label={`Progreso ${progress}%`}>
          <span style={{ width: `${progress}%` }} />
        </div>
        <p className="session-note">
          Simulacion UX: no se montan archivos ni se ejecuta ningun emulador.
        </p>
      </section>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
