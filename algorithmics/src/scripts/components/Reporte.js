const iniciarFuncionalidadReporte = () => {
    document.readyState === 'loading' 
        ? document.addEventListener('DOMContentLoaded', initReportes) 
        : setTimeout(initReportes, 100);
};

// Generate report with the specified type
function generarReporte(tipo) {
    const $previewContent = document.getElementById('previewContent');
    const $reportPreview = document.getElementById('reportPreview');
    const $loadingIndicator = document.getElementById('loadingIndicator');

    // Show loading indicator
    if ($loadingIndicator) $loadingIndicator.style.display = 'flex';
    
    // Simulate generation time
    setTimeout(() => {
        // Hide loading indicator
        if ($loadingIndicator) $loadingIndicator.style.display = 'none';
        
        // Vista Previa
        const titulos = {
            'usuarios': 'Reporte de Usuarios',
            'cursos': 'Reporte de Cursos',
            'olimpiadas': 'Reporte de Olimpiadas',
            'actividad': 'Reporte de Actividad',
            'inscripciones': 'Reporte de Inscripciones'
        };
        
        const contenido = `
            <h2>${titulos[tipo] || 'Reporte'}</h2>
            <p><strong>Fecha de Generación:</strong> ${new Date().toLocaleString()}</p>
            
            <div class="report-preview-content">
                <p>Este es un ejemplo del contenido que se incluiría en el reporte de ${tipo}.</p>
                <p>En la versión final, aquí se mostraría el reporte generado con los datos reales.</p>
                
                <div style="margin-top: 1.5rem; padding: 1rem; background: var(--primary-50); border-radius: 0.5rem;">
                    <p><strong>Nota:</strong> Esta es una vista previa. El PDF generado contendrá información completa y detallada.</p>
                </div>
            </div>
        `;
        
        $previewContent.innerHTML = contenido;
        $reportPreview.classList.add('active');
        $reportPreview.scrollIntoView({ behavior: 'smooth' });
    }, 1000);
}

// Simulate PDF download
function descargarPDF() {
    alert('El reporte se está descargando como PDF...\n\nNombre del archivo: reporte_algorithmics_' + new Date().getTime() + '.pdf\nTamaño estimado: 1.2 MB');
    // Actual implementation would use jsPDF or make a server request here
    // window.open('/generar-pdf?tipo=' + tipoReporteActual, '_blank');
}

function initReportes() {
    // Elementos del DOM
    const $botonesGenerar = document.querySelectorAll('.btn-generar-reporte');
    const $btnDescargar = document.getElementById('btnDescargar');
    const $btnCerrarPreview = document.getElementById('btnCerrarPreview');
    const $reportPreview = document.getElementById('reportPreview');
    
    // Agregar eventos a cada botón de generar
    $botonesGenerar.forEach(boton => {
        boton.addEventListener('click', () => {
            const tipoReporte = boton.getAttribute('data-report');

            if(tipoReporte) generarReporte(tipoReporte);
        });
    });
    
    $btnDescargar.addEventListener('click', descargarPDF);
    
    // Cerrar vista previa
    $btnCerrarPreview.addEventListener('click', () => {
        $reportPreview.classList.remove('active');
    });
}

export default iniciarFuncionalidadReporte;
