// Función para mostrar el dashboard
function showDashboard() {
    const dashboardContent = `
        <div class="dashboard-container">
            <header>
                <h1>🏠 Panel de Control - Smartek System</h1>
                <div class="user-welcome">
                    Bienvenido: <strong id="username-display">Cargando...</strong>
                    <button onclick="logout()" class="logout-btn">Cerrar Sesión</button>
                </div>
            </header>

            <div class="dashboard-content">
                <div class="card">
                    <h3>📊 Sistema Operativo</h3>
                    <p>Estado: <span class="status-online">Online</span></p>
                    <p>Usuarios activos: <strong>1</strong></p>
                </div>

                <div class="card">
                    <h3>🚀 Acciones Rápidas</h3>
                    <button>Gestionar Usuarios</button>
                    <button>Ver Reportes</button>
                    <button>Configuración</button>
                </div>

                <div class="card">
                    <h3>📝 Tu Información</h3>
                    <p>ID de usuario: <strong id="user-id">Cargando...</strong></p>
                    <p>Último acceso: <strong>${new Date().toLocaleString()}</strong></p>
                </div>
            </div>
        </div>
    `;

    document.getElementById('content').innerHTML = dashboardContent;
    loadUserData();
}

// Cargar datos del usuario
async function loadUserData() {
    try {
        const response = await fetch('api/auth-check.php');
        const result = await response.json();
        
        if (result.authenticated && result.user) {
            document.getElementById('username-display').textContent = result.user.username;
            document.getElementById('user-id').textContent = result.user.id;
        }
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}
