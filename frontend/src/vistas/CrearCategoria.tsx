import { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField 
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
        id: cat.id_categoria, 
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

  const columnas: GridColDef[] = [
    { field: 'id_categoria', headerName: 'ID', width: 90 },
    { field: 'nombre_categoria', headerName: 'Nombre de la Categoría', flex: 1 },
    {
      field: 'acciones',
      headerName: 'Acciones',
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
          <Button 
            variant="contained" 
            color="primary" 
            size="small"
            onClick={() => handleOpenEdit(params.row)}
          >
            Editar
          </Button>
          <Button 
            variant="outlined" 
            color="error" 
            size="small"
            onClick={() => handleEliminar(params.row.id_categoria)}
          >
            Eliminar
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography component="h2" variant="h6">
          Gestión de Categorías
        </Typography>
        <Button variant="contained" color="success" onClick={handleOpenCreate}>
          + Nueva Categoría
        </Button>
      </Box>
      
      <CustomizedDataGrid rows={categorias} columns={columnas} />

      {/* Modal Unificado */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="xs" fullWidth>
        <DialogTitle>{editMode ? 'Editar Categoría' : 'Nueva Categoría'}</DialogTitle>
        <DialogContent>
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
          <Button onClick={() => setOpenModal(false)} color="inherit">
            Cancelar
          </Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}