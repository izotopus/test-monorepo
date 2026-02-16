import { h, ComponentProps } from 'preact';
import { LocationProvider, Router, Route } from 'preact-iso';
import { useEffect, useState } from 'preact/hooks';

import RegisterFormComponent from './adapters/RegisterForm';

import Alpine from 'alpinejs';

type HandleFormChangeFn = ComponentProps<typeof RegisterFormComponent>['handleFormChange'];

if (typeof window !== 'undefined' && !(window as any).Alpine) {
  (window as any).Alpine = Alpine;
  Alpine.start();
}

const Stats = () => (
  <div class="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
    <h2 class="text-xl font-bold mb-4 text-blue-700">📊 Statystyki Systemu</h2>
    <div class="grid grid-cols-2 gap-4">
      <div class="p-4 bg-blue-50 rounded">Aktywne sesje: 124</div>
      <div class="p-4 bg-green-50 rounded">Uptime: 99.9%</div>
    </div>
  </div>
);

const RegisterForm = () => {
  const [formData, setFormData] = useState({});

  const handleFormChange: HandleFormChangeFn = (formData) => {
    setFormData(formData);
    console.log('Dane z formularza w Preact:', formData);
  };

  return (
    <div class="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <h2 class="text-xl font-bold mb-4 text-blue-700">⚙️ Formularz jako webcomponent spoza preact</h2>
      <p class="text-gray-600">Jest w pełni zintegrowany z Preact.</p>


    <div class="mt-8 grid lg:grid-cols-2 gap-8 items-start">
      
      <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <RegisterFormComponent 
          handleFormChange={handleFormChange} 
        />
      </div>

      <pre class="h-full bg-white p-6 rounded-xl overflow-x-auto border border-slate-200 shadow-sm font-mono text-sm leading-relaxed">
<code class="text-slate-700">{JSON.stringify(formData, null, 2)}</code></pre>
    </div>
    </div>
  )
};

const NotFound = () => (
  <div class="p-6 text-center">
    <h2 class="text-2xl font-bold text-red-500">404</h2>
    <p>Nie znaleziono takiej sekcji w Dashboardzie.</p>
  </div>
);

export const App = () => {

  const [currentPath, setCurrentPath] = useState(
    typeof window !== 'undefined' ? window.location.hash.replace('#', '') || '/' : '/'
  );

  const HashHandler = () => {
    const [hash, setHash] = useState(typeof window !== 'undefined' ? window.location.hash : '');

    useEffect(() => {
      const handleHashChange = () => setHash(window.location.hash);
      window.addEventListener('hashchange', handleHashChange);
      return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    if (hash === '#/register-form') return <RegisterForm />;
    return <Stats />;
  };

  const navigate = (to: string) => (e: MouseEvent) => {
    setCurrentPath(to)
    e.preventDefault();
    window.location.hash = to;
  };

  return (
    <LocationProvider>
      <div class="flex flex-col h-full bg-gray-50 text-slate-800 font-sans">
        
        <nav class="flex items-center gap-2 p-4 border-b bg-white/80 backdrop-blur-md sticky top-0 z-10">
          <button 
            onClick={navigate('/')}
            class={`px-4 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer ${
              currentPath === '/' ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Statystyki
          </button>
          <button 
            onClick={navigate('/register-form')}
            class={`px-4 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer ${
              currentPath === '/register-form' ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Formularze rejestracyjny
          </button>
        </nav>

        <main class="flex-1 p-4">
          <Router>
            {/* <Route path="#/" component={Stats} />
            <Route path="#/settings" component={UserSettings} />
            <Route default component={NotFound} /> */}
            <Route path="/:rest*" component={HashHandler} />
            <Route default component={NotFound} />
          </Router>
        </main>

        <footer class="p-2 text-[10px] text-gray-400 text-right uppercase tracking-widest">
          Micro-frontend Instance
        </footer>
      </div>
    </LocationProvider>
  );
};