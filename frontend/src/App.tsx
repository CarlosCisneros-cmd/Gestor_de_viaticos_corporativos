import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"; // IMPORTANTE
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import CssBaseline from "@mui/material/CssBaseline";
import AppTheme from "./shared-theme/AppTheme";

// Componentes
import AppNavbar from "./dashboard/components/AppNavbar";
import Header from "./dashboard/components/Header";
import SideMenu from "./dashboard/components/MenuLateral";

// Vistas
import ListarViaticos from "./vistas/ListarViaticos";
import IngresarViatico from "./vistas/IngresarViatico";
import DetalleGastos from "./vistas/DetalleGastos";

export default function App(props: { disableCustomTheme?: boolean }) {
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <BrowserRouter>
        {" "}
        {/* <--- ENVOLVEMOS TODO AQUÍ */}
        <Box sx={{ display: "flex", width: "100vw", height: "100vh" }}>
          {/* El Sidebar ahora manejará navegación, no estados */}
          <SideMenu />
          <AppNavbar />

          <Box
            component="main"
            sx={{
              flexGrow: 1,
              height: "100vh",
              overflow: "auto",
              display: "flex",
              flexDirection: "column",
              bgcolor: "background.default",
            }}
          >
            <Stack
              spacing={3}
              sx={{
                alignItems: "center",
                mx: 3,
                pb: 5,
                mt: { xs: 8, md: 3 },
                width: "auto",
              }}
            >
              <Box
                sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}
              >
                <Header />

                {/* AQUÍ DEFINIMOS TUS RUTAS REALES */}
                <Box sx={{ mt: 4, width: "100%" }}>
                  <Routes>
                    <Route path="/" element={<Navigate to="/viaticos" />} />
                    <Route path="/viaticos" element={<ListarViaticos />} />
                    <Route path="/crear" element={<IngresarViatico />} />
                    <Route
                      path="/viaticos/:id/gastos"
                      element={<DetalleGastos />}
                    />
                  </Routes>
                </Box>
              </Box>
            </Stack>
          </Box>
        </Box>
      </BrowserRouter>
    </AppTheme>
  );
}
