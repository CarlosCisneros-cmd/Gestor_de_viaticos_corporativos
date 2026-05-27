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
        id: dep.id_departamento, // Indispensable de forma interna para el DataGrid
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

  // Definición de Columnas (Sin la columna visual del ID)
  const columnas: GridColDef[] = [
    { field: 'nombre_departamento', headerName: 'Nombre del Departamento', flex: 2, minWidth: 250 },
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
            onClick={() => handleEliminar(params.row.id_departamento)}
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
      {/* Cabecera */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography component="h2" variant="h6" sx={{ fontWeight: 600 }}>
          Gestión de Departamentos
        </Typography>
        <Button 
          variant="contained" 
          color="success" 
          onClick={handleOpenCreate}
          sx={{ textTransform: "none", borderRadius: 2 }}
        >
          + Nuevo Departamento
        </Button>
      </Box>
      
      {/* Contenedor con Scroll Restaurado de forma segura */}
      <Box
        sx={{
          width: '100%',
          height: 450, // Definimos una altura fija prudente para que actúe el scroll nativo si los datos exceden
          '& .MuiDataGrid-root': {
            border: 'none',
          },
          // Forzar ocultamiento definitivo de los Checkboxes laterales molestos
          '& .MuiDataGrid-columnHeaderCheckbox, & .MuiDataGrid-cellCheckbox, & input[type="checkbox"]': {
            display: 'none !important',
          },
          // Quitamos los fondos azules de selección residuales
          '& .Mui-selected, & .state-selected': {
            backgroundColor: 'transparent !important',
          },
          // Estilo de celdas y filas alineadas
          '& .MuiDataGrid-row': {
            minHeight: '70px !important',
            maxHeight: '70px !important',
          },
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
          rows={departamentos} 
          columns={columnas} 
          getRowHeight={() => 70}
        />
      </Box>

      {/* MODAL FORMULARIO (CREAR / EDITAR) */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold' }}>{editMode ? 'Editar Departamento' : 'Nuevo Departamento'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
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