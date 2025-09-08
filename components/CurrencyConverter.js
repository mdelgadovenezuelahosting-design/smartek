function CurrencyConverter() {
  try {
    const [usdAmount, setUsdAmount] = React.useState('');
    const [vesAmount, setVesAmount] = React.useState('');
    const [exchangeRate, setExchangeRate] = React.useState(null);
    const [lastUpdate, setLastUpdate] = React.useState(null);
    const [loading, setLoading] = React.useState(false);

    const fetchRate = async () => {
      setLoading(true);
      try {
        const rate = await window.getExchangeRate();
        setExchangeRate(parseFloat(rate));
        setLastUpdate(new Date());
      } catch (error) {
        console.error('Error fetching exchange rate:', error);
        alert('No se pudo obtener la tasa de cambio');
      } finally {
        setLoading(false);
      }
    };

    React.useEffect(() => {
      fetchRate();
    }, []);

    const handleUSDChange = (value) => {
      setUsdAmount(value);
      if (value && exchangeRate) {
        setVesAmount((parseFloat(value) * exchangeRate).toFixed(2));
      } else {
        setVesAmount('');
      }
    };

    const handleVESChange = (value) => {
      setVesAmount(value);
      if (value && exchangeRate) {
        setUsdAmount((parseFloat(value) / exchangeRate).toFixed(2));
      } else {
        setUsdAmount('');
      }
    };

    const formatLastUpdate = () => {
      if (!lastUpdate) return 'No disponible';
      return lastUpdate.toLocaleString('es-ES');
    };

    return (
      <div className="space-y-6" data-name="currency-converter">
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">
              Tipo de Cambio BCV
            </h3>
            <button
              onClick={fetchRate}
              disabled={loading}
              className="btn btn-primary flex items-center"
            >
              <div className={`icon-refresh-cw text-sm mr-2 ${loading ? 'animate-spin' : ''}`}></div>
              {loading ? 'Actualizando...' : 'Actualizar'}
            </button>
          </div>
          
          <div className="bg-[var(--secondary-color)] p-4 rounded-lg mb-6">
            <div className="text-center">
              <p className="text-sm text-[var(--text-secondary)] mb-1">Tasa Oficial BCV</p>
              <p className="text-2xl font-bold text-[var(--primary-color)]">
                1 USD = {exchangeRate ? `${exchangeRate} VES` : 'Cargando...'}
              </p>
              <p className="text-xs text-[var(--text-secondary)] mt-2">
                Última actualización: {formatLastUpdate()}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <h4 className="text-lg font-medium mb-4">Conversor de Moneda</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Dólares Estadounidenses (USD)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <span className="text-[var(--text-secondary)]">$</span>
                </div>
                <input
                  type="number"
                  step="0.01"
                  value={usdAmount}
                  onChange={(e) => handleUSDChange(e.target.value)}
                  className="input pl-8"
                  placeholder="0.00"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Bolívares Venezolanos (VES)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <span className="text-[var(--text-secondary)]">Bs.</span>
                </div>
                <input
                  type="number"
                  step="0.01"
                  value={vesAmount}
                  onChange={(e) => handleVESChange(e.target.value)}
                  className="input pl-12"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <span className="icon-info text-blue-600 inline mr-2"></span>
              Las tasas se actualizan automáticamente desde el Banco Central de Venezuela
            </p>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('CurrencyConverter component error:', error);
    return null;
  }
}

module.exports = CurrencyConverter;

