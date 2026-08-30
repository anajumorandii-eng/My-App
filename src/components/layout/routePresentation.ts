export interface RoutePresentation {
  immersive: boolean;
  mainClassName: string;
  contentClassName: string;
}

export function routePresentationFor(pathname: string): RoutePresentation {
  return pathname === '/'
    ? { immersive: true, mainClassName: 'bg-transparent', contentClassName: 'min-h-full max-w-none p-0' }
    : { immersive: false, mainClassName: 'bg-background-base', contentClassName: 'mx-auto max-w-6xl p-4 sm:p-8' };
}
