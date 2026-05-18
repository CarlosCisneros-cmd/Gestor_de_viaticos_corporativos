import { useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import AppNavbar from "./dashboard/components/AppNavbar";
import Header from "./dashboard/components/Header";
import SideMenu from "./dashboard/components/MenuLateral";

// Nuestras Vistas
import ListarViaticos from "./vistas/ListarViaticos";
import IngresarViatico from "./vistas/IngresarViatico";

export default function App() {
  // Estado para saber qué vista renderizar: 'listar' o 'crear'
  const [vistaActual, setVistaActual] = useState<string>("listar");

  return (
    <Box sx={{ display: "flex", width: "100vw", height: "100vh" }}>
      {/* Barra Lateral fija */}
      <SideMenu setVistaActual={setVistaActual} vistaActual={vistaActual} />
      <AppNavbar />

      {/* Contenedor Principal Ajustado al Sistema Elástico de MUI */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: "100vh",
          overflow: "auto",
          backgroundColor: "background.default",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Stack
          spacing={3}
          sx={{
            alignItems: "center",
            mx: 3,
            pb: 5,
            mt: { xs: 8, md: 3 }, // Ajuste de margen superior dinámico
            width: "auto", // Deja que flexbox calcule el espacio real
          }}
        >
          {/* El Wrapper que fuerza a que tanto el Header como las vistas compartan el mismo ancho máximo */}
          <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
            <Header />

            <Box sx={{ mt: 4, width: "100%" }}>
              {/* Renderizado condicional según el botón presionado */}
              {vistaActual === "listar" && <ListarViaticos />}
              {vistaActual === "crear" && <IngresarViatico />}
              {vistaActual !== "listar" && vistaActual !== "crear" && (
                <Box sx={{ p: 3 }}>
                  <p>
                    Esta sección (Administración / Reportes) se habilitará más
                    adelante.
                  </p>
                </Box>
              )}
            </Box>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
