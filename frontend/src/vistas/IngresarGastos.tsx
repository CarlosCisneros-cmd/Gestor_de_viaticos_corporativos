import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  Typography,
  InputAdornment,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

interface Props {
  open: boolean;
  onClose: () => void;
  gastoAEditar?: any | null;
  rol: string;
  idViatico: string;
  onGuardado: () => void;
}

export default function IngresarGasto({
  open,
  onClose,
  gastoAEditar,
  rol,
  idViatico,
  onGuardado,
}: Props) {
  const [formData, setFormData] = useState({
    descripcion: "",
    monto: "",
    observacion: "",
    fecha: "",
    estado: "Pendiente",
    id_categoria: "",
    archivo: null as File | null,
  });

  const [categorias, setCategorias] = useState<any[]>([]);

  //  SOLUCIÓN BLINDADA PARA EL ROL: Pasamos a minúsculas y comparamos de forma segura
  const userRol = rol?.toLowerCase() || "usuario";
  // Si NO es administrador, significa que es un empleado común ingresando o editando sus gastos
  const isEmpleado = userRol !== "administrador";
  const esEdicion = Boolean(gastoAEditar);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await fetch("http://localhost:3977/api/categorias");
        if (!res.ok) throw new Error("Error en el servidor");

        const data = await res.json();
        setCategorias(data);
      } catch (error) {
        console.error("No se pudieron cargar las categorías:", error);
        setCategorias([{ id_categoria: 1, nombre_categoria: "Viaje" }]);
      }
    };
    fetchCategorias();
  }, []);

  useEffect(() => {
    if (gastoAEditar && open) {
      setFormData({
        descripcion: gastoAEditar.descripcion || "",
        monto: gastoAEditar.monto?.toString() || "",
        observacion: gastoAEditar.observacion || "",
        fecha: gastoAEditar.fecha_gasto
          ? gastoAEditar.fecha_gasto.toString().split("T")[0]
          : "",
        estado: gastoAEditar.estado_gasto || "Pendiente",
        id_categoria: gastoAEditar.id_categoria || "",
        archivo: null,
      });
    } else if (open) {
      setFormData({
        descripcion: "",
        monto: "",
        observacion: "",
        fecha: "",
        estado: "Pendiente",
        id_categoria: "",
        archivo: null,
      });
    }
  }, [gastoAEditar, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, archivo: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const bodyData = {
      id_gasto: esEdicion ? gastoAEditar.id_gasto : undefined,
      descripcion: formData.descripcion,
      monto: Number(formData.monto),
      fecha_gasto: formData.fecha,
      estado_gasto: formData.estado,
      observacion: formData.observacion,
      id_viatico: Number(idViatico),
      id_categoria: Number(formData.id_categoria),
    };

  // Imprimimos en consola para que verifiques qué estás mandando al backend en tus pruebas
  console.log("Enviando bodyData:", bodyData);

    try {
      const url = esEdicion
        ? `http://localhost:3977/api/gastos/${gastoAEditar.id_gasto}`
        : `http://localhost:3977/api/gastos`;

      const response = await fetch(url, {
        method: esEdicion ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      });

      if (response.ok) {
        onGuardado();
        onClose();
      } else {
        const errorData = await response.json();
        alert(
          `Error al guardar: ${errorData.message || "Problema en el servidor"}`,
        );
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      alert("Error de conexión con el servidor.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: "bold", pb: 1 }}>
        {esEdicion
          ? isEmpleado
            ? "Editar Gasto"
            : "Asignar Estado (Modo Administrador)"
          : "Añadir Nuevo Gasto"}
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 4,
              pt: 1,
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <TextField
                fullWidth
                select
                label="Categoría del gasto"
                name="id_categoria"
                value={formData.id_categoria}
                onChange={handleChange}
                required
                disabled={!isEmpleado} // Se bloquea si es Administrador
                slotProps={{ inputLabel: { shrink: true } }}
              >
                {categorias.map((cat) => (
                  <MenuItem key={cat.id_categoria} value={cat.id_categoria}>
                    {cat.nombre_categoria}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                fullWidth
                label="Descripción del gasto"
                name="descripcion"
                multiline
                value={formData.descripcion}
                rows={2}
                onChange={handleChange}
                required
                disabled={!isEmpleado} // Se bloquea si es Administrador
                slotProps={{
                  inputLabel: { shrink: true },
                }}
                sx={{
                  "& .MuiInputBase-root": {
                    height: "auto",
                    minHeight: "10px",
                    alignItems: "flex-start",
                    padding: "12px 14px",
                  },
                }}
              />
              
              <TextField
                fullWidth
                label="Monto"
                name="monto"
                type="number"
                value={formData.monto}
                onChange={handleChange}
                required
                disabled={!isEmpleado} // Se bloquea si es Administrador
                placeholder="0.00"
                slotProps={{
                  inputLabel: { shrink: true },
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  },
                }}
              />

              {/* El botón de subir archivo solo aparece si quien opera es el empleado */}
              {isEmpleado && (
                <Box
                  sx={{
                    border: "2px dashed",
                    borderColor: "divider",
                    borderRadius: 2,
                    p: 2,
                    textAlign: "center",
                    bgcolor: "background.default",
                    mt: 1,
                  }}
                >
                  <input
                    accept="image/*,application/pdf"
                    style={{ display: "none" }}
                    id="boton-subir-archivo"
                    type="file"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="boton-subir-archivo">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<CloudUploadIcon />}
                      sx={{ mb: 1 }}
                    >
                      Subir comprobante
                    </Button>
                  </label>
                  <Typography
                    variant="caption"
                    sx={{ display: "block" }}
                    color="text.secondary"
                  >
                    {formData.archivo
                      ? `Archivo: ${formData.archivo.name}`
                      : "Soporta JPG, PNG o PDF"}
                  </Typography>
                </Box>
              )}
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <TextField
                fullWidth
                label="Fecha de gasto"
                name="fecha"
                type="date"
                value={formData.fecha}
                onChange={handleChange}
                required
                disabled={!isEmpleado} // Se bloquea si es Administrador
                slotProps={{ inputLabel: { shrink: true } }}
              />

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
                  p: 2,
                  bgcolor: "action.hover",
                  borderRadius: 1,
                }}
              >
                <TextField
                  fullWidth
                  select
                  label="Estado de aprobación"
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  disabled={isEmpleado} // Se DESBLOQUEA si es Administrador
                  slotProps={{ inputLabel: { shrink: true } }}
                >
                  <MenuItem value="Pendiente">Pendiente</MenuItem>
                  <MenuItem value="Aceptado">Aceptado</MenuItem>
                  <MenuItem value="Rechazado">Rechazado</MenuItem>
                </TextField>

                <TextField
                  fullWidth
                  label="Observaciones"
                  name="observacion"
                  value={formData.observacion}
                  onChange={handleChange}
                  multiline
                  rows={2}
                  maxRows={2}
                  disabled={isEmpleado} // Se DESBLOQUEA si es Administrador
                  placeholder={
                    isEmpleado
                      ? "Sin observaciones de administración"
                      : "Escribe el motivo del cambio de estado..."
                  }
                  slotProps={{ inputLabel: { shrink: true } }}
                  sx={{
                    "& .MuiInputBase-root": {
                      height: "auto",
                      minHeight: "10px",
                      alignItems: "flex-start",
                      padding: "12px 14px",
                    },
                  }}
                />
              </Box>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2, px: 3 }}>
          <Button
            onClick={onClose}
            variant="outlined"
            color="inherit"
            startIcon={<CloseIcon />}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            startIcon={<CheckIcon />}
          >
            {esEdicion 
              ? isEmpleado 
                ? "Guardar Cambios" 
                : "Confirmar Evaluación" 
              : "Guardar Gasto"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}