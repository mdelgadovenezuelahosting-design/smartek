// Verificar que React esté cargado
console.log('React disponible:', typeof React !== 'undefined');
console.log('ReactDOM disponible:', typeof ReactDOM !== 'undefined');

// Función para verificar si las funciones de BD están disponibles
const checkDatabaseFunctions = () => {
  const functions = [
    'initializeDatabase',
    'getClients', 
    'getProducts',
    'getInvoices',
    'createClient',
    'updateClient',
    'deleteClient',
    'createProduct',
    'updateProduct', 
    'deleteProduct',
    'createInvoice',
    'updateInvoiceStatus',
    'deleteInvoice'
  ];
  
  const availableFunctions = {};
  
  functions.forEach(func => {
    availableFunctions[func] = typeof window[func] === 'function';
  });
  
  console.log('Funciones de BD disponibles:', availableFunctions);
  return availableFunctions;
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Algo salió mal</h1>
            <p className="text-gray-600 mb-4">Lo sentimos, ocurrió un error inesperado.</p>
            <pre className="text-xs text-left bg-red-100 p-4 rounded mb-4">
              {this.state.error?.toString()}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-primary"
            >
              Recargar Página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  console.log('App component rendering');
  
  try {
    const [currentView, setCurrentView] = React.useState('dashboard');
    const [clients, setClients] = React.useState([]);
    const [products, setProducts] = React.useState([]);
    const [invoices, setInvoices] = React.useState([]);
    const [exchangeRate, setExchangeRate] = React.useState(null);
    const [lastUpdate, setLastUpdate] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [dbFunctionsAvailable, setDbFunctionsAvailable] = React.useState(false);

    React.useEffect(() => {
      console.log('App useEffect triggered');
      // Verificar funciones de BD al cargar
      const dbStatus = checkDatabaseFunctions();
      setDbFunctionsAvailable(dbStatus.initializeDatabase);
      initApp();
    }, []);

    const initApp = async () => {
      try {
        console.log('Initializing app...');
        setLoading(true);
        setError(null);
        
        // Inicializar base de datos MariaDB si las funciones están disponibles
        if (typeof initializeDatabase === 'function') {
          await initializeDatabase();
          console.log('Database initialized successfully');
        } else {
          console.warn('Funciones de base de datos no disponibles - modo offline');
        }
        
        // Cargar datos
        await loadData();
        
        // Inicializar servicio de divisas si está disponible
        if (window.currencyService && typeof window.currencyService.startAutoUpdate === 'function') {
          await initializeCurrencyService();
        }
        
      } catch (error) {
        console.error('Error inicializando aplicación:', error);
        setError('Error al iniciar la aplicación: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    const initializeCurrencyService = async () => {
      try {
        window.currencyService.startAutoUpdate();
        const rate = await window.currencyService.getExchangeRate();
        setExchangeRate(rate);
        setLastUpdate(window.currencyService.getLastUpdateTime());
        
        // Actualizar cada 30 minutos
        const interval = setInterval(async () => {
          try {
            const newRate = await window.currencyService.getExchangeRate();
            setExchangeRate(newRate);
            setLastUpdate(window.currencyService.getLastUpdateTime());
          } catch (error) {
            console.error('Error actualizando tasa de cambio:', error);
          }
        }, 30 * 60 * 1000);
        
        return () => clearInterval(interval);
      } catch (error) {
        console.error('Error initializing currency service:', error);
      }
    };

    const loadData = async () => {
      try {
        console.log('Loading data from database...');
        
        let clientsData = [];
        let productsData = [];
        let invoicesData = [];
        
        // Cargar datos usando las funciones globales si están disponibles
        if (typeof getClients === 'function') {
          clientsData = await getClients();
        } else {
          console.warn('getClients no disponible');
        }
        
        if (typeof getProducts === 'function') {
          productsData = await getProducts();
        } else {
          console.warn('getProducts no disponible');
        }
        
        if (typeof getInvoices === 'function') {
          invoicesData = await getInvoices();
        } else {
          console.warn('getInvoices no disponible');
        }
        
        console.log('Data loaded:', {
          clients: clientsData.length,
          products: productsData.length,
          invoices: invoicesData.length
        });
        
        setClients(clientsData);
        setProducts(productsData);
        setInvoices(invoicesData);
        
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Error cargando datos: ' + error.message);
        // Mantener arrays vacíos en caso de error
        setClients([]);
        setProducts([]);
        setInvoices([]);
      }
    };

    const refreshData = () => {
      loadData().catch(error => {
        console.error('Error refreshing data:', error);
      });
    };

    const renderCurrentView = () => {
      if (loading) {
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="icon-loader animate-spin text-4xl text-blue-600 mb-4"></div>
              <p className="text-gray-600">Cargando aplicación...</p>
              {!dbFunctionsAvailable && (
                <p className="text-sm text-orange-600 mt-2">
                  Funciones de base de datos no disponibles
                </p>
              )}
            </div>
          </div>
        );
      }

      if (error) {
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="icon-alert-triangle text-4xl text-red-600 mb-4"></div>
              <p className="text-red-600 mb-2">Error:</p>
              <p className="text-sm text-gray-600 mb-4">{error}</p>
              <button
                onClick={initApp}
                className="btn btn-primary mr-2"
              >
                Reintentar
              </button>
              <button
                onClick={() => setError(null)}
                className="btn btn-secondary"
              >
                Continuar sin datos
              </button>
            </div>
          </div>
        );
      }

      switch (currentView) {
        case 'dashboard':
          return <Dashboard clients={clients} products={products} invoices={invoices} />;
        case 'clients':
          return <ClientManager clients={clients} onRefresh={refreshData} />;
        case 'products':
          return <ProductManager products={products} onRefresh={refreshData} />;
        case 'invoices':
          return <InvoiceManager invoices={invoices} clients={clients} products={products} onRefresh={refreshData} />;
        case 'new-invoice':
          return <InvoiceForm clients={clients} products={products} onSave={refreshData} onCancel={() => setCurrentView('invoices')} />;
        case 'converter':
          return <CurrencyConverter exchangeRate={exchangeRate} lastUpdate={lastUpdate} />;
        default:
          return <Dashboard clients={clients} products={products} invoices={invoices} />;
      }
    };

    return (
      <div className="min-h-screen bg-gray-50 flex" data-name="app" data-file="app.js">
        <Sidebar currentView={currentView} onViewChange={setCurrentView} />
        <div className="flex-1 flex flex-col">
          <Header currentView={currentView} />
          <main className="flex-1 p-6">
            {renderCurrentView()}
          </main>
        </div>
      </div>
    );
  } catch (error) {
    console.error('App component error:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error en el componente App</h1>
          <pre className="text-xs text-left bg-red-100 p-4 rounded mb-4">
            {error.toString()}
          </pre>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary"
          >
            Recargar Página
          </button>
        </div>
      </div>
    );
  }
}

// ELIMINAR LA VERIFICACIÓN DE AUTENTICACIÓN DUPLICADA
// La verificación ya se hace en index.html

// Componente principal SIMPLIFICADO
function MainApp() {
  // Ya estamos autenticados (verificado en index.html), solo renderizar la app
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}

// Renderizar la aplicación
try {
  console.log('Attempting to render app...');
  
  // Verificar funciones globales antes de renderizar
  console.log('Checking global functions...');
  console.log('initializeDatabase:', typeof initializeDatabase);
  console.log('getClients:', typeof getClients);
  console.log('getProducts:', typeof getProducts);
  console.log('getInvoices:', typeof getInvoices);
  
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<MainApp />);
  console.log('App rendered successfully');
} catch (renderError) {
  console.error('Error rendering app:', renderError);
  document.getElementById('root').innerHTML = `
    <div class="min-h-screen flex items-center justify-center bg-red-50">
      <div class="text-center">
        <h1 class="text-2xl font-bold text-red-900 mb-4">Error al cargar la aplicación</h1>
        <p class="text-red-700 mb-4">Por favor, recarga la página o contacta al administrador.</p>
        <button onclick="window.location.reload()" class="btn btn-primary">
          Recargar Página
        </button>
      </div>
    </div>
  `;
}
