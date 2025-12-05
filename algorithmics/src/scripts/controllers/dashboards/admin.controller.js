import Sidebar from "../../components/Sidebar.js";
import iniciarFuncionalidadReporte from "../../components/Reporte.js";  

import inicializarDropdownLogout from "../../Modals/LogoutModal.js";
import initCreateCourseModal from "../../Modals/CreateCourseModal.js";


const adminPanelTitles = {
  'dashboard': 'Dashboard Principal',
  'profile': 'Mi Perfil',
  'olympics': 'Gestión de Olimpiadas',
  'courses': 'Gestión de Cursos',
  'users': 'Gestión de Usuarios',       
  'reports': 'Generación de Reportes'    
};

Sidebar(adminPanelTitles);
iniciarFuncionalidadReporte();
inicializarDropdownLogout();
initCreateCourseModal();