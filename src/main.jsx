import React, { useEffect, useMemo, useRef, useState } from 'react';
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
    if (window.location.hash !== '#play') return undefined;
    const frame = window.requestAnimationFrame(() => {
      document.getElementById('play')?.scrollIntoView({ block: 'start' });
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

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
            <a className="primary-action play-action" href="#play">Jugar ahora</a>
            <button className="secondary-action" type="button" onClick={() => openMode('pc-remote')}>
              Configurar copia propia
            </button>
          </div>
        </div>
        <ConsolePreview compact />
      </section>

      <PlayableSessionShell onConfigure={() => openMode('pc-remote')} />

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
        <a href="#play">Jugar ahora</a>
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

function PlayableSessionShell({ onConfigure }) {
  return (
    <section className="play-session" id="play" aria-labelledby="play-title">
      <div className="play-header">
        <div>
          <p className="eyebrow">Playable Session Shell</p>
          <h2 id="play-title">PLAY SESSION</h2>
          <p>
            Demo interactiva del shell; el stream PES real requiere backend y copia aportada por
            el usuario.
          </p>
        </div>
        <div className="play-actions">
          <button className="secondary-action" type="button" onClick={onConfigure}>
            Configurar copia propia
          </button>
        </div>
      </div>

      <div className="session-rig" aria-label="Sesion remota jugable">
        <FootballMiniGame />
        <aside className="session-side" aria-label="Estado de sesion">
          <div className="scoreboard">
            <span>Local</span>
            <strong>Live</strong>
            <span>Shell FC</span>
          </div>
          <div className="telemetry play-telemetry" aria-label="Telemetria">
            <Meter label="FPS" value="60" state="ok" />
            <Meter label="Latency" value="28 ms" state="ok" />
            <Meter label="Input" value="Live" state="ok" />
            <Meter label="BYOC" value="Pending" state="warn" />
          </div>
          <div className="session-logs">
            <p>Remote frame: synthetic pitch loaded</p>
            <p>Input bridge: keyboard and touch mapped</p>
            <p>Game files: not mounted in public demo</p>
            <p>Policy: no official assets distributed</p>
          </div>
          <div className="keyboard-hints">
            <span>WASD / Flechas: mover</span>
            <span>Espacio: chutar</span>
            <span>Objetivo: empuja el balon y marca</span>
          </div>
        </aside>
      </div>
    </section>
  );
}

function FootballMiniGame() {
  const canvasRef = useRef(null);
  const controlsRef = useRef({
    up: false,
    down: false,
    left: false,
    right: false,
    shoot: false,
  });
  const gameRef = useRef(null);
  const statusRef = useRef('SESSION READY');
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState('SESSION READY');

  const updateStatus = (nextStatus) => {
    if (statusRef.current === nextStatus) return;
    statusRef.current = nextStatus;
    setStatus(nextStatus);
  };

  const resetGame = () => {
    const game = gameRef.current;
    if (!game) return;
    game.player = { x: 0.24, y: 0.5, vx: 0, vy: 0 };
    game.ball = { x: 0.48, y: 0.5, vx: 0, vy: 0 };
    game.dummies = [
      { x: 0.6, y: 0.32, phase: 0 },
      { x: 0.66, y: 0.66, phase: 2.1 },
      { x: 0.78, y: 0.48, phase: 4.2 },
    ];
    game.score = 0;
    game.lastKick = 0;
    setScore(0);
    updateStatus('SESSION RESET');
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const game = {
      width: 960,
      height: 540,
      player: { x: 0.24, y: 0.5, vx: 0, vy: 0 },
      ball: { x: 0.48, y: 0.5, vx: 0, vy: 0 },
      dummies: [
        { x: 0.6, y: 0.32, phase: 0 },
        { x: 0.66, y: 0.66, phase: 2.1 },
        { x: 0.78, y: 0.48, phase: 4.2 },
      ],
      score: 0,
      lastKick: 0,
      lastTime: performance.now(),
      raf: 0,
    };
    gameRef.current = game;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      game.width = rect.width;
      game.height = rect.height;
    };

    const onKey = (event, pressed) => {
      const key = event.key.toLowerCase();
      if (['arrowup', 'w'].includes(key)) controlsRef.current.up = pressed;
      if (['arrowdown', 's'].includes(key)) controlsRef.current.down = pressed;
      if (['arrowleft', 'a'].includes(key)) controlsRef.current.left = pressed;
      if (['arrowright', 'd'].includes(key)) controlsRef.current.right = pressed;
      if (key === ' ') controlsRef.current.shoot = pressed;
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' ', 'w', 'a', 's', 'd'].includes(key)) {
        event.preventDefault();
      }
    };

    const keydown = (event) => onKey(event, true);
    const keyup = (event) => onKey(event, false);

    window.addEventListener('resize', resize);
    window.addEventListener('keydown', keydown);
    window.addEventListener('keyup', keyup);
    resize();

    const drawPitch = () => {
      const { width, height } = game;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#123d2c';
      ctx.fillRect(0, 0, width, height);
      for (let i = 0; i < 8; i += 1) {
        ctx.fillStyle = i % 2 ? 'rgba(255,255,255,0.025)' : 'rgba(0,0,0,0.08)';
        ctx.fillRect((width / 8) * i, 0, width / 8, height);
      }
      ctx.strokeStyle = 'rgba(219,255,238,0.68)';
      ctx.lineWidth = 2;
      ctx.strokeRect(width * 0.04, height * 0.08, width * 0.92, height * 0.84);
      ctx.beginPath();
      ctx.moveTo(width * 0.5, height * 0.08);
      ctx.lineTo(width * 0.5, height * 0.92);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(width * 0.5, height * 0.5, Math.min(width, height) * 0.12, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeRect(width * 0.84, height * 0.34, width * 0.12, height * 0.32);
      ctx.fillStyle = 'rgba(71,233,255,0.16)';
      ctx.fillRect(width * 0.955, height * 0.39, width * 0.025, height * 0.22);
    };

    const drawDisc = (x, y, radius, fill, stroke = '#ffffff') => {
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = fill;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = stroke;
      ctx.stroke();
    };

    const loop = (time) => {
      const dt = Math.min((time - game.lastTime) / 1000, 0.033);
      game.lastTime = time;
      const c = controlsRef.current;
      const { width, height } = game;
      const player = game.player;
      const ball = game.ball;
      const speed = 0.62;
      const ax = (c.right ? 1 : 0) - (c.left ? 1 : 0);
      const ay = (c.down ? 1 : 0) - (c.up ? 1 : 0);
      const mag = Math.hypot(ax, ay) || 1;

      player.vx = (ax / mag) * speed;
      player.vy = (ay / mag) * speed;
      player.x = Math.min(0.94, Math.max(0.06, player.x + player.vx * dt));
      player.y = Math.min(0.88, Math.max(0.12, player.y + player.vy * dt));

      ball.x += ball.vx * dt;
      ball.y += ball.vy * dt;
      ball.vx *= 0.986;
      ball.vy *= 0.986;

      if (ball.y < 0.12 || ball.y > 0.88) ball.vy *= -0.78;
      if (ball.x < 0.06) ball.vx = Math.abs(ball.vx) * 0.78;
      ball.x = Math.min(0.98, Math.max(0.06, ball.x));
      ball.y = Math.min(0.88, Math.max(0.12, ball.y));

      const playerPx = { x: player.x * width, y: player.y * height };
      const ballPx = { x: ball.x * width, y: ball.y * height };
      const dist = Math.hypot(playerPx.x - ballPx.x, playerPx.y - ballPx.y);
      if (dist < 34) {
        const nx = (ballPx.x - playerPx.x) / (dist || 1);
        const ny = (ballPx.y - playerPx.y) / (dist || 1);
        const kickPower = c.shoot && time - game.lastKick > 280 ? 1.35 : 0.58;
        ball.vx += nx * kickPower;
        ball.vy += ny * kickPower;
        if (c.shoot) {
          game.lastKick = time;
          updateStatus('SHOT SENT');
        } else {
          updateStatus('BALL CONTACT');
        }
      }

      game.dummies.forEach((dummy) => {
        const y = dummy.y + Math.sin(time / 760 + dummy.phase) * 0.075;
        const dx = ball.x - dummy.x;
        const dy = ball.y - y;
        const dd = Math.hypot(dx * width, dy * height);
        if (dd < 31) {
          ball.vx += Math.sign(dx || 1) * 0.45;
          ball.vy += Math.sign(dy || 1) * 0.22;
          updateStatus('DEFLECTED');
        }
      });

      if (ball.x > 0.955 && ball.y > 0.39 && ball.y < 0.61) {
        game.score += 1;
        setScore(game.score);
        updateStatus('GOAL CONFIRMED');
        ball.x = 0.48;
        ball.y = 0.5;
        ball.vx = 0;
        ball.vy = 0;
        player.x = 0.24;
        player.y = 0.5;
      }

      drawPitch();
      game.dummies.forEach((dummy) => {
        drawDisc(dummy.x * width, (dummy.y + Math.sin(time / 760 + dummy.phase) * 0.075) * height, 16, '#ffbd4a', '#2a1602');
      });
      drawDisc(ball.x * width, ball.y * height, 12, '#eef8ff', '#071018');
      drawDisc(player.x * width, player.y * height, 19, '#47e9ff', '#031116');
      ctx.fillStyle = '#031116';
      ctx.fillRect(player.x * width - 2, player.y * height - 20, 4, 40);
      game.raf = window.requestAnimationFrame(loop);
    };

    game.raf = window.requestAnimationFrame(loop);

    return () => {
      window.cancelAnimationFrame(game.raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('keydown', keydown);
      window.removeEventListener('keyup', keyup);
    };
  }, []);

  const setControl = (name, pressed) => {
    controlsRef.current[name] = pressed;
  };

  const touchProps = (name) => ({
    onPointerDown: (event) => {
      event.currentTarget.setPointerCapture(event.pointerId);
      setControl(name, true);
    },
    onPointerUp: () => setControl(name, false),
    onPointerCancel: () => setControl(name, false),
    onPointerLeave: () => setControl(name, false),
  });

  return (
    <div className="game-column">
      <div className="crt-frame">
        <div className="game-hud">
          <span>PLAYABLE SHELL</span>
          <strong>{String(score).padStart(2, '0')}</strong>
          <span>{status}</span>
        </div>
        <canvas ref={canvasRef} className="football-canvas" aria-label="Mini juego de futbol abstracto" />
      </div>
      <div className="session-controls">
        <button className="reset-button" type="button" onClick={resetGame}>Reiniciar sesion</button>
        <div className="touch-controls" aria-label="Controles tactiles">
          <button type="button" {...touchProps('up')}>Arriba</button>
          <button type="button" {...touchProps('left')}>Izq</button>
          <button type="button" {...touchProps('down')}>Abajo</button>
          <button type="button" {...touchProps('right')}>Der</button>
          <button className="shoot-touch" type="button" {...touchProps('shoot')}>Chutar</button>
        </div>
      </div>
    </div>
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
