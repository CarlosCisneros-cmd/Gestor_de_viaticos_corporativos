import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";

// Iconos
import FlightTakeoffRoundedIcon from "@mui/icons-material/FlightTakeoffRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import FactCheckRoundedIcon from "@mui/icons-material/FactCheckRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";

interface MenuContenidoProps {
  vistaActual: string;
  setVistaActual: (vista: string) => void;
}

export default function MenuContenido({
  vistaActual,
  setVistaActual,
}: MenuContenidoProps) {
  // Elementos principales del empleado vinculados a un identificador ('listar' o 'crear')
  const mainListItems = [
    {
      text: "Mis Solicitudes",
      icon: <ReceiptLongRoundedIcon />,
      idVista: "listar",
    },
    {
      text: "Crear Viático",
      icon: <FlightTakeoffRoundedIcon />,
      idVista: "crear",
    },
    {
      text: "Aprobaciones",
      icon: <FactCheckRoundedIcon />,
      idVista: "aprobaciones",
    },
  ];

  const secondaryListItems = [
    { text: "Configuración", icon: <SettingsRoundedIcon />, idVista: "config" },
    { text: "Acerca de", icon: <InfoRoundedIcon />, idVista: "about" },
  ];

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
      <List dense>
        {mainListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              // Si el id de la vista coincide, se sombrea azul automáticamente
              selected={vistaActual === item.idVista}
              onClick={() => setVistaActual(item.idVista)}
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
              selected={vistaActual === item.idVista}
              onClick={() => setVistaActual(item.idVista)}
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
