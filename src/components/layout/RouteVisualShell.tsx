import type { ReactNode } from 'react';
import { routeVisualFor } from '../../design-system/routeVisuals';
import { SubjectAtmosphere } from '../../features/daily-plan/components/SubjectAtmosphere';

interface RouteVisualShellProps {
  pathname: string;
  children: ReactNode;
}

/**
 * Production shell shared by all non-immersive screens. It deliberately owns
 * only the ambient field and route metadata; the individual view keeps
 * ownership of its information architecture and data states.
 */
export function RouteVisualShell({ pathname, children }: RouteVisualShellProps) {
  const visual = routeVisualFor(pathname);

  // Dashboard has its own data-driven atmosphere, which changes with the
  // recommendation. A second wrapper would paint two competing fields.
  if (pathname === '/') return <>{children}</>;

  return (
    <SubjectAtmosphere subject={visual.subject} className="crivo-route-shell">
      <div data-crivo-route={pathname} data-crivo-route-kind={visual.kind} className="min-h-full">
        {children}
      </div>
    </SubjectAtmosphere>
  );
}
