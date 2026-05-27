import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { BarChart } from "@mui/x-charts/BarChart";

interface DataMensual {
  mes: string;
  total: number;
}

interface DataDepartamento {
  departamento: string;
  total: number;
}

export default function EstadisticasGenerales() {
  const [datosMensuales, setDatosMensuales] = useState<DataMensual[]>([]);
  const [datosDeptos, setDatosDeptos] = useState<DataDepartamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [anio, setAnio] = useState<number>(new Date().getFullYear());

  // Cálculos de KPIs basados en el estado
  const totalAnual = datosMensuales.reduce((sum, item) => sum + item.total, 0);
  const mesMaximo = [...datosMensuales].sort((a, b) => b.total - a.total)[0];
  const deptoMaximo = [...datosDeptos].sort((a, b) => b.total - a.total)[0];
  const totalDeptosCount = datosDeptos.length;
  const promedioDeptos =
    totalDeptosCount > 0
      ? datosDeptos.reduce((sum, item) => sum + item.total, 0) /
        totalDeptosCount
      : 0;

  useEffect(() => {
    const cargarDatosGenerales = async () => {
      try {
        setLoading(true);
        const [resMensual, resDeptos] = await Promise.all([
          fetch(
            `http://localhost:3977/api/viaticos/estadisticas/gasto-mensual?anio=${anio}`,
          ),
          fetch(
            `http://localhost:3977/api/viaticos/estadisticas/gasto-departamento?anio=${anio}`,
          ),
        ]);

        if (resMensual.ok && resDeptos.ok) {
          setDatosMensuales(await resMensual.json());
          setDatosDeptos(await resDeptos.json());
        }
      } catch (error) {
        console.error("Error al cargar las métricas generales:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatosGenerales();
  }, [anio]);

  // Preparación de arreglos para los gráficos
  const mesesLabels = datosMensuales.map((d) => d.mes);
  const mesesValores = datosMensuales.map((d) => d.total);
  const deptosLabels = datosDeptos.map((d) => d.departamento);
  const deptosValores = datosDeptos.map((d) => d.total);

  return (
    <Box sx={{ width: "100%", mt: 2 }}>
      {/* Cabecera */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
            Panel de Analítica Presupuestaria
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Consolidación y distribución del gasto institucional global.
          </Typography>
        </Box>

        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel id="select-anio-label">Año Fiscal</InputLabel>
          <Select
            labelId="select-anio-label"
            value={anio}
            label="Año Fiscal"
            onChange={(e) => setAnio(Number(e.target.value))}
          >
            <MenuItem value={2024}>2024</MenuItem>
            <MenuItem value={2025}>2025</MenuItem>
            <MenuItem value={2026}>2026</MenuItem>
            <MenuItem value={2027}>2027</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 300,
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {/* Tarjetas KPI */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper
              variant="outlined"
              sx={{ p: 2, display: "flex", alignItems: "center", gap: 2 }}
            >
              <AccountBalanceWalletIcon color="primary" sx={{ fontSize: 40 }} />
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontWeight: 500 }}
                >
                  TOTAL INVERTIDO EN EL AÑO
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  ${totalAnual.toFixed(2)}
                </Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper
              variant="outlined"
              sx={{ p: 2, display: "flex", alignItems: "center", gap: 2 }}
            >
              <TrendingUpIcon color="secondary" sx={{ fontSize: 40 }} />
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontWeight: 500 }}
                >
                  PICO MÁXIMO DETECTADO
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {mesMaximo && mesMaximo.total > 0
                    ? `${mesMaximo.mes} ($${mesMaximo.total.toFixed(2)})`
                    : "Sin registros ($0.00)"}
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Gráfica 1: Histórico Mensual */}
          <Grid size={{ xs: 12 }}>
            <Paper
              variant="outlined"
              sx={{ p: 3, width: "100%", overflowX: "auto" }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                Histórico Consolidado de Gastos por Mes
              </Typography>
              <Box
                sx={{
                  minWidth: 650,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <BarChart
                  width={800}
                  height={350}
                  series={[
                    {
                      data: mesesValores,
                      label: "Gasto ($)",
                      color: "#1976d2",
                    },
                  ]}
                  xAxis={[{ data: mesesLabels, scaleType: "band" }]}
                />
              </Box>
            </Paper>
          </Grid>

          {/* Gráfica 2: Distribución por Departamento */}
          <Grid size={{ xs: 12 }}>
            <Typography variant="h6" sx={{ mb: 2, mt: 2, fontWeight: 600 }}>
              Análisis por Departamento
            </Typography>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontWeight: 600 }}
                  >
                    TOP GASTO
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    {deptoMaximo?.departamento || "N/A"}
                  </Typography>
                  <Typography variant="body2" color="primary">
                    ${deptoMaximo?.total.toFixed(2) || "0.00"}
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontWeight: 600 }}
                  >
                    PROMEDIO
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    ${promedioDeptos.toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Gasto medio por área
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontWeight: 600 }}
                  >
                    TOTAL ÁREAS
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    {totalDeptosCount}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Departamentos con viáticos
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            <Paper
              variant="outlined"
              sx={{ p: 3, width: "100%", overflowX: "auto" }}
            >
              <Box
                sx={{
                  minWidth: 650,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {datosDeptos.length > 0 ? (
                  <BarChart
                    width={800}
                    height={350}
                    series={[
                      {
                        data: deptosValores,
                        label: "Consumo ($)",
                        color: "#2e7d32",
                      },
                    ]}
                    xAxis={[{ data: deptosLabels, scaleType: "band" }]}
                  />
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: 350,
                    }}
                  >
                    <Typography color="text.secondary">
                      No hay registros para este año.
                    </Typography>
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
