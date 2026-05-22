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
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import IngresarGasto from "./IngresarGastos";

interface Gasto {
  id_gasto: number;
  monto: number;
  fecha_gasto: string;
  descripcion: string;
  estado_gasto: "Pendiente" | "Aceptado" | "Observado";
  id_categoria?: number; // Añadido por si acaso
}

export default function DetalleGastos() {
  const [modalAbierto, setModalAbierto] = useState(false);
  const ROL_ACTUAL = "empleado";
  const [gastoAEditar, setGastoAEditar] = useState<Gasto | null>(null);

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [loading, setLoading] = useState(true);

  const [presupuesto, setPresupuesto] = useState<number>(0);
  const [motivoViatico, setMotivoViatico] = useState<string>("");

  const totalGastos = gastos.reduce(
    (sum, gasto) => sum + Number(gasto.monto),
    0,
  );
  const isOverBudget = totalGastos > presupuesto;

  const handleEditarGasto = (fila: Gasto) => {
    setGastoAEditar(fila);
    setModalAbierto(true);
  };

  const handleEliminarGasto = async (idGasto: number) => {
    const confirmar = window.confirm(
      "¿Estás seguro de que deseas eliminar este gasto?",
    );
    if (!confirmar) return;

    try {
      const respuesta = await fetch(
        `http://localhost:3977/api/gastos/${idGasto}`,
        {
          method: "DELETE",
        },
      );

      if (respuesta.ok) {
        setGastos((gastosAnteriores) =>
          gastosAnteriores.filter((g) => g.id_gasto !== idGasto),
        );
      } else {
        alert("Hubo un problema al intentar eliminar el gasto.");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      alert("Error de conexión con el servidor.");
    }
  };

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
        valueFormatter: (value: any) => {
          if (!value) return "";
          // SOLUCIÓN ZONA HORARIA: Cortamos el texto original para no perder el día
          const datePart = String(value).split("T")[0]; // "2026-05-17"
          const [year, month, day] = datePart.split("-");
          return `${day}/${month}/${year}`;
        },
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
      {
        field: "acciones",
        headerName: "Acciones",
        flex: 1,
        sortable: false,
        renderCell: (params: GridRenderCellParams) => {
          const isEmpleado = ROL_ACTUAL === "empleado";

          return (
            <Box sx={{ display: "flex", gap: 1 }}>
              <Tooltip title={isEmpleado ? "Editar" : "Asignar estado"}>
                <IconButton
                  color="primary"
                  onClick={() => handleEditarGasto(params.row)}
                >
                  {isEmpleado ? <EditIcon /> : <FactCheckIcon />}
                </IconButton>
              </Tooltip>

              {isEmpleado && (
                <Tooltip title="Eliminar">
                  <IconButton
                    color="error"
                    onClick={() => handleEliminarGasto(params.row.id_gasto)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
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
        const responseGastos = await fetch(
          `http://localhost:3977/api/gastos/viatico/${id}`,
        );
        if (responseGastos.ok) {
          const dataGastos = await responseGastos.json();
          setGastos(dataGastos);
        }

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
          sx={{ fontWeight: 600, flex: 1, pr: { md: 2 } }}
        >
          Gastos: {motivoViatico || `Viático #${id}`}
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 2,
            flexShrink: 0,
            flexWrap: { xs: "wrap", sm: "nowrap" },
          }}
        >
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

          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            sx={{ whiteSpace: "nowrap" }}
            onClick={() => {
              setGastoAEditar(null);
              setModalAbierto(true);
            }}
          >
            Añadir Gasto
          </Button>
        </Box>

        <IngresarGasto
          open={modalAbierto}
          onClose={() => {
            setModalAbierto(false);
            setGastoAEditar(null);
          }}
          gastoAEditar={gastoAEditar}
          rol={ROL_ACTUAL}
          idViatico={id || ""}
          onGuardado={() => {
            window.location.reload();
          }}
        />
      </Box>

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
