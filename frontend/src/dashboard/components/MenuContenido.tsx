import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import { useNavigate, useLocation } from "react-router-dom"; // IMPORTANTE

// Iconos
import FlightTakeoffRoundedIcon from "@mui/icons-material/FlightTakeoffRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import FactCheckRoundedIcon from "@mui/icons-material/FactCheckRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";

export default function MenuContenido() {
  const navigate = useNavigate();
  const location = useLocation(); // Hook para saber en qué ruta estamos

  const mainListItems = [
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
              // El botón se ilumina si la ruta actual coincide
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
