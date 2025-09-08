// InvoiceManager.js

function InvoiceManager({ invoices, onRefresh }) {
  const handleDelete = async (invoiceId) => {
    if (confirm('¿Seguro que quieres eliminar esta factura?')) {
      try {
        await window.deleteInvoice(invoiceId);
        onRefresh();
      } catch (error) {
        console.error('Error deleting invoice:', error);
        alert('Error al eliminar la factura: ' + error.message);
      }
    }
  };

  const formatCurrency = (value, currency = 'USD') => {
    const num = Number(value || 0);
    return currency === 'VES' ? `Bs.${num.toFixed(2)}` : `$${num.toFixed(2)}`;
  };

  return (
    <div className="space-y-6" data-name="invoice-manager">
      {/* Encabezado */}
      <h1 className="text-2xl font-bold">Gestión de Facturas</h1>

      {/* Tabla de facturas */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2 text-left">ID</th>
              <th className="border p-2 text-left">Cliente</th>
              <th className="border p-2 text-left">Fecha</th>
              <th className="border p-2 text-left">Estado</th>
              <th className="border p-2 text-left">Total</th>
              <th className="border p-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {invoices.length > 0 ? (
              invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="border p-2">{invoice.id}</td>
                  <td className="border p-2">{invoice.client_name || invoice.client_id}</td>
                  <td className="border p-2">{invoice.date}</td>
                  <td className="border p-2 capitalize">{invoice.status}</td>
                  <td className="border p-2">{formatCurrency(invoice.total, invoice.currency)}</td>
                  <td className="border p-2 text-center">
                    <button
                      onClick={() => alert('Aquí luego puedes abrir detalles o editar')}
                      className="px-2 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 mr-2"
                    >
                      Ver
                    </button>
                    <button
                      onClick={() => handleDelete(invoice.id)}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-4 text-gray-500">
                  No hay facturas registradas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Hacerlo global para app.js
window.InvoiceManager = InvoiceManager;

