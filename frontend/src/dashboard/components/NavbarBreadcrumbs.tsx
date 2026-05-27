import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useLocation, Link as RouterLink } from "react-router-dom";

// 1. Diccionario para traducir las rutas de la URL a texto amigable
const nombresRutas: Record<string, string> = {
  viaticos: "Lista de Viáticos",
  crear: "Crear Solicitud",
  admin: "Administración",
  "crear-departamento": "Gestión de Departamentos",
  "crear-categoria": "Gestión de Categorías",
  "crear-usuario": "Gestión de Usuarios",
  estadisticas: "Analítica y Estadísticas",
  gastos: "Detalle de Gastos",
};

export default function NavbarBreadcrumbs() {
  const location = useLocation();

  // 1. Limpiamos la ruta aquí (UNA SOLA VEZ)
  // Filtramos espacios vacíos Y también filtramos los números (como el "2")
  const partesRuta = location.pathname
    .split("/")
    .filter((x) => x && isNaN(Number(x))); // Se eliminan los números aquí

  return (
    <Breadcrumbs
      aria-label="breadcrumb"
      separator={<NavigateNextIcon fontSize="small" />}
      sx={{ display: { xs: "none", sm: "flex" } }}
    >
      <Link component={RouterLink} underline="hover" color="inherit" to="/">
        Inicio
      </Link>

      {/* 2. Ahora el map recorre la lista ya limpia */}
      {partesRuta.map((parte, index) => {
        const esElUltimo = index === partesRuta.length - 1;
        const rutaHaciaAqui = `/${partesRuta.slice(0, index + 1).join("/")}`;
        const nombreBonito = nombresRutas[parte] || parte;

        return esElUltimo ? (
          <Typography
            key={parte}
            color="text.primary"
            sx={{ fontWeight: 600, textTransform: "capitalize" }}
          >
            {nombreBonito}
          </Typography>
        ) : (
          <Link
            key={parte}
            component={RouterLink}
            underline="hover"
            color="inherit"
            to={rutaHaciaAqui}
          >
            {nombreBonito}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
}
