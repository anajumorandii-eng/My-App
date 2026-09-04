import React, { useCallback, useEffect, useState } from 'react';
import { CalendarEvent, DriveFile } from '../types';
import { Link2, Unlink, Calendar as CalendarIcon, Clock, AlertTriangle, FileText } from 'lucide-react';
import { initAuth, googleSignIn, authHeaders } from '../lib/auth';
import {
  describeGoogleCallback,
  disconnectGoogle,
  getGoogleConnectionStatus,
  startGoogleConnection,
} from '../lib/googleConnection';
import { isoToLocalDate } from '../features/availability/time';
import { Panel } from '../components/ui/Panel';
import { PALETTES } from '../prototypes/NucleoInstrumentalPrototype';

export default function Conexoes() {
  // Dois estados diferentes, que antes viviam colapsados num só: estar logada
  // no app (Firebase) e ter autorizado o app a ler a agenda e o Drive. A
  // segunda agora mora no servidor e sobrevive à recarga da página.
  const [signedIn, setSignedIn] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadGoogleData = useCallback(async () => {
    setLoading(true);
    try {
      const headers = await authHeaders();
      const localDate = isoToLocalDate(new Date().toISOString());
      const [eventsRes, filesRes] = await Promise.all([
        fetch(`/api/calendar/events?date=${encodeURIComponent(localDate)}`, { headers }),
        fetch('/api/drive/files', { headers }),
      ]);

      // 409 = a autorização do Google não existe mais (revogada na conta dela,
      // por exemplo). É reconexão, não erro de rede.
      if (eventsRes.status === 409 || filesRes.status === 409) {
        setIsConnected(false);
        setEvents([]);
        setFiles([]);
        return;
      }

      setEvents(eventsRes.ok ? (await eventsRes.json()).events ?? [] : []);
      setFiles(filesRes.ok ? (await filesRes.json()).files ?? [] : []);
    } catch (e) {
      console.error(e);
      setError('Não foi possível carregar seus dados do Google. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshConnection = useCallback(async () => {
    try {
      const status = await getGoogleConnectionStatus();
      setIsConnected(status.connected);
      if (status.connected) {
        await loadGoogleData();
      } else {
        setEvents([]);
        setFiles([]);
        setLoading(false);
      }
    } catch (e) {
      console.error(e);
      setIsConnected(false);
      setLoading(false);
    }
  }, [loadGoogleData]);

  // O callback do Google devolve a aluna pra cá com ?google=... dizendo como
  // a autorização terminou.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const outcome = params.get('google');
    if (!outcome) return;
    const message = describeGoogleCallback(outcome);
    if (message) setError(message);
    window.history.replaceState({}, '', window.location.pathname);
  }, []);

  useEffect(() => {
    const unsubscribe = initAuth(
      () => {
        setError(null);
        setSignedIn(true);
        void refreshConnection();
      },
      (message) => {
        setSignedIn(false);
        setIsConnected(false);
        setLoading(false);
        setEvents([]);
        setFiles([]);
        if (message) setError(message);
      }
    );

    return () => unsubscribe();
  }, [refreshConnection]);

  const handleConnect = async () => {
    setError(null);
    try {
      if (!signedIn) {
        const user = await googleSignIn();
        // null = o login caiu no fluxo de redirect e a página já está saindo.
        if (!user) return;
        setSignedIn(true);
      }
      // Sai da página rumo ao consentimento do Google e volta pelo callback.
      await startGoogleConnection('/conexoes');
    } catch (err: any) {
      console.error('Failed to connect Google', err);
      setError(err?.message || 'Não foi possível conectar sua conta Google. Tente novamente.');
    }
  };

  const handleDisconnect = async () => {
    setError(null);
    try {
      await disconnectGoogle();
      setIsConnected(false);
      setEvents([]);
      setFiles([]);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Não foi possível desconectar sua conta Google.');
    }
  };

  const currentPalette = PALETTES.Filosofia;

  return (
    <div
      className="ni-main"
      style={{
        '--primary': currentPalette.primary,
        '--secondary': currentPalette.secondary,
        '--wash': currentPalette.wash,
      } as React.CSSProperties}
    >
      {/* Route Breadcrumb */}
      <div className="ni-route">
        <span>FERRAMENTAS</span>
        <i />
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
          <span className="w-5 h-5 flex items-center justify-center rounded-full bg-[var(--primary)] text-[var(--wash)]">
            <Link2 className="w-3 h-3" />
          </span>
          INTEGRAÇÃO
        </span>
        <i />
        <b>CONEXÕES GOOGLE</b>
      </div>

      {/* Main Title */}
      <div className="ni-title">
        <div>
          <h1>Sincronize agenda e materiais de estudo.</h1>
          <p>Integração com Google Calendar e Google Drive para calibrar sua disponibilidade e arquivos.</p>
        </div>
        <div className="ni-state">
          <i /> {isConnected ? 'Sincronizado' : 'Não conectado'}
        </div>
      </div>

      {error && (
        <div className="flex items-start p-3.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 text-xs">
          <AlertTriangle className="w-4 h-4 mr-2.5 shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {/* Main Connection Panel */}
      <Panel subject="Filosofia" className="ni-panel p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-[var(--line)]">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: 'var(--primary)', color: 'var(--wash)' }}
            >
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-medium text-sm text-[var(--text)]">Google Calendar & Drive</h2>
              <p className="text-[11px] text-[var(--dim)] font-mono">
                {isConnected ? 'Conta Google ativa e sincronizada' : 'Conta não conectada'}
              </p>
            </div>
          </div>

          {isConnected ? (
            <button
              onClick={handleDisconnect}
              className="flex items-center px-3 py-1.5 border border-[var(--line)] rounded-lg text-xs font-semibold text-[var(--dim)] hover:text-rose-400 transition-colors"
            >
              <Unlink className="w-3.5 h-3.5 mr-1.5" />
              Desconectar
            </button>
          ) : (
            <button
              onClick={handleConnect}
              className="flex items-center px-3.5 py-1.5 bg-[var(--primary)] text-[var(--wash)] rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              <Link2 className="w-3.5 h-3.5 mr-1.5" />
              Conectar com Google
            </button>
          )}
        </div>

        {loading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-[var(--surface2)] rounded w-1/2"></div>
            <div className="h-4 bg-[var(--surface2)] rounded w-3/4"></div>
          </div>
        ) : isConnected ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Calendar Events */}
            <div className="space-y-3">
              <h3 className="font-display font-medium text-xs text-[var(--text)] flex items-center gap-1.5">
                <CalendarIcon className="w-3.5 h-3.5 text-[var(--dim)]" />
                Próximos Compromissos
              </h3>
              {events.length > 0 ? (
                <div className="space-y-2">
                  {events.map((event) => {
                    const startTime = event.start.dateTime ? new Date(event.start.dateTime) : event.start.date ? new Date(event.start.date) : null;
                    return (
                      <div key={event.id} className="p-3 rounded-xl border border-[var(--line)] bg-[var(--surface2)] text-xs flex items-start gap-2.5">
                        <Clock className="w-3.5 h-3.5 text-[var(--primary)] mt-0.5 shrink-0" />
                        <div>
                          <p className="font-medium text-[var(--text)]">{event.summary}</p>
                          {startTime && (
                            <p className="text-[11px] text-[var(--dim)] mt-0.5">
                              {startTime.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-[var(--dim)]">Nenhum evento futuro na agenda.</p>
              )}
            </div>

            {/* Drive Files */}
            <div className="space-y-3">
              <h3 className="font-display font-medium text-xs text-[var(--text)] flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[var(--dim)]" />
                Materiais Recentes (Drive)
              </h3>
              {files.length > 0 ? (
                <div className="space-y-2">
                  {files.map((file) => (
                    <a
                      key={file.id}
                      href={file.webViewLink}
                      target="_blank"
                      rel="noreferrer"
                      className="p-3 rounded-xl border border-[var(--line)] bg-[var(--surface2)] text-xs flex items-start gap-2.5 hover:border-[var(--primary)] transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5 text-[var(--primary)] mt-0.5 shrink-0" />
                      <div className="min-w-0">
                        <p className="font-medium text-[var(--text)] truncate">{file.name}</p>
                        <p className="text-[11px] text-[var(--dim)] mt-0.5">Abrir no Google Drive</p>
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[var(--dim)]">Nenhum arquivo recente localizado no Drive.</p>
              )}
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl border border-[var(--line)] bg-[var(--surface2)] text-xs text-[var(--dim)] leading-relaxed">
            Conectar seu Google Calendar e Drive permite sincronizar blocos livres na agenda para o Plano de Estudos e manter seus resumos e documentos ao alcance em um clique.
          </div>
        )}
      </Panel>
    </div>
  );
}
