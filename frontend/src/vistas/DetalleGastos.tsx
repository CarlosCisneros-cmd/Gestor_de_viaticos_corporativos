import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
} from "@mui/x-data-grid";

interface Gasto {
  id_gasto: number;
  monto: number;
  fecha_gasto: string;
  descripcion: string;
  estado_gasto: "Pendiente" | "Aceptado" | "Observado";
}

export default function DetalleGastos() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [loading, setLoading] = useState(true);

  // Iniciamos el presupuesto en 0 ya que se cargará de la base de datos
  const [presupuesto, setPresupuesto] = useState<number>(0);
  //Estado para guardar el motivo/nombre del viático y mostrarlo en el título
  const [motivoViatico, setMotivoViatico] = useState<string>("");

  // Calculamos el total de los gastos
  const totalGastos = gastos.reduce(
    (sum, gasto) => sum + Number(gasto.monto),
    0,
  );
  const isOverBudget = totalGastos > presupuesto;

  // Definición de columnas corregida y tipada
  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "id_gasto",
        headerName: "N°",
        width: 70,
        valueGetter: (_value: any, row: any, _column: any, apiRef: any) => {
          const rowIds = apiRef.current.getSortedRowIds();
          return rowIds.indexOf(row.id_gasto) + 1;
        },
      },
      {
        field: "descripcion",
        headerName: "Descripción",
        flex: 1.5,
        renderCell: (params) => (
          <div
            style={{
              whiteSpace: "normal",
              wordBreak: "break-word",
              lineHeight: "1.5",
              padding: "8px 0",
            }}
          >
            {params.value}
          </div>
        ),
      },
      {
        field: "monto",
        headerName: "Monto",
        flex: 0.5,
        valueFormatter: (value: any) => `$ ${Number(value).toFixed(2)}`,
      },
      {
        field: "fecha_gasto",
        headerName: "Fecha",
        flex: 0.8,
        valueFormatter: (value: any) =>
          new Date(value).toLocaleDateString("es-ES"),
      },
      {
        field: "estado_gasto",
        headerName: "Estado",
        flex: 0.8,
        renderCell: (params: GridRenderCellParams) => {
          const estado = params.value as "Pendiente" | "Aceptado" | "Observado";
          const color =
            estado === "Aceptado"
              ? "success"
              : estado === "Observado"
                ? "error"
                : "warning";
          return (
            <Chip
              label={estado}
              color={color}
              size="small"
              variant="outlined"
            />
          );
        },
      },
    ],
    [],
  );

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        setLoading(true);

        // 1. Petición para listar los gastos del viático
        const responseGastos = await fetch(
          `http://localhost:3977/api/gastos/viatico/${id}`,
        );
        if (responseGastos.ok) {
          const dataGastos = await responseGastos.json();
          setGastos(dataGastos);
        }

        // 2. Petición para obtener el presupuesto real del viático
        const responseViatico = await fetch(
          `http://localhost:3977/api/viaticos/${id}`,
        );

        if (responseViatico.ok) {
          const dataViatico = await responseViatico.json();
          if (dataViatico) {
            setPresupuesto(Number(dataViatico.presupuesto_asignado) || 0);
            setMotivoViatico(dataViatico.descripcion_Viatico || "");
          }
        }
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDatos();
  }, [id]);

  return (
    <div style={{ padding: "20px" }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/viaticos")}
        sx={{ mb: 2 }}
      >
        Volver a Viáticos
      </Button>

      {/* CABECERA CON LAS TARJETAS Y EL BOTÓN */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", md: "center" },
          gap: 2,
          mb: 3,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            flex: 1, // Toma todo el espacio disponible
            pr: { md: 2 }, // Padding derecho en PC para que no pegue con las tarjetas
          }}
        >
          Gastos: {motivoViatico || `Viático #${id}`}
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 2,
            flexShrink: 0, // ¡Esto evita que el bloque derecho se aplaste!
            flexWrap: { xs: "wrap", sm: "nowrap" }, // En móviles muy pequeños permite que se acomoden
          }}
        >
          {/* CUADRO AZUL: Presupuesto Real */}
          <Card
            variant="outlined"
            sx={{ minWidth: 140, bgcolor: "background.default" }}
          >
            <CardContent sx={{ py: 1, "&:last-child": { pb: 1 } }}>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Presupuesto
              </Typography>
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: "text.primary" }}
              >
                ${presupuesto.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>

          {/* CUADRO ROJO: Total Gastado */}
          <Card
            variant="outlined"
            sx={{
              minWidth: 140,
              bgcolor: isOverBudget ? "#ffebee" : "background.default",
              borderColor: isOverBudget ? "error.main" : "divider",
            }}
          >
            <CardContent sx={{ py: 1, "&:last-child": { pb: 1 } }}>
              <Typography
                variant="body2"
                sx={{ color: isOverBudget ? "error.main" : "text.secondary" }}
              >
                Total Gastado
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  color: isOverBudget ? "error.main" : "text.primary",
                }}
              >
                ${totalGastos.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>

          {/* BOTÓN: Añadir Gasto */}
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            sx={{ whiteSpace: "nowrap" }} // Mantiene el texto en una sola línea
            onClick={() => {
              console.log("Abrir formulario de gastos");
            }}
          >
            Añadir Gasto
          </Button>
        </Box>
      </Box>

      {/* TABLA DE GASTOS */}
      <Paper sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={gastos}
          columns={columns}
          loading={loading}
          getRowId={(row) => row.id_gasto}
          pageSizeOptions={[5, 10]}
          getRowHeight={() => "auto"}
          sx={{
            "& .MuiDataGrid-cell": {
              display: "flex",
              alignItems: "center",
              paddingTop: "8px",
              paddingBottom: "8px",
            },
          }}
        />
      </Paper>
    </div>
  );
}
