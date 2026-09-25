import React, { useState, useEffect } from 'react';
import { Configurator } from './components/Configurator';
import { DeveloperLogin } from './components/developer/DeveloperLogin';
import { DeveloperDashboard } from './components/developer/DeveloperDashboard';
import { devAuth } from './services/devAuth';

function getCanonicalRoute(): string {
  const hash = window.location.hash.replace(/^#\/?/, '/');
  if (hash.startsWith('/developer')) {
    return hash.split('?')[0];
  }
  const pathname = window.location.pathname;
  if (pathname.startsWith('/developer')) {
    return pathname.split('?')[0];
  }
  return '/';
}

export default function App() {
  const [route, setRoute] = useState<string>(getCanonicalRoute());

  useEffect(() => {
    const handleLocationChange = () => {
      setRoute(getCanonicalRoute());
    };
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigate = (to: string) => {
    try {
      window.history.pushState({}, '', to);
    } catch {
      window.location.hash = to;
    }
    setRoute(to);
  };

  // ROUTE: /developer (Protected Route)
  if (route === '/developer') {
    if (!devAuth.isAuthenticated()) {
      return (
        <DeveloperLogin
          onLoginSuccess={() => navigate('/developer')}
          onBackToConfigurator={() => navigate('/')}
        />
      );
    }
    return (
      <DeveloperDashboard
        onLogout={() => navigate('/developer/login')}
        onBackToConfigurator={() => navigate('/')}
      />
    );
  }

  // ROUTE: /developer/login
  if (route === '/developer/login') {
    if (devAuth.isAuthenticated()) {
      return (
        <DeveloperDashboard
          onLogout={() => navigate('/developer/login')}
          onBackToConfigurator={() => navigate('/')}
        />
      );
    }
    return (
      <DeveloperLogin
        onLoginSuccess={() => navigate('/developer')}
        onBackToConfigurator={() => navigate('/')}
      />
    );
  }

  // DEFAULT PUBLIC ROUTE: / (Jersey Configurator)
  return <Configurator onNavigateToDeveloper={() => navigate('/developer/login')} />;
}
