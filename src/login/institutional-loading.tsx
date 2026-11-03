import { useEffect, useState } from 'react';
import { BRAZIL_STATES, BRAZIL_VIEWBOX, OFFICE_CITIES, type OfficeCity } from './brazil-geography';

/** Only one scene is shown per successful Microsoft login. */
export const OFFICE_SWITCH_MS = 2000;
const LAST_SCENE = 3;
const NEXT_SCENE_KEY = 'mba-institutional-scene-next-v1';

/** Stored index is advanced only after the backend validates a new login. */
function readNextScene(): number {
  const current = (window as Window & { MBA_INSTITUTIONAL_LOGIN_SCENE?: number }).MBA_INSTITUTIONAL_LOGIN_SCENE;
  if (Number.isInteger(current) && current! >= 0 && current! <= LAST_SCENE) return current!;
  try {
    const stored = window.localStorage.getItem(NEXT_SCENE_KEY);
    const index = stored === null ? 0 : Number(stored);
    return Number.isInteger(index) && index >= 0 && index <= LAST_SCENE ? index : 0;
  } catch {
    return 0;
  }
}

function BrazilPresence({ city }: { city: OfficeCity }) {
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
  // Freeze one scene for the whole login attempt. Never cycle through four texts.
  const [scene] = useState(readNextScene);
  const [cityIndex, setCityIndex] = useState(0);

  useEffect(() => {
    if (!visible || scene !== 1) return;
    setCityIndex(0);
    const timer = window.setInterval(() => {
      setCityIndex(index => (index + 1) % OFFICE_CITIES.length);
    }, OFFICE_SWITCH_MS);
    return () => window.clearInterval(timer);
  }, [visible, scene]);

  const city = OFFICE_CITIES[cityIndex];

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
                <div className="mba-storyboard-presence-meta">
                  <div className="mba-storyboard-presence-stat"><strong>06</strong><span>localidades no Brasil</span></div>
                  <div className="mba-storyboard-location-label" aria-live="off">
                    <span>{city.kind} · {city.uf}</span>
                    <strong>{city.name}</strong>
                    <small>{city.region}</small>
                  </div>
                  <div className="mba-storyboard-offices" aria-label="Localidades">
                    {OFFICE_CITIES.map(office => (
                      <span key={office.id} className={'mba-storyboard-office' + (office.id === city.id ? ' is-selected' : '')}>
                        {office.name}<small>{office.uf}</small>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <BrazilPresence city={city} />
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
