console.log('Iniciando database.js');

// ==================== Helper para llamar a la API ====================
async function callApi(endpoint, method = 'GET', data = null) {
  const options = { method, headers: { 'Content-Type': 'application/json' } };
  if (data) options.body = JSON.stringify(data);

  let url = `/api/${endpoint}.php`;
  if (method === 'PUT' || method === 'DELETE') {
    url += `?id=${data?.id || ''}`;
  }

  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`API Error ${res.status}`);
  return res.json();
}

// ==================== CLIENTES ====================
async function createClient(clientData) {
  return callApi('clients', 'POST', clientData);
}
async function updateClient(id, clientData) {
  clientData.id = id;
  return callApi('clients', 'PUT', clientData);
}
async function deleteClient(id) {
  return callApi('clients', 'DELETE', { id });
}
async function getClients() {
  return callApi('clients');
}

// ==================== PRODUCTOS ====================
async function createProduct(productData) {
  return callApi('products', 'POST', productData);
}
async function updateProduct(id, productData) {
  productData.id = id;
  return callApi('products', 'PUT', productData);
}
async function deleteProduct(id) {
  return callApi('products', 'DELETE', { id });
}
async function getProducts() {
  return callApi('products');
}

// ==================== FACTURAS ====================
async function createInvoice(invoiceData) {
  return callApi('invoices', 'POST', invoiceData);
}
async function updateInvoiceStatus(id, statusData) {
  statusData.id = id;
  return callApi('invoices', 'PUT', statusData);
}
async function deleteInvoice(id) {
  return callApi('invoices', 'DELETE', { id });
}
async function getInvoices() {
  return callApi('invoices');
}

// ==================== TASA DE CAMBIO (USD ↔ VES) ====================
async function getExchangeRate() {
  const res = await fetch('/api/exchange.php');
  if (!res.ok) throw new Error(`API Error ${res.status}`);
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Error obteniendo tasa');
  return data.rate; // Devuelve solo el valor numérico de la tasa
}

// ==================== EXPORTS GLOBALES ====================
if (typeof window !== 'undefined') {
  // Clientes
  window.createClient = createClient;
  window.getClients = getClients;
  window.updateClient = updateClient;
  window.deleteClient = deleteClient;

  // Productos
  window.createProduct = createProduct;
  window.getProducts = getProducts;
  window.updateProduct = updateProduct;
  window.deleteProduct = deleteProduct;

  // Facturas
  window.createInvoice = createInvoice;
  window.getInvoices = getInvoices;
  window.updateInvoiceStatus = updateInvoiceStatus;
  window.deleteInvoice = deleteInvoice;

  // Tasa de cambio
  window.getExchangeRate = getExchangeRate;
}

console.log('database.js listo vía API PHP con ExchangeRate');

