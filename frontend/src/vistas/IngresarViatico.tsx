import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  InputAdornment,
  Divider,
} from "@mui/material";

// Iconos
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import { useAuth } from "../context/AuthContext";

export default function IngresarViatico() {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    descripcion_Viatico: "",
    fecha_inicio: "",
    fecha_fin: "",
    presupuesto_asignado: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 3. Validación de seguridad básica
    if (!user || !user.id_Usuario) {
      alert(
        "Error: No se pudo identificar al usuario. Por favor, inicia sesión de nuevo.",
      );
      return;
    }

    try {
      const response = await fetch("http://localhost:3977/api/viaticos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Si tu backend requiere autenticación, aquí deberías enviar el token
          // "Authorization": `Bearer ${user.token}`
        },
        body: JSON.stringify({
          descripcion_Viatico: formData.descripcion_Viatico,
          fecha_inicio: formData.fecha_inicio,
          fecha_fin: formData.fecha_fin,
          presupuesto_asignado: parseFloat(formData.presupuesto_asignado),
          id_usuario: user.id_Usuario, // id dinamico
        }),
      });
      if (response.ok) {
        alert("¡Solicitud de viático enviada correctamente!");
        setFormData({
          descripcion_Viatico: "",
          fecha_inicio: "",
          fecha_fin: "",
          presupuesto_asignado: "",
        });
      } else {
        const errorData = await response.json();
        alert(`Error al guardar: ${errorData.message || "Revisa los datos"}`);
      }
    } catch (error) {
      console.error("Error en la petición:", error);
      alert("No se pudo conectar con el servidor.");
    }
  };
  const handleReset = () => {
    setFormData({
      descripcion_Viatico: "",
      fecha_inicio: "",
      fecha_fin: "",
      presupuesto_asignado: "",
    });
  };

  return (
    <Box sx={{ width: "100%", mt: 2 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Solicitar Nuevo Viático
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Complete la información del viático para enviarla a revisión por parte
          de administración.
        </Typography>
      </Box>

      <Paper
        variant="outlined"
        sx={{
          p: 4,
          borderRadius: 3,
          width: "100%",
          bgcolor: "background.paper",
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            "& .MuiInputLabel-root": {
              backgroundColor: "background.paper",
              px: 2,
              ml: -0.5,
              borderRadius: 1,
              border: "0.05px solid",
              borderColor: "divider",
            },
          }}
        >
          <Grid container spacing={3}>
            {/* Descripción / Motivo */}
            <Grid size={12}>
              <TextField
                fullWidth
                label="Descripción o Motivo del Viático"
                name="descripcion_Viatico"
                multiline
                rows={3}
                placeholder="Ej: Alimentación y combustible..."
                value={formData.descripcion_Viatico}
                onChange={handleChange}
                required
                slotProps={{
                  inputLabel: { shrink: true },
                }}
                sx={{
                  "& .MuiInputBase-root": {
                    height: "auto",
                    minHeight: "100px",
                    alignItems: "flex-start",
                    padding: "12px 14px",
                  },
                }}
              />
            </Grid>

            {/* Fecha Inicio */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Fecha de Inicio"
                name="fecha_inicio"
                type="date"
                slotProps={{
                  inputLabel: { shrink: true },
                }}
                value={formData.fecha_inicio}
                onChange={handleChange}
                required
              />
            </Grid>

            {/* Fecha Fin */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Fecha de Finalización"
                name="fecha_fin"
                type="date"
                slotProps={{
                  inputLabel: { shrink: true },
                }}
                value={formData.fecha_fin}
                onChange={handleChange}
                required
              />
            </Grid>

            {/* Presupuesto Estimado */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Presupuesto Estimado"
                name="presupuesto_asignado"
                type="number"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  },
                }}
                placeholder="0.00"
                value={formData.presupuesto_asignado}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid size={12}>
              <Divider sx={{ my: 1 }} />
            </Grid>

            {/* Botones de Acción */}
            <Grid
              size={12}
              sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}
            >
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<RestartAltRoundedIcon />}
                onClick={handleReset}
              >
                Limpiar
              </Button>
              <Button
                variant="contained"
                type="submit"
                color="primary"
                startIcon={<SaveRoundedIcon />}
                sx={{ px: 4 }}
              >
                Enviar Solicitud
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
}
