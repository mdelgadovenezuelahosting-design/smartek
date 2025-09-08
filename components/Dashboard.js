// Dashboard.js

function Dashboard() {
  const [clients, setClients] = React.useState([]);
  const [products, setProducts] = React.useState([]);
  const [invoices, setInvoices] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [clientsRes, productsRes, invoicesRes] = await Promise.all([
        window.getClients(),
        window.getProducts(),
        window.getInvoices()
      ]);

      setClients(clientsRes || []);
      setProducts(productsRes || []);
      setInvoices(invoicesRes || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      alert('Error cargando datos del dashboard');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Cargando dashboard...</div>;
  }

  // Función para formatear moneda
  const formatCurrency = (value, currency = 'USD') => {
    const num = Number(value || 0);
    return currency === 'VES' ? `Bs.${num.toFixed(2)}` : `$${num.toFixed(2)}`;
  };

  // Cálculos
  const totalInvoiceAmount = invoices.reduce((sum, invoice) => sum + Number(invoice.total || 0), 0);
  const pendingInvoices = invoices.filter(invoice => invoice.status === 'pending').length;

  const stats = [
    { title: 'Total Clientes', value: clients.length, color: 'bg-blue-500' },
    { title: 'Total Productos', value: products.length, color: 'bg-green-500' },
    { title: 'Total Facturas', value: invoices.length, color: 'bg-purple-500' },
    { title: 'Facturas Pendientes', value: pendingInvoices, color: 'bg-orange-500' }
  ];

  const recentInvoices = invoices.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className={`${stat.color} text-white rounded-lg p-4 shadow`}>
            <h3 className="text-lg font-semibold">{stat.title}</h3>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Facturas recientes */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-semibold mb-4">Facturas recientes</h2>
        {recentInvoices.length > 0 ? (
          <ul className="divide-y">
            {recentInvoices.map((invoice, idx) => (
              <li key={idx} className="py-2 flex justify-between">
                <span>{invoice.clientName || invoice.client_name || 'Cliente desconocido'}</span>
                <span>{formatCurrency(invoice.total, invoice.currency)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No hay facturas recientes</p>
        )}
      </div>
    </div>
  );
}

// Hacerlo global para app.js
window.Dashboard = Dashboard;

