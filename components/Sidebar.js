function Sidebar({ currentView, onViewChange }) {
  try {
    const menuItems = [
      { id: 'dashboard', label: 'Inicio', icon: 'home' },
      { id: 'clients', label: 'Clientes', icon: 'users' },
      { id: 'products', label: 'Productos', icon: 'package' },
      { id: 'invoices', label: 'Facturas', icon: 'file-text' },
      { id: 'new-invoice', label: 'Nueva Factura', icon: 'plus-circle' },
      { id: 'converter', label: 'Conversor', icon: 'refresh-cw' }
    ];

    const handleLogout = () => {
      if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        try {
          sessionStorage.removeItem("auth");
          sessionStorage.removeItem("user");
          window.location.href = "login.html";
        } catch (err) {
          console.error('Error cerrando sesión:', err);
          alert('No se pudo cerrar sesión correctamente');
        }
      }
    };

    return (
      <div className="w-64 bg-white shadow-lg flex flex-col" data-name="sidebar" data-file="components/Sidebar.js">
        <div className="p-6 border-b border-[var(--border-color)]">
          <div className="flex items-center mb-2">
            <img 
              src="http://smartek.gconex.com/logo/logo.jpg" 
              alt="Smartek Logo" 
              className="w-12 h-12 mr-3"
            />
            <div>
              <h1 className="text-lg font-bold text-[var(--primary-color)]">Smartek</h1>
            </div>
          </div>
          <p className="text-sm text-[var(--text-secondary)]">Sistema de Facturación</p>
        </div>
        
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map(item => (
              <li key={item.id}>
                <button
                  onClick={() => onViewChange(item.id)}
                  className={`w-full flex items-center px-3 py-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--secondary-color)] hover:text-[var(--primary-color)] transition-colors cursor-pointer ${
                    currentView === item.id ? 'bg-[var(--primary-color)] text-white' : ''
                  }`}
                >
                  <div className={`icon-${item.icon} text-lg mr-3`}></div>
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-[var(--border-color)]">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <div className="icon-log-out text-lg mr-3"></div>
            <span>Cerrar Sesión</span>
          </button>
          <div className="text-xs text-[var(--text-secondary)] mt-2">
            © 2025 Smartek
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Sidebar component error:', error);
    return (
      <div className="text-center py-8 text-red-600">
        <div className="icon-alert-triangle text-2xl mb-2"></div>
        <p>Error cargando la barra lateral</p>
      </div>
    );
  }
}

module.exports = Sidebar;

