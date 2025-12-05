// Validación básica del formulario
document.querySelector('.login-form').addEventListener('submit', function(e) {
	e.preventDefault();
	
	const $email = document.getElementById('email');
	const $password = document.getElementById('password');
	
	if (!$email.value || !$password.value) {
		alert('Por favor, completa todos los campos');
		return;
	}
	
	// Simulación de inicio de sesión exitoso
	alert('¡Inicio de sesión exitoso! Redirigiendo...');
	// En una implementación real, aquí iría la lógica de autenticación
});