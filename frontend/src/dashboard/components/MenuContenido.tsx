import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Collapse from "@mui/material/Collapse";
import Typography from "@mui/material/Typography"; // <--- NUEVO: Importación necesaria para estilizar el texto seguro
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";

// Iconos existentes
import FlightTakeoffRoundedIcon from "@mui/icons-material/FlightTakeoffRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";

// Iconos para el administrador
import PersonAddRoundedIcon from "@mui/icons-material/PersonAddRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import BusinessIcon from "@mui/icons-material/Business";
import CategoryIcon from "@mui/icons-material/Category";

// Nuevos iconos para el menú desplegable
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";

export default function MenuContenido() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Estado para controlar la apertura del menú de estadísticas
  const [openStats, setOpenStats] = useState(false);

  const handleStatsClick = () => {
    setOpenStats(!openStats);
  };

  const isAdmin = user?.rol === "Administrador";

  // Lista principal superior
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
      ];

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
      {/* MENU PRINCIPAL (SUPERIOR) */}
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

      {/* MENU SECUNDARIO DESPLEGABLE (INFERIOR - SOLO ADMIN) */}
      {isAdmin && (
        <List dense>
          {/* Botón Padre que abre/cierra el submenú */}
          <ListItem disablePadding sx={{ display: "block" }}>
            <ListItemButton onClick={handleStatsClick}>
              <ListItemIcon>
                <BarChartRoundedIcon />
              </ListItemIcon>
              <ListItemText primary="Estadísticas" />
              {openStats ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>

          {/* Contenedor colapsable animado */}
          <Collapse in={openStats} timeout="auto" unmountOnExit>
            <List component="div" disablePadding dense>
              {/* Opción 1: Estadísticas Generales */}
              <ListItemButton
                selected={location.pathname === "/admin/estadisticas/generales"}
                onClick={() => navigate("/admin/estadisticas/generales")}
                sx={{
                  pl: 2,
                  py: 0.5,
                }}
              >
                <ListItemIcon
                  sx={{ minWidth: 34, display: "flex", alignItems: "center" }}
                >
                  <BarChartRoundedIcon sx={{ fontSize: 20 }} />
                </ListItemIcon>

                <ListItemText
                  primary={
                    <Typography
                      sx={{
                        fontSize: "0.85rem",
                        fontWeight:
                          location.pathname === "/admin/estadisticas/generales"
                            ? 600
                            : 400,
                        lineHeight: 1.2,
                      }}
                    >
                      Estadísticas Generales
                    </Typography>
                  }
                />
              </ListItemButton>

              {/* Opción 2: Estadísticas de Usuarios */}
              <ListItemButton
                selected={location.pathname === "/admin/estadisticas/usuarios"}
                onClick={() => navigate("/admin/estadisticas/usuarios")}
                sx={{
                  pl: 2,
                  py: 0.5,
                }}
              >
                <ListItemIcon
                  sx={{ minWidth: 34, display: "flex", alignItems: "center" }}
                >
                  <PeopleAltRoundedIcon sx={{ fontSize: 20 }} />
                </ListItemIcon>

                <ListItemText
                  primary={
                    <Typography
                      sx={{
                        fontSize: "0.85rem",
                        fontWeight:
                          location.pathname === "/admin/estadisticas/usuarios"
                            ? 600
                            : 400,
                        lineHeight: 1.2,
                      }}
                    >
                      Estadísticas de Usuarios
                    </Typography>
                  }
                />
              </ListItemButton>
            </List>
          </Collapse>
        </List>
      )}
    </Stack>
  );
}
