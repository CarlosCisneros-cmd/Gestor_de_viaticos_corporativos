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
  MenuItem,
  Tabs,
  Tab,
  Stack,
} from "@mui/material";

import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

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

  const [tabActual, setTabActual] = useState(0);
  const [filtroDepartamento, setFiltroDepartamento] = useState<number | string>(
    "Todos",
  );

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasenia, setContrasenia] = useState("");
  const [rol, setRol] = useState("Usuario");
  const [cedula, setCedula] = useState("");
  const [telefono, setTelefono] = useState("");
  const [idDepartamento, setIdDepartamento] = useState<number | string>("");

  const obtenerUsuarios = async () => {
    try {
      const response = await fetch("http://localhost:3977/api/usuarios");
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

  const obtenerDepartamentos = async () => {
    try {
      const response = await fetch("http://localhost:3977/api/departamentos");
      if (response.ok) {
        const data = await response.json();
        const departamentosNormalizados = data.map((dep: any) => ({
          id_departamento: dep.id_departamento ?? dep.id_Departamento ?? dep.id,
          nombre:
            dep.nombre ??
            dep.nombre_departamento ??
            Object.values(dep)[1] ??
            "Sin Nombre",
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

  const handleOpenCreate = () => {
    setEditMode(false);
    setNombre("");
    setCorreo("");
    setContrasenia("");
    setRol("Usuario");
    setCedula("");
    setTelefono("");
    setIdDepartamento("");
    setSelectedId(null);
    setOpenModal(true);
  };

  const handleOpenEdit = (row: any) => {
    setEditMode(true);
    setSelectedId(row.id_Usuario);
    setNombre(row.nombre);
    setCorreo(row.correo);
    setContrasenia("");
    setRol(row.rol || "Usuario");
    setCedula(row.cedula || "");
    setTelefono(row.telefono || "");
    setIdDepartamento(row.id_departamento ?? row.id_Departamento ?? "");
    setOpenModal(true);
  };

  const handleSave = async () => {
    if (!nombre.trim() || !correo.trim()) return;
    const url = editMode
      ? `http://localhost:3977/api/usuarios/${selectedId}`
      : "http://localhost:3977/api/usuarios";
    const method = editMode ? "PUT" : "POST";
    const payload: any = {
      nombre,
      correo,
      rol,
      cedula,
      telefono,
      id_departamento: idDepartamento ? Number(idDepartamento) : null,
      id_Departamento: idDepartamento ? Number(idDepartamento) : null,
    };
    if (!editMode) payload.contraseña = contrasenia;

    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        setOpenModal(false);
        obtenerUsuarios();
      }
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  const handleEliminar = async (id: number) => {
    if (window.confirm("¿Seguro que deseas eliminar este usuario?")) {
      try {
        const response = await fetch(
          `http://localhost:3977/api/usuarios/${id}`,
          { method: "DELETE" },
        );
        if (response.ok) obtenerUsuarios();
      } catch (error) {
        console.error("Error al eliminar:", error);
      }
    }
  };

  const obtenerNombreDepartamento = (row: any) => {
    const idDep = row.id_departamento ?? row.id_Departamento;
    if (!idDep) return "Ninguno";
    const dep = departamentos.find((d) => d.id_departamento === idDep);
    return dep ? dep.nombre : `ID: ${idDep}`;
  };

  const usuariosFiltrados = usuarios.filter((usr: any) => {
    const cumpleTab =
      tabActual === 0
        ? true
        : tabActual === 1
          ? usr.rol === "Administrador"
          : usr.rol === "Usuario";
    const idDepUsuario = usr.id_departamento ?? usr.id_Departamento;
    const cumpleDepartamento =
      filtroDepartamento === "Todos"
        ? true
        : idDepUsuario === Number(filtroDepartamento);
    return cumpleTab && cumpleDepartamento;
  });

  const columnas: GridColDef[] = [
    { field: "nombre", headerName: "Nombre Completo", flex: 1.4 },
    { field: "correo", headerName: "Correo", flex: 1.6 },
    { field: "cedula", headerName: "Cédula", flex: 0.8 },
    { field: "telefono", headerName: "Teléfono", flex: 0.8 },
    {
      field: "id_departamento",
      headerName: "Departamento",
      flex: 1,
      valueGetter: (_, row) => obtenerNombreDepartamento(row),
    },
    { field: "rol", headerName: "Rol", flex: 0.8 },
    {
      field: "acciones",
      headerName: "Acciones",
      flex: 1,
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
            color="primary"
            size="small"
            onClick={() => handleOpenEdit(params.row)}
            title="Editar Usuario"
          >
            <EditRoundedIcon />
          </IconButton>

          <IconButton
            color="error"
            size="small"
            onClick={() => handleEliminar(params.row.id_Usuario)}
            title="Eliminar Usuario"
          >
            <DeleteRoundedIcon />
          </IconButton>
        </Stack>
      ),
    },
  ];

  return (
    <Box sx={{ width: "100%", mt: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Gestión de Usuarios
        </Typography>
        <Button variant="contained" color="success" onClick={handleOpenCreate}>
          + Nuevo Usuario
        </Button>
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 2,
          borderBottom: 1,
          borderColor: "divider",
          pb: 1,
        }}
      >
        <Tabs value={tabActual} onChange={(_, v) => setTabActual(v)}>
          <Tab label="Todos" /> <Tab label="Administradores" />{" "}
          <Tab label="Empleados" />
        </Tabs>
        <TextField
          select
          size="small"
          label="Depto"
          value={filtroDepartamento}
          onChange={(e) => setFiltroDepartamento(e.target.value)}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="Todos">Todos</MenuItem>
          {departamentos.map((dep) => (
            <MenuItem key={dep.id_departamento} value={dep.id_departamento}>
              {dep.nombre}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {/* TABLA LIMPIA Y ÚNICA */}
      <Paper variant="outlined" sx={{ height: 500, width: "100%", mt: 1 }}>
        <DataGrid
          rows={usuariosFiltrados}
          columns={columnas}
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
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>
          {editMode ? "Editar Usuario" : "Nuevo Usuario"}
        </DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}
        >
          <TextField
            label="Nombre"
            fullWidth
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <TextField
            label="Correo"
            fullWidth
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />
          {!editMode && (
            <TextField
              label="Contraseña"
              type="password"
              fullWidth
              value={contrasenia}
              onChange={(e) => setContrasenia(e.target.value)}
            />
          )}
          <TextField
            label="Cédula"
            fullWidth
            value={cedula}
            onChange={(e) => setCedula(e.target.value)}
          />
          <TextField
            label="Teléfono"
            fullWidth
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />
          <TextField
            select
            label="Departamento"
            fullWidth
            value={idDepartamento}
            onChange={(e) => setIdDepartamento(e.target.value)}
          >
            <MenuItem value="">Ninguno</MenuItem>
            {departamentos.map((dep) => (
              <MenuItem key={dep.id_departamento} value={dep.id_departamento}>
                {dep.nombre}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Rol"
            fullWidth
            value={rol}
            onChange={(e) => setRol(e.target.value)}
          >
            <MenuItem value="Usuario">Usuario</MenuItem>
            <MenuItem value="Administrador">Administrador</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancelar</Button>
          <Button onClick={handleSave} variant="contained">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
