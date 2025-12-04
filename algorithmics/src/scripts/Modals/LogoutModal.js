const logoutTrigger = document.querySelector('.logout-trigger');
const logoutDropdown = document.getElementById('logoutDropdown');
const logoutOption = document.getElementById('logoutOption');

function inicializarDropdownLogout() {
    // Abrir/cerrar dropdown al hacer clic en el icono de usuario
    logoutTrigger.addEventListener('click', e => {
        e.stopPropagation();
        logoutDropdown.classList.toggle('active');
    });
    
    // Cerrar dropdown al hacer clic en cualquier parte fuera de él
    document.addEventListener('click', e => {
        if (!logoutDropdown.contains(e.target) && !logoutTrigger.contains(e.target)) {
            logoutDropdown.classList.remove('active');
        }
    });
    
    // Cerrar sesión al hacer clic en la opción
    logoutOption.addEventListener('click', e => {
        e.preventDefault();
        
        alert('Cerrando sesión... Redirigiendo a la página de inicio de sesión.');
        
        // Cerrar dropdown
        logoutDropdown.classList.remove('active');
        
        // Simular redirección después de 1 segundo
        setTimeout(() => {
            // En un caso real, esto redirigiría a la página de login
            // window.location.href = '/login';
            console.log('Sesión cerrada. Redirigiendo...');
        }, 1000);
    });
    
    // Cerrar dropdown con la tecla Escape
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && logoutDropdown.classList.contains('active')) {
            logoutDropdown.classList.remove('active');
        }
    });
}
export default inicializarDropdownLogout;