// --- ELEMENTOS DEL DOM
const $registerForm = document.getElementById('registerForm');
const $submitBtn = document.getElementById('submitBtn');

// Botones de mostrar/ocultar contraseña
const $togglePasswordBtn = document.getElementById('togglePassword');
const $passwordInput = document.getElementById('password');

// Botones de mostrar/ocultar confirmación de contraseña
const $toggleConfirmPasswordBtn = document.getElementById('toggleConfirmPassword');
const $confirmPasswordInput = document.getElementById('confirmPassword');

// Barra de fortaleza de contraseña
const $passwordStrengthBar = document.getElementById('passwordStrengthBar');
const $passwordStrengthText = document.getElementById('passwordStrengthText');


// --- FUNCIONES
// Interfaz
const togglePassword = () => {
	const type = $passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
	$passwordInput.setAttribute('type', type);
	$togglePasswordBtn.textContent = type === 'password' ? 'Mostrar' : 'Ocultar';
};

const toggleConfirmPassword = () => {
	const type = $confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
	$confirmPasswordInput.setAttribute('type', type);
	$toggleConfirmPasswordBtn.textContent = type === 'password' ? 'Mostrar' : 'Ocultar';
};

const validatePasswordStrength = () => {
	const password = $passwordInput.value;

	let strength = 0, strengthText = 'Contraseña débil', color = '#ef4444'; // Rojo

	// Verificar longitud
	if (password.length >= 8) strength += 25;
	// Verificar letras mayúsculas y minúsculas
	if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
	// Verificar números
	if (/[\d]/.test(password)) strength += 25;
	// Verificar caracteres especiales
	if (/[\W_]/.test(password)) strength += 25;

	// Actualizar barra y texto
	$passwordStrengthBar.style.width = `${strength}%`;
	
	if (strength <= 25) {
		strengthText = 'Contraseña débil'; color = '#ef4444'; // Rojo
	} else if (strength <= 50) {
		strengthText = 'Contraseña regular'; color = '#f59e0b'; // Ámbar
	} else if (strength <= 75) {
		strengthText = 'Contraseña buena'; color = '#3b82f6'; // Azul
	} else {
		strengthText = 'Contraseña fuerte'; color = '#22c55e'; // Verde
	}
	
	$passwordStrengthBar.style.backgroundColor = color;
	$passwordStrengthText.textContent = strengthText;
};

const validateForm = e => {
	e.preventDefault();
	clearErrors();

	let isValid = true;
	
	// Obtener valores de los campos
	const $firstName = document.getElementById('firstName').value.trim();
	const $lastName = document.getElementById('lastName').value.trim();
	const $email = document.getElementById('email').value.trim();
	const $password = $passwordInput.value;
	const $confirmPassword = $confirmPasswordInput.value;
	
	// Validar nombre
	if (!$firstName) {
		isValid = false;
		showError('firstNameError', 'Por favor ingresa tu nombre.');
	}
	// Validar apellido
	if (!$lastName) {
		isValid = false;
		showError('lastNameError', 'Por favor ingresa tu apellido.');
	}
	
	// Validar email
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!$email) {
		isValid = false;
		showError('emailError', 'Por favor ingresa tu correo electrónico.');
	}
	else if (!emailRegex.test($email)) {
		isValid = false;
		showError('emailError', 'Por favor ingresa un correo electrónico válido.');
	}
	
	// Validar contraseña
	const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
	if (!$password) {
		isValid = false;
		showError('passwordError', 'Por favor crea una contraseña.');
	}
	else if (!passwordRegex.test($password)) {
		isValid = false;
		showError('passwordError', 'La contraseña debe tener al menos 8 caracteres, incluyendo una letra mayúscula, una minúscula y un número.');
	}
	
	// Validar confirmación de contraseña
	if (!$confirmPassword) {
		isValid = false;
		showError('confirmPasswordError', 'Por favor confirma tu contraseña.');
	}
	else if ($password !== $confirmPassword) {
		isValid = false;
		showError('confirmPasswordError', 'Las contraseñas no coinciden.');
	}

	return isValid;
};

const validateConfirmPassword = () => {
	const password = $passwordInput.value;
	const confirmPassword = $confirmPasswordInput.value;
	const $errorElement = document.getElementById('confirmPasswordError');
	
	if (confirmPassword && password !== confirmPassword) {
		$errorElement.textContent = 'Las contraseñas no coinciden.';
		$errorElement.classList.add('error');
		$confirmPasswordInput.classList.add('error');
	} 
	else if (confirmPassword && password === confirmPassword) {
		$errorElement.textContent = '¡Las contraseñas coinciden!';
		$errorElement.classList.remove('error');
		$errorElement.classList.add('success');
		$confirmPasswordInput.classList.remove('error');
		$confirmPasswordInput.classList.add('success');
	} 
	else {
		$errorElement.textContent = '';
		$errorElement.classList.remove('error', 'success');
		$confirmPasswordInput.classList.remove('error', 'success');
	}
};

// Auxiares
const showError = (elementId, message) => {
	const $errorElement = document.getElementById(elementId);

	$errorElement.textContent = message;
	$errorElement.classList.add('error');

	// Resaltar campo con error
	const $inputId = elementId.replace('Error', '');
	const $inputElement = document.getElementById($inputId);
	if ($inputElement) $inputElement.classList.add('error');
}

const clearErrors = () => {
	const $errorMessages = document.querySelectorAll('.form-message');

	// Quitar mensajes de error
	$errorMessages.forEach(msg => msg.classList.remove('error', 'success'));
	
	// Quitar clases de error de los inputs
	const $errorInputs = document.querySelectorAll('.form-input');
	$errorInputs.forEach(input => input.classList.remove('error', 'success'));
}

const getData = () => {
	const $firstName = document.getElementById('firstName').value.trim();
	const $lastName = document.getElementById('lastName').value.trim();
	const $email = document.getElementById('email').value.trim();
	const $password = $passwordInput.value;

	return { $firstName, $lastName, $email, $password };
}

// --- EVENTOS
// Mostrar/ocultar contraseña
$togglePasswordBtn.addEventListener('click', togglePassword);
$toggleConfirmPasswordBtn.addEventListener('click', toggleConfirmPassword);

$registerForm.addEventListener('submit', validateForm);
$passwordInput.addEventListener('input', validatePasswordStrength);
$confirmPasswordInput.addEventListener('input', validateConfirmPassword);

$submitBtn.addEventListener('click', e => {
	e.preventDefault();

	if (!validateForm(e)) return;

	$submitBtn.disabled = true;
	$submitBtn.textContent = 'Registrando...';

	const data = getData();
	console.log(data);
});