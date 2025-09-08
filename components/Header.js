function Header({ currentView }) {
  try {
    const [showUserMenu, setShowUserMenu] = React.useState(false);
    
    const getPageTitle = () => {
      switch (currentView) {
        case 'dashboard':
          return 'Panel de Control';
        case 'clients':
          return 'Gestión de Clientes';
        case 'products':
          return 'Gestión de Productos';
        case 'invoices':
          return 'Gestión de Facturas';
        case 'new-invoice':
          return 'Nueva Factura';
        case 'converter':
          return 'Conversor de Moneda';
        default:
          return 'Sistema de Facturación Smartek';
      }
    };

    const getCurrentDate = () => {
      return new Date().toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    const handleLogout = () => {
      if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        sessionStorage.removeItem('auth');
        sessionStorage.removeItem('user');
        window.location.href = 'login.html';
      }
    };

    // Cerrar menú al hacer clic fuera de él
    React.useEffect(() => {
      const handleClickOutside = (event) => {
        if (showUserMenu && !event.target.closest('.user-menu')) {
          setShowUserMenu(false);
        }
      };
      
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showUserMenu]);

    return (
      <header className="bg-white shadow-sm border-b border-[var(--border-color)] px-6 py-4" data-name="header" data-file="components/Header.js">
        <div className="flex items-center justify-between">
          {/* Sección del título */}
          <div className="flex flex-col">
            <h2 className="text-2xl font-semibold text-[var(--text-primary)]">{getPageTitle()}</h2>
            <p className="text-sm text-[var(--text-secondary)] mt-1">{getCurrentDate()}</p>
          </div>

          {/* Sección de notificaciones y usuario */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-[var(--text-secondary)]">
              <div className="icon-bell text-lg"></div>
            </div>
            
            {/* Menú de usuario con logout */}
            <div className="relative user-menu">
              <div 
                className="flex items-center space-x-2 cursor-pointer"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <div className="w-8 h-8 bg-[var(--primary-color)] rounded-full flex items-center justify-center">
                  <div className="icon-user text-white text-sm"></div>
                </div>
                <span className="text-sm font-medium text-[var(--text-primary)]">
                  {sessionStorage.getItem('user') || 'Usuario'}
                </span>
              </div>
              
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-[var(--border-color)]">
                  <div className="px-4 py-2 text-sm text-[var(--text-secondary)] border-b border-[var(--border-color)]">
                    {sessionStorage.getItem('user') || 'Usuario'}
                  </div>
                  <div className="px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--secondary-color)] cursor-pointer">
                    <div className="icon-settings inline-block mr-2"></div>
                    Configuración
                  </div>
                  <div 
                    className="px-4 py-2 text-sm text-[var(--danger-color)] hover:bg-red-50 cursor-pointer"
                    onClick={handleLogout}
                  >
                    <div className="icon-log-out inline-block mr-2"></div>
                    Cerrar Sesión
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    );
  } catch (error) {
    console.error('Header component error:', error);
    return null;
  }
}

