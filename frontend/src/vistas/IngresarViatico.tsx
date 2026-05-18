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

export default function IngresarViatico() {
  // Estado para manejar los datos del formulario (basado en tu BD)
  const [formData, setFormData] = useState({
    descripcion_viatico: "",
    presupuesto_asignado: "",
    feacha_inicio: "",
    fecha_fin: "",
  });

  // Manejador de cambios en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Manejador del envío
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Datos a enviar al Backend:", formData);
    alert("Solicitud enviada correctamente (Simulación)");
  };

  const handleReset = () => {
    setFormData({
      descripcion_viatico: "",
      presupuesto_asignado: "",
      feacha_inicio: "",
      fecha_fin: "",
    });
  };

  return (
    // Forzamos a que el Box principal ocupe todo el ancho disponible sin restricciones
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

      {/* Agregamos width: '100%' explícito al Paper */}
      <Paper variant="outlined" sx={{ p: 4, borderRadius: 3, width: "100%" }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Descripción / Motivo */}
            <Grid size={12}>
              <TextField
                fullWidth
                label="Descripción o Motivo del Viático"
                name="descripcion_viatico"
                multiline
                rows={3}
                placeholder="Ej: Alimentación y combustible para la inspección de la semana..."
                value={formData.descripcion_viatico}
                onChange={handleChange}
                required
              />
            </Grid>

            {/* Fecha Inicio */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Fecha de Inicio"
                name="feacha_inicio"
                type="date"
                slotProps={{
                  inputLabel: { shrink: true },
                }}
                value={formData.feacha_inicio}
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
