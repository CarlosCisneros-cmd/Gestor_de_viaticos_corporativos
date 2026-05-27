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
  MenuItem,
  Tabs,
  Tab,
  Stack
} from '@mui/material';
import { type GridColDef } from '@mui/x-data-grid';
import CustomizedDataGrid from '../dashboard/components/CustomizedDataGrid';

interface Departamento {
  id_departamento: number;
  nombre: string;
}

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  
  // Estados para Filtros Avanzados
  const [tabActual, setTabActual] = useState(0); 
  const [filtroDepartamento, setFiltroDepartamento] = useState<number | string>('Todos');

  // Campos del Formulario
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const [rol, setRol] = useState('Usuario');
  const [cedula, setCedula] = useState('');
  const [telefono, setTelefono] = useState('');
  const [idDepartamento, setIdDepartamento] = useState<number | string>('');

  // 1. Obtener los usuarios
  const obtenerUsuarios = async () => {
    try {
      const response = await fetch('http://localhost:3977/api/usuarios');
      const data = await response.json();
      const rowsConId = data.map((usr: any) => ({
        ...usr,
        id: usr.id_Usuario, 
      }));
      setUsuarios(rowsConId);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  };

  // 2. Obtener los departamentos
  const obtenerDepartamentos = async () => {
    try {
      const response = await fetch('http://localhost:3977/api/departamentos');
      if (response.ok) {
        const data = await response.json();
        const departamentosNormalizados = data.map((dep: any) => ({
          id_departamento: dep.id_departamento ?? dep.id_Departamento ?? dep.id,
          nombre: dep.nombre ?? dep.nombre_departamento ?? Object.values(dep)[1] ?? 'Sin Nombre'
        }));
        setDepartamentos(departamentosNormalizados);
      }
    } catch (error) {
      console.error("Error al obtener departamentos:", error);
    }
  };

  useEffect(() => {
    obtenerUsuarios();
    obtenerDepartamentos();
  }, []);

  // 3. Controladores del Modal
  const handleOpenCreate = () => {
    setEditMode(false);
    setNombre('');
    setCorreo('');
    setContrasenia('');
    setRol('Usuario');
    setCedula('');
    setTelefono('');
    setIdDepartamento('');
    setSelectedId(null);
    setOpenModal(true);
  };

  const handleOpenEdit = (row: any) => {
    setEditMode(true);
    setSelectedId(row.id_Usuario);
    setNombre(row.nombre);
    setCorreo(row.correo);
    setContrasenia(''); 
    setRol(row.rol || 'Usuario');
    setCedula(row.cedula || '');
    setTelefono(row.telefono || '');
    setIdDepartamento(row.id_departamento ?? row.id_Departamento ?? '');
    setOpenModal(true);
  };

  // 4. Guardar
  const handleSave = async () => {
    if (!nombre.trim() || !correo.trim()) return;
    if (!editMode && !contrasenia.trim()) {
      alert("La contraseña es obligatoria para nuevos usuarios.");
      return;
    }

    const url = editMode 
      ? `http://localhost:3977/api/usuarios/${selectedId}`
      : 'http://localhost:3977/api/usuarios';
      
    const method = editMode ? 'PUT' : 'POST';
    
    const payload: any = { 
      nombre, 
      correo, 
      rol, 
      cedula, 
      telefono, 
      id_departamento: idDepartamento ? Number(idDepartamento) : null,
      id_Departamento: idDepartamento ? Number(idDepartamento) : null 
    };

    if (!editMode) {
      payload.contraseña = contrasenia; 
    }

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setOpenModal(false);
        obtenerUsuarios();
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(`No se pudo guardar: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error("Error al guardar usuario:", error);
    }
  };

  // 5. Eliminar
  const handleEliminar = async (id: number) => {
    if (window.confirm("¿Seguro que deseas eliminar este usuario?")) {
      try {
        const response = await fetch(`http://localhost:3977/api/usuarios/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          obtenerUsuarios();
        }
      } catch (error) {
        console.error("Error al eliminar usuario:", error);
      }
    }
  };

  const obtenerNombreDepartamento = (row: any) => {
    const idDep = row.id_departamento ?? row.id_Departamento;
    if (!idDep) return 'Ninguno';
    const dep = departamentos.find(d => d.id_departamento === idDep);
    return dep ? dep.nombre : `ID: ${idDep}`;
  };

  const usuariosFiltrados = usuarios.filter((usr: any) => {
    const cumpleTab = 
      tabActual === 0 ? true :
      tabActual === 1 ? usr.rol === 'Administrador' :
      usr.rol === 'Usuario';

    const idDepUsuario = usr.id_departamento ?? usr.id_Departamento;
    const cumpleDepartamento = 
      filtroDepartamento === 'Todos' ? true :
      idDepUsuario === Number(filtroDepartamento);

    return cumpleTab && cumpleDepartamento;
  });

  const columnas: GridColDef[] = [
    { field: 'nombre', headerName: 'Nombre Completo', flex: 1.4, minWidth: 180 },
    { field: 'correo', headerName: 'Correo Electrónico', flex: 1.6, minWidth: 220 },
    { field: 'cedula', headerName: 'Cédula', flex: 0.9, minWidth: 110 },
    { field: 'telefono', headerName: 'Teléfono', flex: 0.9, minWidth: 110 },
    { 
      field: 'id_departamento', 
      headerName: 'Departamento', 
      flex: 1.1,
      minWidth: 130,
      valueGetter: (value, row) => obtenerNombreDepartamento(row)
    },
    { field: 'rol', headerName: 'Rol', flex: 0.9, minWidth: 120 },
    {
      field: 'acciones',
      headerName: 'Acciones',
      flex: 1.4,
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
            onClick={() => handleEliminar(params.row.id_Usuario)}
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
          Gestión de Usuarios
        </Typography>
        <Button variant="contained" color="success" onClick={handleOpenCreate} sx={{ textTransform: "none", borderRadius: 2 }}>
          + Nuevo Usuario
        </Button>
      </Box>

      {/* BARRA DE HERRAMIENTAS */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        gap: 2,
        mb: 2, 
        borderBottom: 1, 
        borderColor: 'divider',
        flexWrap: 'wrap'
      }}>
        <Tabs 
          value={tabActual} 
          onChange={(_, nuevoValue) => setTabActual(nuevoValue)}
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="Todos" sx={{ textTransform: 'none', fontWeight: 500 }} />
          <Tab label="Administradores" sx={{ textTransform: 'none', fontWeight: 500 }} />
          <Tab label="Usuarios (Empleados)" sx={{ textTransform: 'none', fontWeight: 500 }} />
        </Tabs>

        <TextField
          select
          size="small"
          label="Filtrar por Departamento"
          value={filtroDepartamento}
          onChange={(e) => setFiltroDepartamento(e.target.value)}
          sx={{ minWidth: 220, mb: 1 }}
        >
          <MenuItem value="Todos"><em>Mostrar Todos</em></MenuItem>
          {departamentos.map((dep) => (
            <MenuItem key={dep.id_departamento} value={dep.id_departamento}>
              {dep.nombre}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      
      {/* CONTENEDOR CON SCROLL NATIVO RESTAURADO Y SEGURO */}
      <Box
        sx={{
          width: '100%',
          height: 450, // Definimos la altura del visor para permitir scroll libre sin que se rompa el virtualScroller
          '& .MuiDataGrid-root': {
            border: 'none',
          },
          // Ocultar definitivamente los checkboxes de selección
          '& .MuiDataGrid-columnHeaderCheckbox, & .MuiDataGrid-cellCheckbox, & input[type="checkbox"]': {
            display: 'none !important',
          },
          // Limpiar el fondo azul de selección activa residual
          '& .Mui-selected, & .state-selected': {
            backgroundColor: 'transparent !important',
          },
          // Forzar la altura limpia de 70px en las filas
          '& .MuiDataGrid-row': {
            minHeight: '70px !important',
            maxHeight: '70px !important',
          },
          // Centrar celdas verticalmente
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
          rows={usuariosFiltrados} 
          columns={columnas}
          getRowHeight={() => 70}
        />
      </Box>

      {/* Modal de Formulario */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold' }}>{editMode ? 'Editar Usuario' : 'Nuevo Usuario'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Nombre Completo"
            type="text"
            fullWidth
            variant="outlined"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            sx={{ mt: 1 }}
          />
          <TextField
            margin="dense"
            label="Correo Electrónico"
            type="email"
            fullWidth
            variant="outlined"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />
          
          {!editMode && (
            <TextField
              margin="dense"
              label="Contraseña"
              type="password"
              fullWidth
              variant="outlined"
              value={contrasenia}
              onChange={(e) => setContrasenia(e.target.value)}
            />
          )}

          <TextField
            margin="dense"
            label="Número de Cédula"
            type="text"
            fullWidth
            variant="outlined"
            value={cedula}
            onChange={(e) => setCedula(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Teléfono"
            type="text"
            fullWidth
            variant="outlined"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />
          
          <TextField
            select
            margin="dense"
            label="Departamento"
            fullWidth
            variant="outlined"
            value={idDepartamento}
            onChange={(e) => setIdDepartamento(e.target.value)}
          >
            <MenuItem value=""><em>Ninguno</em></MenuItem>
            {departamentos.map((dep) => (
              <MenuItem key={dep.id_departamento} value={dep.id_departamento}>
                {dep.nombre}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            margin="dense"
            label="Rol del Usuario"
            fullWidth
            variant="outlined"
            value={rol}
            onChange={(e) => setRol(e.target.value)}
          >
            <MenuItem value="Usuario">Usuario (Empleado)</MenuItem>
            <MenuItem value="Administrador">Administrador</MenuItem>
          </TextField>
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