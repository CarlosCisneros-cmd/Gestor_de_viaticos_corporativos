import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Ajusta la ruta si es necesario
export default function ListarViaticos() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // 1. Inicializa el hook aquí
  const { user } = useAuth();

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "descripcion_Viatico",
        headerName: "Descripción / Motivo",
        flex: 1.5,
        minWidth: 220,
      },
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
        field: "fecha_solicitud",
        headerName: "F. Solicitud",
        flex: 0.8,
        minWidth: 110,
        valueFormatter: (value) => {
          if (!value) return "";
          const fecha = new Date(value);
          if (isNaN(fecha.getTime())) return value;
          const dia = String(fecha.getDate()).padStart(2, "0");
          const mes = String(fecha.getMonth() + 1).padStart(2, "0");
          const anio = fecha.getFullYear();
          return `${anio}-${mes}-${dia}`;
        },
      },
      {
        field: "fecha_inicio",
        headerName: "Fecha Inicio",
        flex: 0.8,
        minWidth: 110,
      },
      { field: "fecha_fin", headerName: "Fecha Fin", flex: 0.8, minWidth: 110 },
      {
        field: "acciones",
        headerName: "Gastos",
        flex: 1,
        minWidth: 150,
        sortable: false,
        disableColumnMenu: true,
        renderCell: (params) => {
          return (
            <Button
              variant="contained"
              size="small"
              color="primary"
              startIcon={<ReceiptLongIcon />}
              // 3. AQUÍ ESTÁ EL CAMBIO:
              onClick={() =>
                navigate(`/viaticos/${params.row.id_Viatico}/gastos`)
              }
              sx={{ textTransform: "none", borderRadius: 2, fontWeight: 500 }}
            >
              Ver Gastos
            </Button>
          );
        },
      },
    ],
    [navigate],
  ); // Dependencia de navigate

  useEffect(() => {
    const cargarViaticos = async () => {
      if (!user) return; // Si no hay usuario, no hacemos nada

      try {
        // Si es admin, traemos todos. Si es usuario, traemos los suyos.
        // OJO: Aquí depende de cómo esté tu backend.
        // Supongamos que tu backend tiene un endpoint: /api/viaticos/usuario/:id
        const url =
          user.rol === "Administrador"
            ? "http://localhost:3977/api/viaticos"
            : `http://localhost:3977/api/viaticos/usuario/${user.id_Usuario}`; // <--- VERIFICA ESTO

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

    cargarViaticos();
  }, [user]); // Agregamos user como dependencia
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
          loading={loading}
          getRowId={(row) => row.id_Viatico}
          pageSizeOptions={[5, 10]}
          initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
          checkboxSelection
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
    </Box>
  );
}
