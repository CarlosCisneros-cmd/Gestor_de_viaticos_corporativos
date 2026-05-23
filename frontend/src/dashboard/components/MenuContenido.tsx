import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Importamos el hook de auth

// Iconos existentes
import FlightTakeoffRoundedIcon from "@mui/icons-material/FlightTakeoffRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import FactCheckRoundedIcon from "@mui/icons-material/FactCheckRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";

// Iconos nuevos para el administrador
import PersonAddRoundedIcon from "@mui/icons-material/PersonAddRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";

export default function MenuContenido() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth(); // Obtenemos el usuario del contexto

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
          text: "Estadísticas",
          icon: <BarChartRoundedIcon />,
          path: "/admin/estadisticas",
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

  const secondaryListItems = [
    { text: "Configuración", icon: <SettingsRoundedIcon />, path: "/config" },
    { text: "Acerca de", icon: <InfoRoundedIcon />, path: "/about" },
  ];

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
    </Stack>
  );
}
