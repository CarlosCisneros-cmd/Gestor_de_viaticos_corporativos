import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Paper,
  IconButton,
} from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";

// Iconos (Mismo estándar que ListarViaticos)
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

export default function Departamentos() {
  const [departamentos, setDepartamentos] = useState([]);

  // Estados para el Modal (Formulario)
  const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [nombreDepartamento, setNombreDepartamento] = useState("");

  // 1. Obtener datos de la API
  const obtenerDepartamentos = async () => {
    try {
      const response = await fetch("http://localhost:3977/api/departamentos");
      const data = await response.json();
      const rowsConId = data.map((dep: any) => ({
        ...dep,
        id: dep.id_departamento, // Respaldo del ID por si acaso
      }));
      setDepartamentos(rowsConId);
    } catch (error) {
      console.error("Error al obtener departamentos:", error);
    }
  };

  useEffect(() => {
    obtenerDepartamentos();
  }, []);

  // 2. Abrir Modal para Crear
  const handleOpenCreate = () => {
    setEditMode(false);
    setNombreDepartamento("");
    setSelectedId(null);
    setOpenModal(true);
  };

  // 3. Abrir Modal para Editar
  const handleOpenEdit = (row: any) => {
    setEditMode(true);
    setSelectedId(row.id_departamento);
    setNombreDepartamento(row.nombre_departamento);
    setOpenModal(true);
  };

  // 4. Guardar o Modificar Datos
  const handleSave = async () => {
    if (!nombreDepartamento.trim()) return;

    const url = editMode
      ? `http://localhost:3977/api/departamentos/${selectedId}`
      : "http://localhost:3977/api/departamentos";

    const method = editMode ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre_departamento: nombreDepartamento }),
      });

      if (response.ok) {
        setOpenModal(false);
        obtenerDepartamentos(); // Refrescar tabla
      }
    } catch (error) {
      console.error("Error al guardar departamento:", error);
    }
  };

  // 5. Eliminar Registro
  const handleEliminar = async (id: number) => {
    if (window.confirm("¿Seguro que deseas eliminar este departamento?")) {
      try {
        const response = await fetch(
          `http://localhost:3977/api/departamentos/${id}`,
          {
            method: "DELETE",
          },
        );
        if (response.ok) {
          obtenerDepartamentos(); // Refrescar tabla
        }
      } catch (error) {
        console.error("Error al eliminar departamento:", error);
      }
    }
  };

  // Definición de Columnas
  const columnas: GridColDef[] = [
    {
      field: "nombre_departamento",
      headerName: "Nombre del Departamento",
      flex: 1,
      minWidth: 250,
    },
    {
      field: "acciones",
      headerName: "Acciones",
      flex: 0.5,
      minWidth: 120,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Stack
          direction="row"
          spacing={1}
          sx={{ height: "100%", alignItems: "center" }}
        >
          <IconButton
            color="secondary"
            size="small"
            onClick={() => handleOpenEdit(params.row)}
            title="Editar Departamento"
          >
            <EditRoundedIcon />
          </IconButton>

          <IconButton
            color="error"
            size="small"
            onClick={() => handleEliminar(params.row.id_departamento)}
            title="Eliminar Departamento"
          >
            <DeleteRoundedIcon />
          </IconButton>
        </Stack>
      ),
    },
  ];

  return (
    <Box sx={{ width: "100%", mt: 2 }}>
      {/* Cabecera idéntica a ListarViaticos */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          mb: 1,
        }}
      >
        <Box>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
            Gestión de Departamentos
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Administración de las áreas y departamentos de la empresa.
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="success"
          onClick={handleOpenCreate}
          sx={{ textTransform: "none", borderRadius: 2, fontWeight: 500 }}
        >
          + Nuevo Departamento
        </Button>
      </Box>

      {/* Contenedor estandarizado de la Tabla */}
      <Paper variant="outlined" sx={{ height: 450, width: "100%", mt: 1 }}>
        <DataGrid
          rows={departamentos}
          columns={columnas}
          getRowId={(row) => row.id_departamento} // Fundamental para evitar errores de llave única
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

      {/* MODAL FORMULARIO (CREAR / EDITAR) */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>
          {editMode ? "Editar Departamento" : "Nuevo Departamento"}
        </DialogTitle>
        <DialogContent
          dividers
          sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}
        >
          <TextField
            autoFocus
            label="Nombre del Departamento"
            type="text"
            fullWidth
            variant="outlined"
            value={nombreDepartamento}
            onChange={(e) => setNombreDepartamento(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setOpenModal(false)}
            color="inherit"
            variant="text"
            sx={{ textTransform: "none" }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            color="primary"
            sx={{ textTransform: "none", borderRadius: 2 }}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
