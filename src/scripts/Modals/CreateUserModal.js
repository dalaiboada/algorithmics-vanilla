const modalUsuario = document.getElementById('modalNuevoUsuario');
const btnNuevoUsuario = document.getElementById('btnNuevoUsuario');
const closeModalUsuario = document.getElementById('closeModalUsuario');
const btnCancelarUsuario = document.getElementById('btnCancelarUsuario');
const btnGuardarUsuario = document.getElementById('btnGuardarUsuario');
const $togglePassword = document.getElementById('togglePassword');
const $togglePasswordConfirm = document.getElementById('togglePasswordConfirm');

let isPasswordVisible = false;
let isConfirmPasswordVisible = false;

// === DATA ===
const buildUsuarioData = () => {
    return {
        nombre: document.getElementById('usuarioNombre').value.trim(),
        apellido: document.getElementById('usuarioApellido').value.trim(),
        email: document.getElementById('usuarioEmail').value.trim(),
        clave: document.getElementById('usuarioClave').value,
        habilitado: document.getElementById('usuarioHabilitado').checked,
        rol_id: parseInt(document.getElementById('usuarioRol').value)
    };
}

// TODO Llamar aquí al servicio de usuarios
const saveUsuario = () => {
    const usuarioData = buildUsuarioData();
    console.log('Datos del usuario a enviar:', usuarioData);

    alert('Usuario creado exitosamente (ver datos en consola)');
    console.log('JSON para enviar a la API:', JSON.stringify(usuarioData, null, 2));
}

// === MODAL ===
const showModal = () => {
    resetModalUsuario();
    modalUsuario.classList.add('active');
}

const hideModal = () => {
    modalUsuario.classList.remove('active');
    resetModalUsuario();
}

// mostrar/ocultar contraseña
const togglePassword = () => {
    const passwordInput = document.getElementById('usuarioClave');

    isPasswordVisible = !isPasswordVisible;
    passwordInput.type = isPasswordVisible ? 'text' : 'password';

    $togglePassword.innerHTML = isPasswordVisible 
        ? '<i class="fas fa-eye-slash"></i>' 
        : '<i class="fas fa-eye"></i>';
}

const togglePasswordConfirm = () => {
    const passwordInput = document.getElementById('usuarioClaveConfirm');

    isConfirmPasswordVisible = !isConfirmPasswordVisible;
    passwordInput.type = isConfirmPasswordVisible ? 'text' : 'password';

    $togglePasswordConfirm.innerHTML = isConfirmPasswordVisible 
        ? '<i class="fas fa-eye-slash"></i>' 
        : '<i class="fas fa-eye"></i>';
}

const resetModalUsuario = () => {
    // Resetear formulario
    document.getElementById('usuarioForm').reset();
    
    // Resetear variables de visibilidad de contraseña
    isPasswordVisible = false;
    isConfirmPasswordVisible = false;
    document.getElementById('usuarioClave').type = 'password';
    document.getElementById('usuarioClaveConfirm').type = 'password';
    $togglePassword.innerHTML = '<i class="fas fa-eye"></i>';
    $togglePasswordConfirm.innerHTML = '<i class="fas fa-eye"></i>';
    
    // Limpiar errores
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(error => error.classList.remove('active'));
    
    const errorInputs = document.querySelectorAll('.form-input.error');
    errorInputs.forEach(input => input.classList.remove('error'));
}

// === ERORES ===
const showError = (errorId, message) => {
    const errorElement = document.getElementById(errorId);
    errorElement.textContent = message;
    errorElement.classList.add('active');
}

const clearError = e => {
    const field = e.target;
    const fieldId = field.id;

    field.classList.remove('error');
    
    // Limpiar mensaje de error específico
    let errorId = '';
    switch(fieldId) {
        case 'usuarioNombre': errorId = 'errorNombre'; break;
        case 'usuarioApellido': errorId = 'errorApellido'; break;
        case 'usuarioEmail': errorId = 'errorEmail'; break;
        case 'usuarioClave': errorId = 'errorClave'; break;
        case 'usuarioClaveConfirm': errorId = 'errorClaveConfirm'; break;
        case 'usuarioRol': errorId = 'errorRol'; break;
    }
    
    if (errorId) document.getElementById(errorId).classList.remove('active');
    
    // Si se está escribiendo en una contraseña, validar coincidencia
    if (fieldId === 'usuarioClave' || fieldId === 'usuarioClaveConfirm') {
        const password = document.getElementById('usuarioClave').value;
        const confirmPassword = document.getElementById('usuarioClaveConfirm').value;
        
        if (password && confirmPassword && password === confirmPassword) {
            document.getElementById('errorClaveConfirm').classList.remove('active');
            document.getElementById('usuarioClaveConfirm').classList.remove('error');
        }
    }
}

// === VALIDACIONES ===
// Validar formulario completo
const validateForm = () => {
    let isValid = true;
    
    // Validar cada campo
    const nombre = document.getElementById('usuarioNombre').value.trim();
    const apellido = document.getElementById('usuarioApellido').value.trim();
    const email = document.getElementById('usuarioEmail').value.trim();
    const clave = document.getElementById('usuarioClave').value;
    const claveConfirm = document.getElementById('usuarioClaveConfirm').value;
    const rol = document.getElementById('usuarioRol').value;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!nombre) {
        showError('errorNombre', 'El nombre es requerido');
        document.getElementById('usuarioNombre').classList.add('error');
        isValid = false;
    }
    
    if (!apellido) {
        showError('errorApellido', 'El apellido es requerido');
        document.getElementById('usuarioApellido').classList.add('error');
        isValid = false;
    }
    
    if (!email) {
        showError('errorEmail', 'El correo electrónico es requerido');
        document.getElementById('usuarioEmail').classList.add('error');
        isValid = false;
    } else if (!emailRegex.test(email)) {
        showError('errorEmail', 'Ingresa un correo electrónico válido');
        document.getElementById('usuarioEmail').classList.add('error');
        isValid = false;
    }
    
    if (!clave) {
        showError('errorClave', 'La contraseña es requerida');
        document.getElementById('usuarioClave').classList.add('error');
        isValid = false;
    } else if (clave.length < 6) {
        showError('errorClave', 'La contraseña debe tener al menos 6 caracteres');
        document.getElementById('usuarioClave').classList.add('error');
        isValid = false;
    }
    
    if (!claveConfirm) {
        showError('errorClaveConfirm', 'Confirma la contraseña');
        document.getElementById('usuarioClaveConfirm').classList.add('error');
        isValid = false;
    } else if (clave !== claveConfirm) {
        showError('errorClaveConfirm', 'Las contraseñas no coinciden');
        document.getElementById('usuarioClaveConfirm').classList.add('error');
        isValid = false;
    }
    
    if (!rol) {
        showError('errorRol', 'Selecciona un rol');
        document.getElementById('usuarioRol').classList.add('error');
        isValid = false;
    }
    
    return isValid;
}

const validateField = e => {
    const field = e.target;
    const fieldId = field.id;
    const value = field.value.trim();
    
    switch(fieldId) {
        case 'usuarioNombre':
            if (!value) {
                showError('errorNombre', 'El nombre es requerido');
                field.classList.add('error');
            }
            break;
            
        case 'usuarioApellido':
            if (!value) {
                showError('errorApellido', 'El apellido es requerido');
                field.classList.add('error');
            }
            break;
            
        case 'usuarioEmail':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!value) {
                showError('errorEmail', 'El correo electrónico es requerido');
                field.classList.add('error');
            } else if (!emailRegex.test(value)) {
                showError('errorEmail', 'Ingresa un correo electrónico válido');
                field.classList.add('error');
            }
            break;
            
        case 'usuarioClave':
            if (!value) {
                showError('errorClave', 'La contraseña es requerida');
                field.classList.add('error');
            } else if (value.length < 6) {
                showError('errorClave', 'La contraseña debe tener al menos 6 caracteres');
                field.classList.add('error');
            }
            // Validar coincidencia de contraseñas
            const confirmPassword = document.getElementById('usuarioClaveConfirm').value;
            if (confirmPassword && value !== confirmPassword) {
                showError('errorClaveConfirm', 'Las contraseñas no coinciden');
                document.getElementById('usuarioClaveConfirm').classList.add('error');
            }
            break;
            
        case 'usuarioClaveConfirm':
            const password = document.getElementById('usuarioClave').value;
            if (!value) {
                showError('errorClaveConfirm', 'Confirma la contraseña');
                field.classList.add('error');
            } else if (value !== password) {
                showError('errorClaveConfirm', 'Las contraseñas no coinciden');
                field.classList.add('error');
            }
            break;
            
        case 'usuarioRol':
            if (!value) {
                showError('errorRol', 'Selecciona un rol');
                field.classList.add('error');
            }
            break;
    }
}


const initModalCreateUser = () => {
    // Abrir modal
    btnNuevoUsuario.addEventListener('click', showModal);

    // Cerrar modal
    closeModalUsuario.addEventListener('click', hideModal);
    btnCancelarUsuario.addEventListener('click', hideModal);

    // Toggle mostrar/ocultar contraseña
    $togglePassword.addEventListener('click', togglePassword);
    $togglePasswordConfirm.addEventListener('click', togglePasswordConfirm);

    // Validación en tiempo real
    const inputs = document.querySelectorAll('#usuarioForm input, #usuarioForm select');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearError);
    });

    // Guardar usuario
    btnGuardarUsuario.addEventListener('click', function() {
        if (!validateForm()) return;
        saveUsuario();
        hideModal();
    });
};

export default initModalCreateUser;
