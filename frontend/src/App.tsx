import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import CssBaseline from "@mui/material/CssBaseline";
import AppTheme from "./shared-theme/AppTheme";

// Componentes
import AppNavbar from "./dashboard/components/AppNavbar";
import Header from "./dashboard/components/Header";
import SideMenu from "./dashboard/components/MenuLateral";
import ProtectedRoute from "./components/ProtectedRoute"; // 👇 Nuestro Guardián

// Vistas
import ListarViaticos from "./vistas/ListarViaticos";
import IngresarViatico from "./vistas/IngresarViatico";
import DetalleGastos from "./vistas/DetalleGastos";
import Login from "./vistas/Login"; // 👇 Tu nuevo login en la carpeta vistas

export default function App(props: { disableCustomTheme?: boolean }) {
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <BrowserRouter>
        <Routes>
          {/* ========================================================= */}
          {/* 🔓 1. RUTAS PÚBLICAS (Pantalla Completa - Sin Menu Lateral) */}
          {/* ========================================================= */}
          <Route path="/login" element={<Login />} />
          <Route 
            path="/unauthorized" 
            element={
              <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <h2>🚫 403 - No tienes permisos para acceder a esta sección.</h2>
              </Box>
            } 
          />

          {/* ========================================================= */}
          {/* 🛡️ 2. RUTAS PROTEGIDAS (Envueltas en Seguridad y Estructura) */}
          {/* ========================================================= */}
          <Route element={<ProtectedRoute allowedRoles={["Usuario", "Administrador"]} />}>
            <Route
              path="/*"
              element={
                <Box sx={{ display: "flex", width: "100vw", height: "100vh" }}>
                  {/* El Sidebar y Navbar solo se renderizan si pasó el guardia */}
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
                      <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
                        <Header />

                        <Box sx={{ mt: 4, width: "100%" }}>
                          <Routes>
                            {/* Sub-Rutas de la Aplicación */}
                            <Route path="/" element={<Navigate to="/viaticos" replace />} />
                            <Route path="/viaticos" element={<ListarViaticos />} />
                            <Route path="/crear" element={<IngresarViatico />} />
                            <Route path="/viaticos/:id/gastos" element={<DetalleGastos />} />
                            
                            {/* Captura cualquier error de sub-ruta interna */}
                            <Route path="*" element={<Navigate to="/viaticos" replace />} />
                          </Routes>
                        </Box>

                      </Box>
                    </Stack>
                  </Box>
                </Box>
              }
            />
          </Route>

          {/* Si escriben cualquier ruta extraña afuera, los manda al Login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AppTheme>
  );
}
