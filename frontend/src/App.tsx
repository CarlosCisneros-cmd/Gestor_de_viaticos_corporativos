import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import Login from "./vistas/Login";
import Departamentos from "./vistas/Departamentos";
import Categorias from "./vistas/CrearCategoria";
import Usuarios from "./vistas/Usuarios";
import EstadisticasGastos from "./vistas/EstadisticasGastos"; // 👈 1. IMPORTAMOS LA NUEVA VISTA

export default function App(props: { disableCustomTheme?: boolean }) {
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/*"
            element={
              <Box sx={{ display: "flex", width: "100vw", height: "100vh" }}>
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
                      sx={{
                        width: "100%",
                        maxWidth: { sm: "100%", md: "1700px" },
                      }}
                    >
                      <Header />

                      <Box sx={{ mt: 4, width: "100%" }}>
                        <Routes>
                          <Route
                            path="/"
                            element={<Navigate to="/viaticos" replace />}
                          />
                          <Route
                            path="/viaticos"
                            element={<ListarViaticos />}
                          />
                          <Route path="/crear" element={<IngresarViatico />} />
                          <Route
                            path="/viaticos/:id/gastos"
                            element={<DetalleGastos />}
                          />

                          <Route
                            path="/admin/crear-departamento"
                            element={<Departamentos />}
                          />
                          <Route
                            path="/admin/crear-categoria"
                            element={<Categorias />}
                          />
                          <Route
                            path="/admin/crear-usuario"
                            element={<Usuarios />}
                          />

                          {/* 📊 2. VINCULAMOS LA RUTA CON EL MENÚ LATERAL */}
                          <Route
                            path="/admin/estadisticas"
                            element={<EstadisticasGastos />}
                          />

                          <Route
                            path="*"
                            element={<Navigate to="/viaticos" replace />}
                          />
                        </Routes>
                      </Box>
                    </Box>
                  </Stack>
                </Box>
              </Box>
            }
          />
        </Routes>
      </BrowserRouter>
    </AppTheme>
  );
}
