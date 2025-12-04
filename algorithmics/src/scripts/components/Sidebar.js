const $navItems = document.querySelectorAll('.nav-item');
const $panels = document.querySelectorAll('.panel');
const $pageTitle = document.querySelector('.page-title');

// Ejemplo: { 'dashboard': 'Dashboard', 'profile': 'Mi Perfil' } 
const Sidebar = titles => { 
  if (!titles || typeof titles !== 'object') {
    console.error('Sidebar: Se requiere un objeto de títulos válido.');
    return;
  }

  $navItems.forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();

      const $panelId = item.getAttribute('data-panel');

      // 1. Remover clase active de todos los items
      $navItems.forEach(nav => nav.classList.remove('active'));

      // 2. Añadir clase active al item clickeado
      item.classList.add('active'); 

      // 3. Ocultar todos los paneles
      $panels.forEach(panel => panel.classList.remove('active'));

      // 4. Mostrar el panel correspondiente (asegúrate de que existe el elemento)
      const targetPanel = document.getElementById($panelId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      } else {
        console.warn(`Panel con ID '${$panelId}' no encontrado.`);
      }

      // 5. Actualizar el título de la página usando el objeto 'titles' pasado
      $pageTitle.textContent = titles[$panelId] || 'Página';
    });
  });
};

export default Sidebar;
