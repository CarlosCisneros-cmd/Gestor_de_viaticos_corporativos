import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { InputAdornment } from "@mui/material";

// Iconos
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AssignmentTurnedInRoundedIcon from "@mui/icons-material/AssignmentTurnedInRounded";

import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface Departamento {
  id_departamento: number;
  nombre: string;
}

const formatSafeDate = (value: any) => {
  if (!value) return "";

  if (typeof value === "string") {
    if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
      return value.substring(0, 10);
    }

    if (/^\d{2}\/\d{2}\/\d{4}/.test(value)) {
      const [dia, mes, anio] = value.substring(0, 10).split("/");
      return `${anio}-${mes}-${dia}`;
    }
  }

  const fecha = new Date(value);
  if (isNaN(fecha.getTime())) return "";
  const dia = String(fecha.getUTCDate()).padStart(2, "0");
  const mes = String(fecha.getUTCMonth() + 1).padStart(2, "0");
  const anio = String(fecha.getUTCFullYear());
  return `${anio}-${mes}-${dia}`;
};

export default function ListarViaticos() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados para soportar el Filtro de Departamentos
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [filtroDepartamento, setFiltroDepartamento] = useState<number | string>("Todos");

  // Estados para el Modal de Edición
  const [openModal, setOpenModal] = useState(false);
  const [viaticoEdit, setViaticoEdit] = useState<any>(null);

  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.rol === "Administrador";

  const handleOpenEdit = useCallback((viatico: any) => {
    setViaticoEdit({ ...viatico });
    setOpenModal(true);
  }, []);

  const handleDelete = useCallback(async (id: number) => {
    if (
      window.confirm(
        "¿Estás seguro de eliminar este viático? Se podrían perder los gastos asociados.",
      )
    ) {
      try {
        const response = await fetch(
          `http://localhost:3977/api/viaticos/${id}`,
          {
            method: "DELETE",
          },
        );
        if (response.ok) {
          setRows((prevRows) =>
            prevRows.filter((row) => row.id_Viatico !== id),
          );
        } else {
          alert("Error al eliminar el viático.");
        }
      } catch (error) {
        console.error("Error al eliminar:", error);
      }
    }
  }, []);

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "descripcion_Viatico",
        headerName: "Descripción / Motivo",
        flex: 1.5,
        minWidth: 220,
      },
      ...(isAdmin
        ? [
            {
              field: "nombre_solicitante",
              headerName: "Usuario",
              flex: 1.2,
              minWidth: 180,
              renderCell: (params: any) => params.value || "N/A",
            },
          ]
        : []),
      {
        field: "presupuesto_asignado",
        headerName: "Presupuesto ($)",
        flex: 0.8,
        minWidth: 130,
        valueFormatter: (value) =>
          value ? `$${Number(value).toFixed(2)}` : "$0.00",
      },
      {
        field: "estado_Viatico",
        headerName: "Estado",
        flex: 0.8,
        minWidth: 120,
        renderCell: (params) => {
          const estado = params.value;
          let color: "warning" | "success" | "error" = "warning";

          if (estado === "Aprobado") color = "success";
          if (estado === "Rechazado") color = "error";

          return (
            <Chip
              label={estado || "Pendiente"}
              color={color}
              size="small"
              variant="outlined"
            />
          );
        },
      },
      {
        field: "fecha_inicio",
        headerName: "Fecha Inicio",
        flex: 0.8,
        minWidth: 110,
        valueFormatter: (value) => formatSafeDate(value),
      },
      {
        field: "fecha_fin",
        headerName: "Fecha Fin",
        flex: 0.8,
        minWidth: 110,
        valueFormatter: (value) => formatSafeDate(value),
      },
      {
        field: "acciones",
        headerName: "Acciones",
        flex: 1,
        minWidth: 150,
        sortable: false,
        disableColumnMenu: true,
        renderCell: (params) => {
          return (
            <Stack
              direction="row"
              spacing={1}
              sx={{ height: "100%", alignItems: "center" }}
            >
              <Button
                variant="contained"
                size="small"
                color="primary"
                onClick={() =>
                  navigate(`/viaticos/${params.row.id_Viatico}/gastos`)
                }
                sx={{ textTransform: "none", borderRadius: 2, fontWeight: 500 }}
              >
                Gastos
              </Button>

              <IconButton
                color="secondary"
                size="small"
                onClick={() => handleOpenEdit(params.row)}
                title={isAdmin ? "Asignar Estado" : "Editar Viático"}
              >
                {isAdmin ? (
                  <AssignmentTurnedInRoundedIcon />
                ) : (
                  <EditRoundedIcon />
                )}
              </IconButton>

              {!isAdmin && (
                <IconButton
                  color="error"
                  size="small"
                  onClick={() => handleDelete(params.row.id_Viatico)}
                  title="Eliminar"
                >
                  <DeleteRoundedIcon />
                </IconButton>
              )}
            </Stack>
          );
        },
      },
    ],
    [navigate, isAdmin, handleOpenEdit, handleDelete],
  );

  const cargarViaticos = async () => {
    if (!user) return;
    try {
      const url = isAdmin
        ? "http://localhost:3977/api/viaticos"
        : `http://localhost:3977/api/viaticos/usuario/${user.id_Usuario}`;

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setRows(data);
      }
    } catch (error) {
      console.error("Error de conexión:", error);
    } finally {
      setLoading(false);
    }
  };

  const cargarDepartamentos = async () => {
    if (!isAdmin) return;
    try {
      const response = await fetch("http://localhost:3977/api/departamentos");
      if (response.ok) {
        const data = await response.json();
        const departamentosNormalizados = data.map((dep: any) => ({
          id_departamento: dep.id_departamento ?? dep.id_Departamento ?? dep.id,
          nombre: dep.nombre ?? dep.nombre_departamento ?? Object.values(dep)[1] ?? "Sin Nombre"
        }));
        setDepartamentos(departamentosNormalizados);
      }
    } catch (error) {
      console.error("Error al obtener departamentos:", error);
    }
  };

  const cargarUsuarios = async () => {
    if (!isAdmin) return;
    try {
      const response = await fetch("http://localhost:3977/api/usuarios");
      if (response.ok) {
        const data = await response.json();
        setUsuarios(data);
      }
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  };

  useEffect(() => {
    cargarViaticos();
    cargarDepartamentos();
    cargarUsuarios();
  }, [user]);

  const handleCloseEdit = () => {
    setOpenModal(false);
    setViaticoEdit(null);
  };

  const handleChangeEdit = (e: any) => {
    const { name, value } = e.target;
    setViaticoEdit((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveEdit = async () => {
    try {
      const response = await fetch(
        `http://localhost:3977/api/viaticos/${viaticoEdit.id_Viatico}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(viaticoEdit),
        },
      );

      if (response.ok) {
        setRows((prevRows) =>
          prevRows.map((row) =>
            row.id_Viatico === viaticoEdit.id_Viatico ? viaticoEdit : row,
          ),
        );
        handleCloseEdit();
        alert("Viático actualizado correctamente.");
      } else {
        alert("Error al guardar los cambios.");
      }
    } catch (error) {
      console.error("Error al actualizar:", error);
    }
  };

  // Filtrado reactivo en memoria basado en el pool de usuarios cargados
  const rowsFiltradas = useMemo(() => {
    if (!isAdmin || filtroDepartamento === "Todos") return rows;

    return rows.filter((viatico) => {
      const idUsuarioViatico = viatico.id_Usuario ?? viatico.id_usuario;
      const usuarioEncontrado = usuarios.find((u) => u.id_Usuario === idUsuarioViatico);
      if (!usuarioEncontrado) return false;

      const idDep = usuarioEncontrado.id_departamento ?? usuarioEncontrado.id_Departamento;
      return idDep === Number(filtroDepartamento);
    });
  }, [rows, filtroDepartamento, usuarios, isAdmin]);

  return (
    <Box sx={{ width: "100%", mt: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", mb: 1 }}>
        <Box>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
            Mis Solicitudes de Viáticos
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Historial de presupuestos asignados para el control de viáticos.
          </Typography>
        </Box>

        {isAdmin && (
          <TextField
            select
            size="small"
            label="Filtrar por Departamento"
            value={filtroDepartamento}
            onChange={(e) => setFiltroDepartamento(e.target.value)}
            sx={{ minWidth: 220 }}
          >
            <MenuItem value="Todos"><em>Mostrar Todos</em></MenuItem>
            {departamentos.map((dep) => (
              <MenuItem key={dep.id_departamento} value={dep.id_departamento}>
                {dep.nombre}
              </MenuItem>
            ))}
          </TextField>
        )}
      </Box>

      <Paper variant="outlined" sx={{ height: 450, width: "100%", mt: 1 }}>
        <DataGrid
          rows={rowsFiltradas}
          columns={columns}
          loading={loading}
          getRowId={(row) => row.id_Viatico}
          pageSizeOptions={[5, 10]}
          initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
          disableRowSelectionOnClick
          getRowHeight={() => "auto"}
          sx={{
            border: 0,
            "& .MuiDataGrid-cell": {
              whiteSpace: "pre-wrap",
              lineHeight: "1.4",
              paddingY: "12px",
              display: "flex",
              alignItems: "center",
            },
          }}
        />
      </Paper>

      {/* --- MODAL DE EDICIÓN --- */}
      <Dialog
        open={openModal}
        onClose={handleCloseEdit}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>
          {isAdmin ? "Asignar Estado (Admin)" : "Editar Viático"}
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 1 }}>
            <TextField
              label="Fecha de Solicitud (Solo lectura)"
              value={formatSafeDate(viaticoEdit?.fecha_solicitud)}
              slotProps={{ input: { readOnly: true } }}
              fullWidth
            />

            {!isAdmin && (
              <>
                <TextField
                  label="Descripción / Motivo"
                  name="descripcion_Viatico"
                  value={viaticoEdit?.descripcion_Viatico || ""}
                  onChange={handleChangeEdit}
                  multiline
                  rows={2}
                  fullWidth
                  sx={{
                    "& .MuiInputBase-root": {
                      height: "auto",
                      minHeight: "10px",
                      alignItems: "flex-start",
                      padding: "12px 14px",
                    },
                  }}
                />
                <Stack direction="row" spacing={2}>
                  <TextField
                    label="Fecha de Inicio"
                    type="date"
                    name="fecha_inicio"
                    value={formatSafeDate(viaticoEdit?.fecha_inicio)}
                    onChange={handleChangeEdit}
                    fullWidth
                    slotProps={{ inputLabel: { shrink: true } }}
                  />
                  <TextField
                    label="Fecha de Finalización"
                    type="date"
                    name="fecha_fin"
                    value={formatSafeDate(viaticoEdit?.fecha_fin)}
                    onChange={handleChangeEdit}
                    fullWidth
                    slotProps={{ inputLabel: { shrink: true } }}
                  />
                </Stack>
              </>
            )}

            <TextField
              label="Presupuesto Asignado ($)"
              type="number"
              name="presupuesto_asignado"
              value={viaticoEdit?.presupuesto_asignado || ""}
              onChange={handleChangeEdit}
              fullWidth
              slotProps={{
                inputLabel: { shrink: true },
                input: {
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                },
              }}
              disabled={!isAdmin && viaticoEdit?.estado_Viatico === "Aprobado"}
              helperText={
                !isAdmin && viaticoEdit?.estado_Viatico === "Aprobado"
                  ? "No se puede editar el presupuesto de un viático aprobado."
                  : ""
              }
            />

            {isAdmin && (
              <FormControl fullWidth>
                <InputLabel>Estado de Aprobación</InputLabel>
                <Select
                  name="estado_Viatico"
                  value={viaticoEdit?.estado_Viatico || "Pendiente"}
                  onChange={handleChangeEdit}
                  label="Estado de Aprobación"
                >
                  <MenuItem value="Pendiente">Pendiente</MenuItem>
                  <MenuItem value="Aprobado">Aprobado</MenuItem>
                  <MenuItem value="Rechazado">Rechazado</MenuItem>
                  <MenuItem value="Necesita Cambios">Necesita Cambios</MenuItem>
                </Select>
              </FormControl>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseEdit} color="inherit" variant="text">
            Cancelar
          </Button>
          <Button onClick={handleSaveEdit} color="primary" variant="contained">
            Guardar Cambios
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}