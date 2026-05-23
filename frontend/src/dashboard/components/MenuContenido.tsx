import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// Iconos existentes
import FlightTakeoffRoundedIcon from "@mui/icons-material/FlightTakeoffRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import FactCheckRoundedIcon from "@mui/icons-material/FactCheckRounded";

// Iconos para el administrador
import PersonAddRoundedIcon from "@mui/icons-material/PersonAddRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import BusinessIcon from "@mui/icons-material/Business";
import CategoryIcon from "@mui/icons-material/Category";

export default function MenuContenido() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Definimos los menús según el rol
  const isAdmin = user?.rol === "Administrador";

  const mainListItems = isAdmin
    ? [
        {
          text: "Listar Viáticos",
          icon: <ReceiptLongRoundedIcon />,
          path: "/viaticos",
        },
        {
          text: "Crear Usuario",
          icon: <PersonAddRoundedIcon />,
          path: "/admin/crear-usuario",
        },
        {
          text: "Crear Departamento",
          icon: <BusinessIcon />,
          path: "/admin/crear-departamento",
        },
        {
          text: "Crear Categoría",
          icon: <CategoryIcon />,
          path: "/admin/crear-categoria",
        },
      ]
    : [
        {
          text: "Mis Solicitudes",
          icon: <ReceiptLongRoundedIcon />,
          path: "/viaticos",
        },
        {
          text: "Crear Viático",
          icon: <FlightTakeoffRoundedIcon />,
          path: "/crear",
        },
        {
          text: "Aprobaciones",
          icon: <FactCheckRoundedIcon />,
          path: "/aprobaciones",
        },
      ];

  // El menú inferior ahora solo contiene Estadísticas y solo se muestra al Admin
  const secondaryListItems = isAdmin
    ? [
        {
          text: "Estadísticas",
          icon: <BarChartRoundedIcon />,
          path: "/admin/estadisticas",
        },
      ]
    : [];

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
      <List dense>
        {mainListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Renderizamos la lista secundaria solo si hay elementos (ej. para el Admin) */}
      {secondaryListItems.length > 0 && (
        <List dense>
          {secondaryListItems.map((item, index) => (
            <ListItem key={index} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => navigate(item.path)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}
    </Stack>
  );
}
