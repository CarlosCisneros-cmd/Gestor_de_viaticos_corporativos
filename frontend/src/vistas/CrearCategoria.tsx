import { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField,
  Stack
} from '@mui/material';
import { type GridColDef } from '@mui/x-data-grid';
import CustomizedDataGrid from '../dashboard/components/CustomizedDataGrid';

export default function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [nombreCategoria, setNombreCategoria] = useState('');

  // 1. Cargar datos desde el backend
  const obtenerCategorias = async () => {
    try {
      const response = await fetch('http://localhost:3977/api/categorias');
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
    setNombreCategoria('');
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
      : 'http://localhost:3977/api/categorias';
      
    const method = editMode ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
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
        const response = await fetch(`http://localhost:3977/api/categorias/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          obtenerCategorias();
        }
      } catch (error) {
        console.error("Error al eliminar categoría:", error);
      }
    }
  };

  // Aquí quitamos la columna 'id_categoria' por completo del renderizado visual
  const columnas: GridColDef[] = [
    { field: 'nombre_categoria', headerName: 'Nombre de la Categoría', flex: 2, minWidth: 250 },
    {
      field: 'acciones',
      headerName: 'Acciones',
      flex: 1,
      minWidth: 200,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Stack
          direction="row"
          spacing={2}
          sx={{ height: "100%", alignItems: "center" }}
        >
          <Button 
            variant="contained" 
            color="primary" 
            size="small"
            onClick={() => handleOpenEdit(params.row)}
            sx={{ textTransform: "none", borderRadius: 2, fontWeight: 500, px: 2 }}
          >
            Editar
          </Button>
          <Button 
            variant="contained" 
            color="error" 
            size="small"
            onClick={() => handleEliminar(params.row.id_categoria)}
            sx={{ textTransform: "none", borderRadius: 2, fontWeight: 500, px: 2 }}
          >
            Eliminar
          </Button>
        </Stack>
      ),
    },
  ];

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography component="h2" variant="h6" sx={{ fontWeight: 600 }}>
          Gestión de Categorías
        </Typography>
        <Button variant="contained" color="success" onClick={handleOpenCreate} sx={{ textTransform: "none", borderRadius: 2 }}>
          + Nueva Categoría
        </Button>
      </Box>
      
      {/* Contenedor con estilos personalizados */}
      <Box
        sx={{
          width: '100%',
          height: 400,
          '& .MuiDataGrid-root': {
            border: 'none',
          },
          // Ocultar los checkboxes laterales molestos
          '& .MuiDataGrid-columnHeaderCheckbox, & .MuiDataGrid-cellCheckbox, & input[type="checkbox"]': {
            display: 'none !important',
          },
          '& .Mui-selected, & .state-selected': {
            backgroundColor: 'transparent !important',
          },
          // Altura estable de las filas
          '& .MuiDataGrid-row': {
            minHeight: '70px !important',
            maxHeight: '70px !important',
          },
          // Centrado vertical de las celdas
          '& .MuiDataGrid-cell': {
            display: 'flex !important',
            alignItems: 'center !important',
          },
          '& .MuiDataGrid-columnHeaders': {
            paddingLeft: '0px !important'
          }
        }}
      >
        <CustomizedDataGrid 
          rows={categorias} 
          columns={columnas} 
          getRowHeight={() => 70}
        />
      </Box>

      {/* Modal Unificado */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold' }}>{editMode ? 'Editar Categoría' : 'Nueva Categoría'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Nombre de la Categoría"
            type="text"
            fullWidth
            variant="outlined"
            value={nombreCategoria}
            onChange={(e) => setNombreCategoria(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setOpenModal(false)} color="inherit" sx={{ textTransform: "none" }}>
            Cancelar
          </Button>
          <Button onClick={handleSave} variant="contained" color="primary" sx={{ textTransform: "none", borderRadius: 2 }}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}