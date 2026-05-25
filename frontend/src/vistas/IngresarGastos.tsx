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
  CircularProgress,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DescriptionIcon from "@mui/icons-material/Description";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";

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
    observaciones: "",
    fecha: "",
    estado: "Pendiente",
    id_categoria: "",
    archivo: null as File | null,
  });

  const [categorias, setCategorias] = useState<any[]>([]);

  //ESTADOS PARA MANEJAR LAS EVIDENCIAS TRAÍDAS DE MONGO
  const [evidencias, setEvidencias] = useState<any[]>([]);
  const [cargandoEvidencias, setCargandoEvidencias] = useState(false);

  const userRol = rol?.toLowerCase() || "usuario";
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
        observaciones: gastoAEditar.observaciones || "",
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
        observaciones: "",
        fecha: "",
        estado: "Pendiente",
        id_categoria: "",
        archivo: null,
      });
    }
  }, [gastoAEditar, open]);

  // EFFECT PARA CARGAR LAS EVIDENCIAS CUANDO SE ABRE EL MODO EDICIÓN
  useEffect(() => {
    const obtenerEvidencias = async () => {
      if (esEdicion && gastoAEditar?.id_gasto && open) {
        setCargandoEvidencias(true);
        try {
          const res = await fetch(
            `http://localhost:3977/api/evidencias/gasto/${gastoAEditar.id_gasto}`,
          );
          if (res.ok) {
            const data = await res.json();
            setEvidencias(data);
          } else {
            console.error("Error al obtener las evidencias del backend");
          }
        } catch (error) {
          console.error("Error de conexión al obtener evidencias:", error);
        } finally {
          setCargandoEvidencias(false);
        }
      } else {
        // Limpiamos el estado si el modal se cierra o no es edición
        setEvidencias([]);
      }
    };

    obtenerEvidencias();
  }, [gastoAEditar, open, esEdicion]);

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
      observaciones: formData.observaciones,
      id_viatico: Number(idViatico),
      id_categoria: Number(formData.id_categoria),
    };

    console.log("Enviando bodyData a Postgres:", bodyData);

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
        let idGastoGenerado = esEdicion ? gastoAEditar.id_gasto : null;

        if (!esEdicion) {
          const dataGastoGuardado = await response.json();
          idGastoGenerado = dataGastoGuardado.id_gasto;
        }

        if (formData.archivo && idGastoGenerado) {
          const fileFormData = new FormData();
          fileFormData.append("file", formData.archivo);
          fileFormData.append("id_gasto", String(idGastoGenerado));
          fileFormData.append(
            "comentario",
            "Evidencia adjuntada desde el registro de gastos",
          );

          try {
            const responseEvidencia = await fetch(
              "http://localhost:3977/api/evidencias",
              {
                method: "POST",
                body: fileFormData,
              },
            );

            if (!responseEvidencia.ok) {
              const errorEvidencia = await responseEvidencia.json();
              alert(
                `Gasto guardado, pero no se pudo subir la evidencia: ${errorEvidencia.message}`,
              );
            }
          } catch (errEvidencia) {
            console.error(
              "Error de conexión al subir evidencia:",
              errEvidencia,
            );
            alert(
              "Gasto guardado, pero hubo un fallo de red al subir el comprobante.",
            );
          }
        }

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

  const handleEliminarEvidencia = async (idMongo: string, publicId: string) => {
    // Confirmación simple para evitar borrados accidentales
    const confirmar = window.confirm(
      "¿Estás seguro de que deseas eliminar este comprobante? Esta acción no se puede deshacer.",
    );
    if (!confirmar) return;

    try {
      // Usamos el ID de Mongo (_id) en la URL y enviamos el public_id en el body
      const response = await fetch(
        `http://localhost:3977/api/evidencias/${idMongo}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ public_id: publicId }),
        },
      );

      if (response.ok) {
        // Actualizamos el estado para quitar la imagen de la vista inmediatamente
        setEvidencias((prevEvidencias) =>
          prevEvidencias.filter((ev) => ev.id_evidencia !== idMongo),
        );
        alert("Comprobante eliminado con éxito.");
      } else {
        const errorData = await response.json();
        alert(
          `Error al eliminar: ${errorData.error || "Problema en el servidor"}`,
        );
      }
    } catch (error) {
      console.error("Error de conexión al eliminar:", error);
      alert("Error de conexión con el servidor al intentar eliminar.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: "bold", pb: 1 }}>
        {esEdicion
          ? isEmpleado
            ? "Editar Gasto"
            : "Asignar Estado (Modo Administrator)"
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
            {/* COLUMNA IZQUIERDA */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <TextField
                fullWidth
                select
                label="Categoría del gasto"
                name="id_categoria"
                value={formData.id_categoria}
                onChange={handleChange}
                required
                disabled={!isEmpleado}
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
                disabled={!isEmpleado}
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
                disabled={!isEmpleado}
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

              {/* SECCIÓN DE VISUALIZACIÓN DE EVIDENCIAS EXISTENTES */}
              {esEdicion && (
                <Box
                  sx={{
                    mt: 1,
                    p: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                    bgcolor: "background.paper",
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: "bold", mb: 1.5, color: "text.primary" }}
                  >
                    Comprobantes Guardados
                  </Typography>

                  {cargandoEvidencias ? (
                    <Box
                      sx={{ display: "flex", justifyContent: "center", p: 1 }}
                    >
                      <CircularProgress size={24} />
                    </Box>
                  ) : evidencias.length === 0 ? (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", fontStyle: "italic" }}
                    >
                      Este gasto no posee archivos adjuntos actualmente.
                    </Typography>
                  ) : (
                    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                      {evidencias.map((ev: any) => {
                        const esImagen = ev.tipo_archivo
                          ?.toLowerCase()
                          .includes("image");
                        return (
                          <Box
                            key={ev.id_evidencia || ev.public_id}
                            sx={{
                              width: 100,
                              height: 100,
                              border: "1px solid",
                              borderColor: "divider",
                              borderRadius: 1.5,
                              overflow: "hidden",
                              position: "relative",
                              bgcolor: "action.hover",
                              boxShadow: 1,
                            }}
                          >
                            {/*  BOTÓN DE ELIMINAR (Solo visible para el empleado*/}
                            {isEmpleado && (
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation(); //Evita que al hacer clic en borrar, se abra la imagen
                                  handleEliminarEvidencia(
                                    ev.id_evidencia,
                                    ev.public_id,
                                  );
                                }}
                                sx={{
                                  position: "absolute",
                                  top: 2,
                                  right: 2,
                                  bgcolor: "rgba(255, 255, 255, 0.9)",
                                  padding: "2px",
                                  "&:hover": {
                                    bgcolor: "error.main",
                                    color: "white",
                                  },
                                  zIndex: 10,
                                }}
                                title="Eliminar comprobante"
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            )}

                            {/* ÁREA CLICKABLE PARA ABRIR EL ARCHIVO */}
                            <Box
                              sx={{
                                width: "100%",
                                height: "100%",
                                cursor: "pointer",
                                transition: "transform 0.2s",
                                "&:hover": {
                                  transform: "scale(1.05)",
                                },
                              }}
                              onClick={() =>
                                window.open(
                                  ev.url_evidencia,
                                  "_blank",
                                  "noopener,noreferrer",
                                )
                              }
                              title={`Click para abrir: ${ev.nombre_original}`}
                            >
                              {esImagen ? (
                                <Box
                                  component="img"
                                  src={ev.url_evidencia}
                                  alt={ev.nombre_original}
                                  sx={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                  }}
                                />
                              ) : (
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    height: "100%",
                                    p: 0.5,
                                  }}
                                >
                                  <DescriptionIcon
                                    color="primary"
                                    sx={{ fontSize: 32 }}
                                  />
                                  <Typography
                                    variant="caption"
                                    noWrap
                                    sx={{
                                      width: "100%",
                                      textAlign: "center",
                                      fontSize: "10px",
                                      px: 0.5,
                                    }}
                                  >
                                    PDF
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          </Box>
                        );
                      })}
                    </Box>
                  )}
                </Box>
              )}
            </Box>

            {/* COLUMNA DERECHA */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <TextField
                fullWidth
                label="Fecha de gasto"
                name="fecha"
                type="date"
                value={formData.fecha}
                onChange={handleChange}
                required
                disabled={!isEmpleado}
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
                  disabled={isEmpleado}
                  slotProps={{ inputLabel: { shrink: true } }}
                >
                  <MenuItem value="Pendiente">Pendiente</MenuItem>
                  <MenuItem value="Aceptado">Aceptado</MenuItem>
                  <MenuItem value="Rechazado">Rechazado</MenuItem>
                </TextField>

                <TextField
                  fullWidth
                  label="Observaciones"
                  name="observaciones"
                  value={formData.observaciones}
                  onChange={handleChange}
                  multiline
                  rows={2}
                  maxRows={2}
                  disabled={isEmpleado}
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
