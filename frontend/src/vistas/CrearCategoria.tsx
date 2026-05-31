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

// Iconos (Estándar del sistema)
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

export default function Categorias() {
  const [categorias, setCategorias] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [nombreCategoria, setNombreCategoria] = useState("");

  // 1. Cargar datos desde el backend
  const obtenerCategorias = async () => {
    try {
      const response = await fetch("http://localhost:3977/api/categorias");
      const data = await response.json();
      const rowsConId = data.map((cat: any) => ({
        ...cat,
        id: cat.id_categoria, // Mapeo interno obligatorio para DataGrid (No tocar)
      }));
      setCategorias(rowsConId);
    } catch (error) {
      console.error("Error al obtener categorías:", error);
    }
  };

  useEffect(() => {
    obtenerCategorias();
  }, []);

  // 2. Controladores de Modal
  const handleOpenCreate = () => {
    setEditMode(false);
    setNombreCategoria("");
    setSelectedId(null);
    setOpenModal(true);
  };

  const handleOpenEdit = (row: any) => {
    setEditMode(true);
    setSelectedId(row.id_categoria);
    setNombreCategoria(row.nombre_categoria);
    setOpenModal(true);
  };

  // 3. Crear o Editar
  const handleSave = async () => {
    if (!nombreCategoria.trim()) return;

    const url = editMode
      ? `http://localhost:3977/api/categorias/${selectedId}`
      : "http://localhost:3977/api/categorias";

    const method = editMode ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre_categoria: nombreCategoria }),
      });

      if (response.ok) {
        setOpenModal(false);
        obtenerCategorias();
      }
    } catch (error) {
      console.error("Error al guardar categoría:", error);
    }
  };

  // 4. Eliminar Categoría
  const handleEliminar = async (id: number) => {
    if (window.confirm("¿Seguro que deseas eliminar esta categoría?")) {
      try {
        const response = await fetch(
          `http://localhost:3977/api/categorias/${id}`,
          {
            method: "DELETE",
          },
        );
        if (response.ok) {
          obtenerCategorias();
        }
      } catch (error) {
        console.error("Error al eliminar categoría:", error);
      }
    }
  };

  // Configuración de las columnas estandarizadas
  const columnas: GridColDef[] = [
    {
      field: "nombre_categoria",
      headerName: "Nombre de la Categoría",
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
            title="Editar Categoría"
          >
            <EditRoundedIcon />
          </IconButton>

          <IconButton
            color="error"
            size="small"
            onClick={() => handleEliminar(params.row.id_categoria)}
            title="Eliminar Categoría"
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
            Gestión de Categorías
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Administración de las categorías para la clasificación de gastos.
          </Typography>
        </Box>

        {/* Botón de añadir conservando el color success (verde) */}
        <Button
          variant="contained"
          color="success"
          onClick={handleOpenCreate}
          sx={{ textTransform: "none", borderRadius: 2, fontWeight: 500 }}
        >
          + Nueva Categoría
        </Button>
      </Box>

      {/* Contenedor estandarizado de la Tabla (Paper + DataGrid nativo) */}
      <Paper variant="outlined" sx={{ height: 450, width: "100%", mt: 1 }}>
        <DataGrid
          rows={categorias}
          columns={columnas}
          getRowId={(row) => row.id_categoria}
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
          {editMode ? "Editar Categoría" : "Nueva Categoría"}
        </DialogTitle>
        <DialogContent
          dividers
          sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}
        >
          <TextField
            autoFocus
            label="Nombre de la Categoría"
            type="text"
            fullWidth
            variant="outlined"
            value={nombreCategoria}
            onChange={(e) => setNombreCategoria(e.target.value)}
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
