const $modal = document.getElementById('modalNuevoCurso');

const $btnNuevoCurso = document.getElementById('btnNuevoCurso');
const $btnHideModal = document.getElementById('btnHideModal');
const $btnCancelar = document.getElementById('btnCancelar');
const $btnAnterior = document.getElementById('btnAnterior');
const $btnSiguiente = document.getElementById('btnSiguiente');
const $btnGuardar = document.getElementById('btnGuardar');

const $btnAgregarModulo = document.getElementById('btnAgregarModulo');

const $tieneProyectoCheckbox = document.getElementById('tieneProyecto');
const $proyectoFields = document.getElementById('proyectoFields');

const steps = document.querySelectorAll('.step');
const stepContents = document.querySelectorAll('.step-content');

// Variables globales
let currentStep = 1;
let modules = [];
let evaluations = {}; // Almacena evaluaciones por módulo
let moduleCounter = 0; // Contador de módulos
let evaluationCounter = 0; // Contador de evaluaciones


// === MODAL ===
const showModal = () => {
    resetModal();
    $modal.classList.add('active');
}

const hideModal = () => {
    $modal.classList.remove('active');
    resetModal();
}

const nextStep = () => {
    if (!validateCurrentStep()) return;
    //verifica la condición de paso y avanza.
    currentStep < 3 && goToStep(currentStep + 1);
}

const previousStep = () => currentStep > 1 && goToStep(currentStep - 1);

// Validar paso actual
const validateCurrentStep = () => {
    switch(currentStep) {
        case 1:
            const nombre = document.getElementById('cursoNombre').value.trim();
            const estado = document.getElementById('cursoEstado').value;
            
            if (!nombre) {
                alert('Por favor ingresa el nombre del curso');
                return false;
            }
            if (!estado) {
                alert('Por favor selecciona el estado del curso');
                return false;
            }
            return true;
            
        case 2:
            if (modules.length === 0) {
                alert('Debes agregar al menos un módulo al curso');
                return false;
            }
            
            // Validar que cada módulo tenga al menos una evaluación
            for (let moduleId in evaluations) {
                if (!evaluations[moduleId] || evaluations[moduleId].length === 0) {
                    alert(`El módulo "${getModuleName(moduleId)}" debe tener al menos una evaluación`);
                    return false;
                }
            }
            return true;
            
        case 3:
            const tieneProyecto = document.getElementById('tieneProyecto').checked;

            if (tieneProyecto) {
                const proyectoNombre = document.getElementById('proyectoNombre').value.trim();
                const proyectoPuntuacion = parseFloat(document.getElementById('proyectoPuntuacion').value);
                
                if (!proyectoNombre) {
                    alert('Por favor ingresa el nombre del proyecto');
                    return false;
                }
                if (!proyectoPuntuacion || proyectoPuntuacion < 1 || proyectoPuntuacion > 20) {
                    alert('La puntuación máxima del proyecto debe estar entre 1.00 y 20.00');
                    return false;
                }
            }
            return true;
    }
    return true;
}

// Navegar a un paso específico
const goToStep = step => {
    // Actualizar pasos
    steps.forEach(s => {
        if (parseInt(s.dataset.step) === step) s.classList.add('active');
        else s.classList.remove('active');
    });

    // Actualizar contenido
    stepContents.forEach(content => {
        if (content.id === `step${step}`) content.classList.add('active');
        else content.classList.remove('active');
    });

    // Actualizar botones
    $btnAnterior.style.display = step > 1 ? 'flex' : 'none';
    $btnSiguiente.style.display = step < 3 ? 'flex' : 'none';
    $btnGuardar.style.display = step === 3 ? 'flex' : 'none';

    currentStep = step;
}

const resetModal = () => {
    currentStep = 1;
    modules = [];
    evaluations = {};
    moduleCounter = 0;
    evaluationCounter = 0;
    
    // Resetear formulario
    document.getElementById('cursoForm').reset();
    document.getElementById('tieneProyecto').checked = false;
    document.getElementById('proyectoFields').style.display = 'none';
    
    // Limpiar módulos
    document.getElementById('modulosContainer').innerHTML = `
        <div class="empty-state" id="noModulesMessage">
            <i class="fas fa-layer-group"></i>
            <p>No hay módulos agregados. Comienza agregando el primer módulo.</p>
        </div>
    `;
    
    goToStep(1); // Volver al paso 1
}

// === MÓDULOS ===
const getModuleName = moduleId => {
    const module = modules.find(m => m.id === moduleId);
    return module ? module.nombre : '';
}

// Helper: Crear HTML del módulo
const createModuleHTML = (moduleId, moduleNumber) => `
    <div class="module-card" id="${moduleId}">
        <div class="module-header">
            <h4>
                <i class="fas fa-folder"></i>
                <span class="module-title" data-module-id="${moduleId}">Módulo ${moduleNumber}</span>
            </h4>
            <div class="module-actions">
                <button class="btn btn-icon btn-sm btn-secondary btn-add-evaluation" 
                        data-module-id="${moduleId}" 
                        title="Agregar evaluación">
                    <i class="fas fa-plus-circle"></i>
                </button>
                <button class="btn btn-icon btn-sm btn-danger btn-remove-module" 
                        data-module-id="${moduleId}" 
                        title="Eliminar módulo">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
        <div class="module-body">
            <div class="grid-2">
                <div class="form-group">
                    <label class="form-label">Nombre del Módulo <span class="required">*</span></label>
                    <input type="text" 
                           class="form-input module-name" 
                           data-module-id="${moduleId}"
                           placeholder="Ej: Introducción a Python">
                </div>
                <div class="form-group">
                    <label class="form-label">Orden <span class="required">*</span></label>
                    <input type="number" 
                           class="form-input module-order" 
                           data-module-id="${moduleId}"
                           min="1" 
                           value="${moduleNumber}">
                </div>
            </div>
            
            <div class="evaluations-section">
                <h5><i class="fas fa-clipboard-check"></i> Evaluaciones</h5>
                <div class="evaluations-list" id="evaluations_${moduleId}">
                    <div class="empty-state" style="padding: 1rem;">
                        <i class="fas fa-clipboard-list"></i>
                        <p>No hay evaluaciones en este módulo</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
`;

const addModule = () => {
    moduleCounter++;
    const moduleId = `module_${moduleCounter}`;
    
    // Ocultar mensaje de "no hay módulos"
    const noModulesMessage = document.getElementById('noModulesMessage');
    if (noModulesMessage) {
        noModulesMessage.style.display = 'none';
    }
    
    // Crear y agregar módulo al DOM
    const moduleHTML = createModuleHTML(moduleId, moduleCounter);
    document.getElementById('modulosContainer').insertAdjacentHTML('beforeend', moduleHTML);
    
    // Inicializar array de evaluaciones para este módulo
    evaluations[moduleId] = [];
    
    // Guardar referencia del módulo
    modules.push({
        id: moduleId,
        nombre: '',
        orden: moduleCounter
    });
    
    // Agregar event listeners
    attachModuleEventListeners(moduleId);
}

// cuando cambia el nombre
const updateModuleTitle = (moduleId, newName) => {
    const titleElement = document.querySelector(`.module-title[data-module-id="${moduleId}"]`);
    if (titleElement) {
        titleElement.textContent = newName || `Módulo ${moduleId.split('_')[1]}`;
    }
    
    // Actualizar en el array de módulos
    const module = modules.find(m => m.id === moduleId);
    if (module) {
        module.nombre = newName;
    }
}

const removeModule = moduleId => {
    // Confirmar eliminación
    if (!confirm('¿Estás seguro de eliminar este módulo? Se perderán todas las evaluaciones asociadas.')) {
        return;
    }
    
    // Eliminar del DOM
    const moduleElement = document.getElementById(moduleId);
    if (moduleElement) {
        moduleElement.remove();
    }
    
    // Eliminar del array de módulos
    modules = modules.filter(m => m.id !== moduleId);
    
    // Eliminar evaluaciones asociadas
    delete evaluations[moduleId];
    
    // Mostrar mensaje si no hay módulos
    if (modules.length === 0) {
        const noModulesMessage = document.getElementById('noModulesMessage');
        if (noModulesMessage) {
            noModulesMessage.style.display = 'block';
        }
    }
}

// Adjuntar event listeners a un módulo
const attachModuleEventListeners = moduleId => {
    // Botón de eliminar módulo
    const $removeBtn = document.querySelector(`.btn-remove-module[data-module-id="${moduleId}"]`);
    $removeBtn.addEventListener('click', () => removeModule(moduleId));
    
    // Botón de agregar evaluación
    const $addEvalBtn = document.querySelector(`.btn-add-evaluation[data-module-id="${moduleId}"]`);
    $addEvalBtn.addEventListener('click', () => addEvaluation(moduleId));
    
    // Input de nombre del módulo
    const $nameInput = document.querySelector(`.module-name[data-module-id="${moduleId}"]`);
    $nameInput.addEventListener('input', e => updateModuleTitle(moduleId, e.target.value));
    
}

// === EVALUACIONES ===

const addEvaluation = moduleId => {
    evaluationCounter++;
    const evalId = `eval_${evaluationCounter}`;
    
    // Crear HTML de la evaluación
    const evalHTML = `
        <div class="evaluation-item" id="${evalId}">
            <div class="evaluation-info">
                <h5>Nueva Evaluación</h5>
                <p>Descripción no especificada</p>
            </div>
            <div class="evaluation-actions">
                <span class="evaluation-score">0.00 pts</span>
                <button class="btn btn-icon btn-sm btn-edit-eval" 
                        data-module-id="${moduleId}" 
                        data-eval-id="${evalId}" 
                        title="Editar evaluación">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-icon btn-sm btn-danger btn-remove-eval" 
                        data-module-id="${moduleId}" 
                        data-eval-id="${evalId}" 
                        title="Eliminar evaluación">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
    
    // Agregar al contenedor del módulo
    const evaluationsContainer = document.getElementById(`evaluations_${moduleId}`);
    const emptyState = evaluationsContainer.querySelector('.empty-state');
    if (emptyState) emptyState.style.display = 'none';
    
    evaluationsContainer.insertAdjacentHTML('beforeend', evalHTML);
    
    // Agregar event listeners a los botones
    attachEvaluationEventListeners(moduleId, evalId);
    
    // Abrir modal de edición
    editEvaluation(moduleId, evalId);
}

const saveEvaluation = (moduleId, evalId) => {
    const nombre = document.getElementById('evalNombre').value.trim();
    const descripcion = document.getElementById('evalDescripcion').value.trim();
    const puntuacion = parseFloat(document.getElementById('evalPuntuacion').value);
    
    if (!nombre) {
        alert('Por favor ingresa el nombre de la evaluación');
        return;
    }
    
    if (!puntuacion || puntuacion < 1 || puntuacion > 20) {
        alert('La puntuación máxima debe estar entre 1.00 y 20.00');
        return;
    }
    
    // Actualizar elemento en el DOM
    const evalElement = document.getElementById(evalId);
    if (evalElement) {
        evalElement.querySelector('h5').textContent = nombre;
        evalElement.querySelector('p').textContent = descripcion || 'Sin descripción';
        evalElement.querySelector('.evaluation-score').textContent = `${puntuacion.toFixed(2)} pts`;
    }
    
    // Guardar en el array de evaluaciones
    if (!evaluations[moduleId]) evaluations[moduleId] = [];
    
    const existingIndex = evaluations[moduleId].findIndex(e => e.id === evalId);
    const evalData = {
        id: evalId,
        nombre: nombre,
        descripcion: descripcion,
        puntuacion_max: puntuacion
    };
    
    existingIndex >= 0 
    ? evaluations[moduleId][existingIndex] = evalData 
    : evaluations[moduleId].push(evalData);
    
    closeEvalModal();
}

const editEvaluation = (moduleId, evalId) => {
    const evalModalHTML = `
        <div class="modal-overlay active" id="evalModal">
            <div class="modal" style="max-width: 500px;">
                <div class="modal-header">
                    <h3 class="modal-title">
                        <i class="fas fa-clipboard-check"></i> Configurar Evaluación
                    </h3>
                    <button class="modal-close" onclick="closeEvalModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body" style="padding: 2rem;">
                    <div class="form-group">
                        <label class="form-label">Nombre de la Evaluación <span class="required">*</span></label>
                        <input type="text" class="form-input" id="evalNombre" 
                                placeholder="Ej: Examen Parcial, Quiz 1, Tarea">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Descripción</label>
                        <textarea class="form-textarea" id="evalDescripcion" 
                                    placeholder="Describe el contenido de la evaluación..."></textarea>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Puntuación Máxima <span class="required">*</span></label>
                        <input type="number" class="form-input" id="evalPuntuacion" 
                                min="1.00" max="20.00" step="0.01" value="20.00">
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="closeEvalModal()">
                        Cancelar
                    </button>
                    <button class="btn btn-primary" onclick="saveEvaluation('${moduleId}', '${evalId}')">
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    `;

    // Agregar modal al DOM
    document.body.insertAdjacentHTML('beforeend', evalModalHTML);

    // Cargar datos existentes si los hay
    const existingEval = evaluations[moduleId]?.find(e => e.id === evalId);
    if (existingEval) {
        document.getElementById('evalNombre').value = existingEval.nombre || '';
        document.getElementById('evalDescripcion').value = existingEval.descripcion || '';
        document.getElementById('evalPuntuacion').value = existingEval.puntuacion_max || '20.00';
    }
}

const closeEvalModal = () => {
    const evalModal = document.getElementById('evalModal');
    evalModal.remove();
}

const removeEvaluation = (evaluationId, moduleId) => {
    const evaluationElement = document.getElementById(evaluationId);
    evaluationElement.remove();
    
    // Eliminar del array
    if (evaluations[moduleId]) {
        evaluations[moduleId] = evaluations[moduleId].filter(e => e.id !== evaluationId);
        
        // Mostrar mensaje cuando se elimina la última evaluación de un módulo
        if (evaluations[moduleId].length === 0) {
            const evaluationsContainer = document.getElementById(`evaluations_${moduleId}`);
            const emptyState = evaluationsContainer.querySelector('.empty-state');
            
            emptyState.style.display = 'block';
        }
    }
}

// Adjuntar event listeners a una evaluación
const attachEvaluationEventListeners = (moduleId, evalId) => {
    // Botón de editar evaluación
    const $editBtn = document.querySelector(`.btn-edit-eval[data-eval-id="${evalId}"]`);
    
    $editBtn.addEventListener('click', e => {
        e.stopPropagation(); 
        editEvaluation(moduleId, evalId);
    });
    
    // Botón de eliminar evaluación
    const $removeBtn = document.querySelector(`.btn-remove-eval[data-eval-id="${evalId}"]`);
    
    $removeBtn.addEventListener('click', e => {
        e.stopPropagation(); 
        removeEvaluation(evalId, moduleId);
    });
}

const buildCursoData = () => {
    const tieneProyecto = document.getElementById('tieneProyecto').checked;
    
    const cursoData = {
        nombre: document.getElementById('cursoNombre').value.trim(),
        descripcion: document.getElementById('cursoDescripcion').value.trim(),
        estado: document.getElementById('cursoEstado').value,
        modulos: modules.map(module => ({
            nombre: module.nombre,
            orden: module.orden,
            evaluaciones: evaluations[module.id] || []
        }))
    };
    
    if (tieneProyecto) {
        cursoData.proyecto = {
            nombre: document.getElementById('proyectoNombre').value.trim(),
            descripcion: document.getElementById('proyectoDescripcion').value.trim(),
            puntuacion_max: parseFloat(document.getElementById('proyectoPuntuacion').value),
            es_grupal: document.getElementById('proyectoTipo').value === 'true'
        };
    }
    
    return cursoData;
}

// TODO: Eliminar cuando el servicio exista
const saveCourseService = cursoData => {
    console.log('Llamando servicio de curso', cursoData);
    alert('Curso creado exitosamente (ver datos en consola)');
    console.log('JSON para enviar a la API:', JSON.stringify(cursoData, null, 2));
}

const saveCourse = () => {
    if (!validateCurrentStep()) return;

    const cursoData = buildCursoData();

    saveCourseService(cursoData);

    hideModal();
}

// Exponer solo closeEvalModal a window porque se usa en el HTML del modal
window.closeEvalModal = closeEvalModal;
window.saveEvaluation = saveEvaluation;

const initCreateCourseModal = () => {
    $btnNuevoCurso.addEventListener('click', showModal);
    $btnHideModal.addEventListener('click', hideModal);
    $btnCancelar.addEventListener('click', hideModal);
    $btnAnterior.addEventListener('click', previousStep);
    $btnSiguiente.addEventListener('click', nextStep);
    $btnGuardar.addEventListener('click', saveCourse);
    
    $btnAgregarModulo.addEventListener('click', addModule);
    
    // Toggle de proyecto final
    $tieneProyectoCheckbox.addEventListener('change', e => {
        $proyectoFields.style.display = e.target.checked ? 'block' : 'none';
    });
}

export default initCreateCourseModal;