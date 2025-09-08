function InvoiceForm({ onSave, onCancel }) {
  const [clients, setClients] = React.useState([]);
  const [products, setProducts] = React.useState([]);
  const [exchangeRate, setExchangeRate] = React.useState(1);
  const [formData, setFormData] = React.useState({
    clientId: '',
    date: new Date().toISOString().split('T')[0],
    items: [],
    notes: '',
    currency: 'USD',
    ivaRate: 16
  });
  const [selectedProduct, setSelectedProduct] = React.useState('');
  const [quantity, setQuantity] = React.useState(1);
  const [loading, setLoading] = React.useState(false);

  // === Cargar clientes y productos ===
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientsRes, productsRes] = await Promise.all([
          fetch('/api/clients.php').then(res => res.json()),
          fetch('/api/products.php').then(res => res.json())
        ]);
        setClients(clientsRes);
        setProducts(productsRes);
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('Error cargando clientes o productos');
      }
    };
    fetchData();
  }, []);

  // === Función para cambiar moneda ===
  const handleCurrencyChange = async (newCurrency) => {
    if (newCurrency === formData.currency) return;

    try {
      setLoading(true);
      const res = await fetch(`/api/currency_converter.php?from=${formData.currency}&to=${newCurrency}`);
      const data = await res.json();

      if (!data.success) {
        alert(data.message || 'Error obteniendo tasa de cambio');
        return;
      }

      const rate = parseFloat(data.rate);
      setExchangeRate(rate);

      // Convertir precios y totales
      const convertedItems = formData.items.map(item => ({
        ...item,
        price: (item.price * rate).toFixed(2),
        total: (item.total * rate).toFixed(2)
      }));

      setFormData(prev => ({
        ...prev,
        currency: newCurrency,
        items: convertedItems
      }));

    } catch (err) {
      console.error(err);
      alert('Error al cambiar de moneda');
    } finally {
      setLoading(false);
    }
  };

  // === Cálculos ===
  const calculateSubtotal = () => formData.items.reduce((sum, i) => sum + Number(i.total || 0), 0);
  const calculateIVA = () => calculateSubtotal() * (Number(formData.ivaRate) / 100);
  const calculateTotal = () => calculateSubtotal() + calculateIVA();

  // === Agregar producto ===
  const addItem = () => {
    if (!selectedProduct || quantity <= 0) return;
    const product = products.find(p => p.id == selectedProduct);
    if (!product) return;

    const price = Number(product.price);
    const qty = Number(quantity);
    const total = price * qty;

    const newItem = {
      productId: product.id,
      productName: product.name,
      price,
      quantity: qty,
      total
    };

    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
    setSelectedProduct('');
    setQuantity(1);
  };

  // === Quitar producto ===
  const removeItem = (index) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  // === Crear factura ===
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.clientId) return alert('Selecciona un cliente');
    if (formData.items.length === 0) return alert('Agrega productos');

    setLoading(true);
    try {
      const invoiceData = {
        clientId: formData.clientId,
        date: formData.date,
        items: formData.items,
        subtotal: calculateSubtotal(),
        ivaRate: Number(formData.ivaRate),
        ivaAmount: calculateIVA(),
        total: calculateTotal(),
        currency: formData.currency,
        status: 'pending',
        notes: formData.notes,
        exchangeRate: exchangeRate
      };

      const res = await fetch('/api/invoices.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoiceData)
      });

      const result = await res.json();
      if (!result.success) throw new Error(result.message || 'Error al crear factura');

      alert(`Factura creada #${result.invoiceNumber}`);
      printTicket(invoiceData, result.invoiceNumber);
      onSave();
    } catch (error) {
      console.error('Error creating invoice:', error);
      alert('Error al crear la factura: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // === Imprimir ticket 80mm ===
  const printTicket = (invoice, number) => {
    const ticketWindow = window.open('', '', 'width=400,height=600');
    const formatter = (n) => invoice.currency === 'VES' ? `Bs.${n.toFixed(2)}` : `$${n.toFixed(2)}`;

    const ticketHTML = `
      <html>
      <head>
        <style>
          body { font-family: monospace; width: 80mm; margin: 0; padding: 0; }
          h2 { text-align: center; margin: 0; }
          table { width: 100%; border-collapse: collapse; }
          td { padding: 2px; }
          .right { text-align: right; }
          hr { border: none; border-top: 1px dashed #000; margin: 5px 0; }
        </style>
      </head>
      <body>
        <h2>FACTURA #${number}</h2>
        <p>Fecha: ${invoice.date}</p>
        <hr>
        <table>
          ${invoice.items.map(i => `
            <tr>
              <td>${i.productName} x${i.quantity}</td>
              <td class="right">${formatter(Number(i.total))}</td>
            </tr>`).join('')}
        </table>
        <hr>
        <table>
          <tr><td>Subtotal</td><td class="right">${formatter(calculateSubtotal())}</td></tr>
          <tr><td>IVA (${invoice.ivaRate}%)</td><td class="right">${formatter(calculateIVA())}</td></tr>
          <tr><td><strong>Total</strong></td><td class="right"><strong>${formatter(calculateTotal())}</strong></td></tr>
        </table>
        <hr>
        <p style="text-align:center;">¡Gracias por su compra!</p>
      </body>
      </html>
    `;
    ticketWindow.document.write(ticketHTML);
    ticketWindow.document.close();
    ticketWindow.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Nueva Factura</h3>
        <button onClick={onCancel} className="btn btn-secondary" disabled={loading}>Cancelar</button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Datos generales */}
        <div className="card grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <select value={formData.clientId} onChange={e => setFormData({ ...formData, clientId: e.target.value })} className="input" required disabled={loading}>
            <option value="">Seleccionar cliente</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <input type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} className="input" required disabled={loading}/>
          <select value={formData.currency} onChange={e => handleCurrencyChange(e.target.value)} className="input" disabled={loading}>
            <option value="USD">USD</option>
            <option value="VES">VES</option>
          </select>
          <input type="number" step="0.01" min="0" max="100" value={formData.ivaRate} onChange={e => setFormData({ ...formData, ivaRate: parseFloat(e.target.value) })} className="input" disabled={loading}/>
        </div>

        {/* Productos */}
        <div className="card">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <select value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)} className="input" disabled={loading}>
              <option value="">Seleccionar producto</option>
              {products.map(p => <option key={p.id} value={p.id}>{p.name} - {p.currency === 'VES' ? 'Bs.' : '$'}{p.price}</option>)}
            </select>
            <input type="number" min="1" value={quantity} onChange={e => setQuantity(parseInt(e.target.value) || 1)} className="input" disabled={loading}/>
            <button type="button" onClick={addItem} className="btn btn-primary" disabled={!selectedProduct || loading}>Agregar</button>
          </div>

          {/* Tabla de items */}
          {formData.items.length > 0 && (
            <table className="w-full border">
              <thead>
                <tr>
                  <th>Producto</th><th>Precio</th><th>Cant.</th><th>Total</th><th></th>
                </tr>
              </thead>
              <tbody>
                {formData.items.map((item, i) => (
                  <tr key={i}>
                    <td>{item.productName}</td>
                    <td>{formData.currency === 'VES' ? 'Bs.' : '$'}{Number(item.price).toFixed(2)}</td>
                    <td>{item.quantity}</td>
                    <td>{formData.currency === 'VES' ? 'Bs.' : '$'}{Number(item.total).toFixed(2)}</td>
                    <td><button type="button" onClick={() => removeItem(i)} className="text-red-600">X</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Totales dinámicos */}
        <div className="card">
          <div className="flex justify-between"><span>Subtotal:</span><span>{formData.currency === 'VES' ? 'Bs.' : '$'}{calculateSubtotal().toFixed(2)}</span></div>
          <div className="flex justify-between"><span>IVA ({formData.ivaRate}%):</span><span>{formData.currency === 'VES' ? 'Bs.' : '$'}{calculateIVA().toFixed(2)}</span></div>
          <div className="flex justify-between font-bold text-lg"><span>Total:</span><span>{formData.currency === 'VES' ? 'Bs.' : '$'}{calculateTotal().toFixed(2)}</span></div>
        </div>

        {/* Notas */}
        <div className="card">
          <textarea value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} className="input" rows="3" placeholder="Notas..." disabled={loading}/>
        </div>

        {/* Botones */}
        <div className="flex space-x-2">
          <button type="submit" className="btn btn-success" disabled={!formData.clientId || formData.items.length === 0 || loading}>{loading ? 'Creando...' : 'Crear Factura'}</button>
          <button type="button" onClick={onCancel} className="btn btn-secondary" disabled={loading}>Cancelar</button>
        </div>
      </form>
    </div>
  );
}

window.InvoiceForm = InvoiceForm;

