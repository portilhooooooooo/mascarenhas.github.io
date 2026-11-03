import { useEffect, useState } from 'react';
import { BRAZIL_STATES, BRAZIL_VIEWBOX, OFFICE_CITIES } from './brazil-geography';

/** Each scene is long enough to read while Microsoft OAuth completes. */
export const STORYBOARD_SCENE_MS = 2300;
const LAST_SCENE = 3;

function BrazilPresence({ active }: { active: boolean }) {
  const [cityIndex, setCityIndex] = useState(0);

  useEffect(() => {
    if (!active) {
      setCityIndex(0);
      return;
    }
    // Automatically visit all six locations: this is a loading experience, not a map dashboard.
    const ticker = window.setInterval(() => {
      setCityIndex(index => (index + 1) % OFFICE_CITIES.length);
    }, 420);
    return () => window.clearInterval(ticker);
  }, [active]);

  const city = OFFICE_CITIES[cityIndex];

  return (
    <div className="mba-storyboard-map-layout">
      <div className="mba-storyboard-map-frame">
        <svg viewBox={BRAZIL_VIEWBOX} className="mba-storyboard-brazil-svg"
          role="img" aria-label="Mapa do Brasil com os estados e seis localidades do escritório">
          <g className="mba-storyboard-states">
            {BRAZIL_STATES.map(state => (
              <path key={state.uf} d={state.path}
                className={[
                  'mba-storyboard-state',
                  OFFICE_CITIES.some(office => office.uf === state.uf) ? 'has-office' : '',
                  state.uf === city.uf ? 'is-selected' : '',
                ].filter(Boolean).join(' ')} />
            ))}
          </g>
          <g className="mba-storyboard-location-markers">
            {OFFICE_CITIES.map(office => (
              <g key={office.id} className={'mba-storyboard-location' + (office.id === city.id ? ' is-selected' : '')}>
                <circle className="mba-storyboard-marker-halo" cx={office.x} cy={office.y} r="9" />
                <circle className="mba-storyboard-marker-center" cx={office.x} cy={office.y} r="4.2" />
              </g>
            ))}
          </g>
        </svg>
        <div className="mba-storyboard-location-label" aria-hidden="true">
          <span>{city.kind} · {city.uf}</span>
          <strong>{city.name}</strong>
          <small>{city.region}</small>
        </div>
      </div>
      <div className="mba-storyboard-offices" aria-label="Localidades">
        {OFFICE_CITIES.map(office => (
          <span key={office.id} className={'mba-storyboard-office' + (office.id === city.id ? ' is-selected' : '')}>
            {office.name}<small>{office.uf}</small>
          </span>
        ))}
      </div>
    </div>
  );
}

function ProcessJourney() {
  return (
    <div className="mba-storyboard-journey">
      {[
        { title: 'Cadastro', description: 'Organização e identificação' },
        { title: 'Operação', description: 'Execução e acompanhamento' },
        { title: 'Jurimetria', description: 'Análise e indicadores' },
        { title: 'Encerramentos', description: 'Consolidação dos resultados' },
      ].map((step, index) => (
        <div key={step.title} className="mba-storyboard-journey-step" style={{ animationDelay: `${index * 150}ms` }}>
          <span className="mba-storyboard-journey-node" aria-hidden="true" />
          <div>
            <strong>{step.title}</strong>
            <small>{step.description}</small>
          </div>
        </div>
      ))}
    </div>
  );
}

export function InstitutionalLoading({ visible }: { visible: boolean }) {
  const [scene, setScene] = useState(0);

  useEffect(() => {
    if (!visible) {
      setScene(0);
      return;
    }
    setScene(0);
    let next = 0;
    const interval = window.setInterval(() => {
      next = Math.min(next + 1, LAST_SCENE);
      setScene(next);
      // Hold the final message until the login is actually ready.
      if (next === LAST_SCENE) window.clearInterval(interval);
    }, STORYBOARD_SCENE_MS);
    return () => window.clearInterval(interval);
  }, [visible]);

  return (
    <div className={'mba-auth-transition' + (visible ? ' is-visible' : '')}
      role="status" aria-live="polite" aria-hidden={!visible}
      data-testid="auth-transition" data-storyboard-scene={scene}>
      <div className="mba-storyboard">
        <header className="mba-storyboard-header" aria-label="Mascarenhas Barbosa Backoffice">
          <div className="mba-storyboard-brand">
            <strong>Mascarenhas Barbosa</strong>
            <small>BACKOFFICE</small>
          </div>
        </header>

        <main className="mba-storyboard-main">
          {scene === 0 && (
            <section className="mba-storyboard-slide mba-storyboard-history" aria-label="História">
              <div className="mba-storyboard-copy">
                <h1>58 anos de trajetória.</h1>
                <p>Fundado em 1968, em Campo Grande. Uma história que continua evoluindo.</p>
              </div>
              <div className="mba-storyboard-history-visual" aria-hidden="true">
                <div className="mba-storyboard-year">1968</div>
                <div className="mba-storyboard-history-line"><span /></div>
                <div className="mba-storyboard-history-years"><span>1968</span><span>2026</span></div>
              </div>
            </section>
          )}

          {scene === 1 && (
            <section className="mba-storyboard-slide mba-storyboard-presence" aria-label="Presença nacional">
              <div className="mba-storyboard-copy">
                <h1>Presença nacional.</h1>
                <p>Estamos distribuídos em diferentes regiões do Brasil.</p>
                <div className="mba-storyboard-presence-stat"><strong>06</strong><span>localidades no Brasil</span></div>
              </div>
              <BrazilPresence active={visible} />
            </section>
          )}

          {scene === 2 && (
            <section className="mba-storyboard-slide mba-storyboard-scale" aria-label="Mascarenhas Backoffice">
              <div className="mba-storyboard-copy">
                <div className="mba-storyboard-scale-number">60.000<span>+</span></div>
                <h1>processos na plataforma Mascarenhas Backoffice.</h1>
                <p>Do cadastro à jurimetria e ao encerramento, conectamos a operação ponta a ponta.</p>
              </div>
              <ProcessJourney />
            </section>
          )}

          {scene === 3 && (
            <section className="mba-storyboard-slide mba-storyboard-vision" aria-label="Visão">
              <h1>Ideias que se transformam em <em>produtos.</em></h1>
              <p>Produtos que impactam dezenas de milhares de processos.</p>
            </section>
          )}
        </main>

        <footer className="mba-storyboard-footer">
          <div className="mba-auth-loading-dots" aria-hidden="true"><span/><span/><span/></div>
          <p>Preparando seu espaço…</p>
        </footer>
      </div>
    </div>
  );
}
