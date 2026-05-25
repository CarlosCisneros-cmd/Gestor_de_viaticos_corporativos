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

export default function Departamentos() {
  const [departamentos, setDepartamentos] = useState([]);
  
  // Estados para el Modal (Formulario)
  const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [nombreDepartamento, setNombreDepartamento] = useState('');

  // 1. Obtener datos de la API
  const obtenerDepartamentos = async () => {
    try {
      const response = await fetch('http://localhost:3977/api/departamentos');
      const data = await response.json();
      const rowsConId = data.map((dep: any) => ({
        ...dep,
        id: dep.id_departamento, 
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
    setNombreDepartamento('');
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
      : 'http://localhost:3977/api/departamentos';
      
    const method = editMode ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
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
        const response = await fetch(`http://localhost:3977/api/departamentos/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          obtenerDepartamentos(); // Refrescar tabla
        }
      } catch (error) {
        console.error("Error al eliminar departamento:", error);
      }
    }
  };

  // Definición de Columnas incluyendo acciones dinámicas
  const columnas: GridColDef[] = [
    { field: 'id_departamento', headerName: 'ID', width: 90 },
    { field: 'nombre_departamento', headerName: 'Nombre del Departamento', flex: 1 },
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
            onClick={() => handleEliminar(params.row.id_departamento)}
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
          Gestión de Departamentos
        </Typography>
        <Button variant="contained" color="success" onClick={handleOpenCreate}>
          + Nuevo Departamento
        </Button>
      </Box>
      
      <CustomizedDataGrid rows={departamentos} columns={columnas} />

      {/* MODAL FORMULARIO (CREAR / EDITAR) */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="xs" fullWidth>
        <DialogTitle>{editMode ? 'Editar Departamento' : 'Nuevo Departamento'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nombre del Departamento"
            type="text"
            fullWidth
            variant="outlined"
            value={nombreDepartamento}
            onChange={(e) => setNombreDepartamento(e.target.value)}
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