import React, { useState } from "react";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  Alert,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff, Email } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login: React.FC = () => {
  const [correo, setCorreo] = useState<string>("");
  const [contraseña, setContraseña] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3977/api/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, contraseña }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Error de autenticación. Verifica tus credenciales.",
        );
      }

      login(data);

      if (data.rol === "Administrador") {
        navigate("/admin/dashboard");
      } else {
        navigate("/viaticos");
      }
    } catch (err: any) {
      setError(err.message || "No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "background.default",
        zIndex: 9999,
        p: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 420,
          width: "100%",
          boxShadow: 6,
          borderRadius: 3,
          p: 1,
        }}
      >
        <CardContent>
          {/* Encabezado del Sistema */}
          <Box sx={{ mb: 3, textAlign: "center" }}>
            <Typography
              variant="h4"
              component="h1"
              color="primary"
              gutterBottom
              sx={{ fontWeight: "bold" }} // 1. CORREGIDO: fontWeight movido aquí
            >
              Gestor de Viáticos
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Por favor, introduce tus credenciales para ingresar
            </Typography>
          </Box>

          {/* Alerta de Errores */}
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {/* Formulario */}
          <form onSubmit={handleLogin}>
            <TextField
              label="Correo Electrónico"
              type="email"
              fullWidth
              margin="normal"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
              disabled={loading}
              // 2. CORREGIDO: Se cambió InputProps por slotProps.input
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <Email color="action" />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <TextField
              label="Contraseña"
              type={showPassword ? "text" : "password"}
              fullWidth
              margin="normal"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              required
              disabled={loading}
              // 3. CORREGIDO: Se cambió InputProps por slotProps.input
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="cambiar visibilidad de contraseña"
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              sx={{
                mt: 4,
                mb: 1,
                textTransform: "none",
                fontWeight: "bold",
                height: 48,
                borderRadius: 2,
              }}
            >
              {loading ? "Validando Credenciales..." : "Iniciar Sesión"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
