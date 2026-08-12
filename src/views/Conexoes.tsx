import React, { useEffect, useState } from 'react';
import { CalendarEvent, DriveFile } from '../types';
import { Link2, Unlink, Calendar as CalendarIcon, Clock, AlertTriangle, FileText } from 'lucide-react';
import { initAuth, googleSignIn, logout, getAccessToken, getAuthDebugInfo } from '../lib/auth';

export default function Conexoes() {
  const [isConnected, setIsConnected] = useState(false);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<{ label: string; info: ReturnType<typeof getAuthDebugInfo> }[]>([]);

  useEffect(() => {
    setDebugInfo((prev) => [...prev, { label: 'no carregamento (imediato)', info: getAuthDebugInfo() }]);
    const t1 = setTimeout(() => {
      setDebugInfo((prev) => [...prev, { label: 'após 1.5s', info: getAuthDebugInfo() }]);
    }, 1500);
    const t2 = setTimeout(() => {
      setDebugInfo((prev) => [...prev, { label: 'após 4s', info: getAuthDebugInfo() }]);
    }, 4000);

    const unsubscribe = initAuth(
      (user, token) => {
        setError(null);
        setIsConnected(true);
        fetchEvents(token);
        fetchFiles(token);
      },
      (message) => {
        setIsConnected(false);
        setLoading(false);
        setEvents([]);
        setFiles([]);
        if (message) setError(message);
      }
    );

    return () => {
      unsubscribe();
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const fetchEvents = async (token: string) => {
    try {
      const res = await fetch('/api/calendar/events', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setEvents(data.events || []);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchFiles = async (token: string) => {
    try {
      const res = await fetch('/api/drive/files', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setFiles(data.files || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    setError(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setIsConnected(true);
        setLoading(true);
        await fetchEvents(result.accessToken);
        await fetchFiles(result.accessToken);
      }
      // result === null means we were redirected away to a full-page
      // Google sign-in (popup fallback); the outcome arrives via initAuth
      // when the app reloads after the redirect.
    } catch (err: any) {
      console.error('Failed to sign in', err);
      setError(err?.message || 'Não foi possível conectar sua conta Google. Tente novamente.');
    }
  };

  const handleDisconnect = async () => {
    try {
      await logout();
      setIsConnected(false);
      setEvents([]);
      setFiles([]);
      setError(null);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Conexões Google</h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Sincronize sua agenda e seus materiais de estudo (Google Drive) para acesso rápido.
        </p>
      </header>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-sm">
        {error && (
          <div className="flex items-start p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 mb-8">
            <AlertTriangle className="w-5 h-5 mr-3 shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-8 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex flex-col space-y-4 sm:mb-0">
            <div className="flex items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${isConnected ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800'}`}>
                <CalendarIcon className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Google Calendar & Drive</h2>
                <p className="text-zinc-500 text-sm mt-1">
                  {isConnected ? 'Sincronizado ativamente' : 'Não conectado'}
                </p>
              </div>
            </div>
          </div>
          
          {isConnected ? (
            <button 
              onClick={handleDisconnect}
              className="flex items-center px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              <Unlink className="w-4 h-4 mr-2" />
              Desconectar
            </button>
          ) : (
            <button 
              onClick={handleConnect}
              className="flex items-center px-4 py-2 bg-white dark:bg-[#131314] text-zinc-600 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700 rounded shadow-sm hover:bg-zinc-50 dark:hover:bg-[#1e1e1e] transition-colors font-medium"
            >
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5 mr-3">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                <path fill="none" d="M0 0h48v48H0z"></path>
              </svg>
              Conectar com Google
            </button>
          )}
        </div>

        {loading ? (
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        ) : isConnected ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-lg mb-4 flex items-center">
                <CalendarIcon className="w-5 h-5 mr-2 text-zinc-400" />
                Próximos Compromissos
              </h3>
              {events.length > 0 ? (
                <div className="space-y-3">
                  {events.map((event) => {
                    const startTime = event.start.dateTime ? new Date(event.start.dateTime) : event.start.date ? new Date(event.start.date) : null;
                    
                    return (
                      <div key={event.id} className="flex items-start p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
                        <Clock className="w-5 h-5 text-indigo-500 mr-4 mt-0.5 shrink-0" />
                        <div>
                          <p className="font-medium text-zinc-900 dark:text-zinc-100 leading-snug">{event.summary}</p>
                          {startTime && (
                            <p className="text-sm text-zinc-500 mt-1">
                              {startTime.toLocaleString('pt-BR', { dateStyle: 'full', timeStyle: 'short' })}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-zinc-500 text-sm">Nenhum evento encontrado na agenda.</p>
              )}
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-zinc-400" />
                Materiais Recentes (Drive)
              </h3>
              {files.length > 0 ? (
                <div className="space-y-3">
                  {files.map((file) => (
                    <a 
                      key={file.id} 
                      href={file.webViewLink}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-start p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors"
                    >
                      {file.iconLink ? (
                        <img src={file.iconLink} alt="" className="w-5 h-5 mr-4 mt-0.5 shrink-0" />
                      ) : (
                        <FileText className="w-5 h-5 text-indigo-500 mr-4 mt-0.5 shrink-0" />
                      )}
                      <div>
                        <p className="font-medium text-zinc-900 dark:text-zinc-100 leading-snug truncate max-w-[200px] sm:max-w-xs">{file.name}</p>
                        <p className="text-xs text-zinc-500 mt-1 truncate">Abrir no Drive</p>
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-zinc-500 text-sm">Nenhum arquivo recente encontrado.</p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-start p-4 rounded-xl bg-orange-50 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300">
            <AlertTriangle className="w-5 h-5 mr-3 shrink-0" />
            <p className="text-sm">
              Conectar seu Google Calendar e Drive permite que o sistema ajuste o volume de estudos baseado no seu tempo livre e forneça acesso rápido aos seus resumos e materiais de estudo.
            </p>
          </div>
        )}
      </div>

      <div className="bg-zinc-950 text-zinc-300 rounded-2xl p-6 text-xs font-mono overflow-x-auto">
        <p className="text-zinc-500 mb-3">Diagnóstico temporário (remover depois de resolver)</p>
        {debugInfo.map(({ label, info }, i) => (
          <div key={i} className="mb-4">
            <p className="text-indigo-400 mb-1">— {label} —</p>
            <pre className="whitespace-pre-wrap break-all">{JSON.stringify(info, null, 2)}</pre>
          </div>
        ))}
      </div>
    </div>
  );
}
