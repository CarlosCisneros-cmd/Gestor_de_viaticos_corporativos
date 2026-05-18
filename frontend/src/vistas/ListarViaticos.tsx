import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";

// 1. Columnas mapeadas directamente desde tu tabla "Viaticos"
const columns: GridColDef[] = [
  {
    field: "descripcion_viatico",
    headerName: "Descripción / Motivo",
    width: 220,
  },

  {
    field: "presupuesto_asignado",
    headerName: "Presupuesto ($)",
    width: 150,
    valueFormatter: (value) => {
      return value ? `$${Number(value).toFixed(2)}` : "$0.00";
    },
  },
  {
    field: "estado_aprobacion",
    headerName: "Estado",
    width: 140,
    renderCell: (params) => {
      const estado = params.value;
      let color: "warning" | "success" | "error" = "warning";

      if (estado === "Aprobado") color = "success";
      if (estado === "Rechazado") color = "error";

      return (
        <Chip label={estado} color={color} size="small" variant="outlined" />
      );
    },
  },
  { field: "fecha_solicitud", headerName: "F. Solicitud", width: 130 },
  { field: "feacha_inicio", headerName: "Fecha Inicio", width: 130 }, // Mapeado como tu BD
  { field: "fecha_fin", headerName: "Fecha Fin", width: 130 },
];

// 2. Datos simulados usando la estructura exacta de tus columnas de PostgreSQL
const rows = [
  {
    id: 1, // El DataGrid de MUI necesita obligatoriamente un campo "id" único
    descripcion_viatico: "Capacitación de Sistemas en Guayaquil",
    fecha_solicitud: "15/05/2026",
    feacha_inicio: "18/05/2026",
    fecha_fin: "20/05/2026",
    presupuesto_asignado: "150.00",
    estado_aprobacion: "Pendiente",
  },
  {
    id: 2,
    descripcion_viatico: "Auditoría Sucursal Cuenca",
    fecha_solicitud: "10/05/2026",
    feacha_inicio: "12/05/2026",
    fecha_fin: "14/05/2026",
    presupuesto_asignado: "85.50",
    estado_aprobacion: "Aprobado",
  },
  {
    id: 3,
    descripcion_viatico: "Reunión con Proveedores Manta",
    fecha_solicitud: "28/04/2026",
    feacha_inicio: "01/05/2026",
    fecha_fin: "03/05/2026",
    presupuesto_asignado: "210.00",
    estado_aprobacion: "Rechazado",
  },
];

export default function ListarViaticos() {
  return (
    <Box sx={{ width: "100%", mt: 2 }}>
      <Box>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
          Mis Solicitudes de Viáticos
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Historial de presupuestos asignados para el control de viáticos.
        </Typography>
      </Box>

      <Paper variant="outlined" sx={{ height: 450, width: "100%", mt: 1 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSizeOptions={[5, 10]}
          initialState={{
            pagination: { paginationModel: { pageSize: 5 } },
          }}
          checkboxSelection
          disableRowSelectionOnClick
          getRowHeight={() => "auto"}
          sx={{
            border: 0,
            "& .MuiDataGrid-cell": {
              whiteSpace: "normal",
              lineHeight: "1.4",
              paddingY: "12px",
              display: "flex",
              alignItems: "center",
            },
          }}
        />
      </Paper>
    </Box>
  );
}
