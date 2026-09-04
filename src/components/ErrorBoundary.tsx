import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { Button } from './ui/Button';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  /**
   * Nome da tela, usado só na mensagem. Sem ele a mensagem fala do app
   * inteiro, que é o certo pro boundary da raiz.
   */
  scope?: string;
  /**
   * Muda quando a rota muda: um boundary que já falhou continua mostrando o
   * erro pra sempre, mesmo depois de navegar pra uma tela que funciona, a
   * menos que alguma coisa o faça voltar ao estado normal.
   */
  resetKey?: string;
}

interface ErrorBoundaryState {
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    if (this.state.error && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ error: null });
    }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Render error', { scope: this.props.scope ?? 'app', error, info });
  }

  private handleRetry = () => {
    this.setState({ error: null });
  };

  render() {
    if (!this.state.error) return this.props.children;

    const { scope } = this.props;
    return (
      <div
        role="alert"
        className="flex min-h-[60vh] items-center justify-center p-6"
      >
        <div className="max-w-md text-center">
          <AlertTriangle className="mx-auto mb-4 h-8 w-8 text-text-muted" aria-hidden="true" />
          <h1 className="text-lg font-semibold text-text-primary">
            {scope ? `Algo quebrou em ${scope}` : 'Algo quebrou nesta tela'}
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            O erro foi registrado. Seus dados salvos não foram afetados — você pode tentar
            de novo ou ir para outra parte do app pelo menu.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button onClick={this.handleRetry}>
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Tentar de novo
            </Button>
            <Button variant="secondary" onClick={() => window.location.assign('/')}>
              Voltar ao início
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
