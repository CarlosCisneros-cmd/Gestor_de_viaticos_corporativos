import React, { useEffect, useState } from "react";
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

// Gráficas de MUI
import { BarChart } from "@mui/x-charts/BarChart";

interface DataMensual {
  mes: string;
  total: number;
}

interface DataDepartamento {
  departamento: string;
  total: number;
}

export default function EstadisticasGastos() {
  const [datosMensuales, setDatosMensuales] = useState<DataMensual[]>([]);
  const [datosDeptos, setDatosDeptos] = useState<DataDepartamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [anio, setAnio] = useState<number>(new Date().getFullYear());

  // KPIs
  const totalAnual = datosMensuales.reduce((sum, item) => sum + item.total, 0);
  const mesMaximo = [...datosMensuales].sort((a, b) => b.total - a.total)[0];

  useEffect(() => {
    const cargarTodo = async () => {
      try {
        setLoading(true);

        // Ejecutamos ambas peticiones en paralelo
        const [resMensual, resDeptos] = await Promise.all([
          fetch(
            `http://localhost:3977/api/viaticos/estadisticas/gasto-mensual?anio=${anio}`,
          ),
          fetch(
            `http://localhost:3977/api/viaticos/estadisticas/gasto-departamento?anio=${anio}`,
          ),
        ]);

        if (resMensual.ok && resDeptos.ok) {
          const dataM = await resMensual.json();
          const dataD = await resDeptos.json();
          setDatosMensuales(dataM);
          setDatosDeptos(dataD);
        }
      } catch (error) {
        console.error("Error al cargar las métricas:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarTodo();
  }, [anio]);

  // Preparación de datos para la gráfica de Meses
  const mesesLabels = datosMensuales.map((d) => d.mes);
  const mesesValores = datosMensuales.map((d) => d.total);

  // Preparación de datos para la gráfica de Departamentos
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
            Consolidación y distribución del gasto institucional.
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
          <Grid item xs={12} sm={6}>
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

          <Grid item xs={12} sm={6}>
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
          <Grid item xs={12} md={6}>
            <Paper variant="outlined" sx={{ p: 3, height: "100%" }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                Histórico Consolidado de Gastos por Mes
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <BarChart
                  width={500}
                  height={300}
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
          <Grid item xs={12} md={6}>
            <Paper variant="outlined" sx={{ p: 3, height: "100%" }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                Distribución del Presupuesto por Departamento
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                {datosDeptos.length > 0 ? (
                  <BarChart
                    width={500}
                    height={300}
                    series={[
                      {
                        data: deptosValores,
                        label: "Consumo ($)",
                        color: "#2e7d32",
                      },
                    ]} // Color verde para diferenciarlo
                    xAxis={[{ data: deptosLabels, scaleType: "band" }]}
                  />
                ) : (
                  <Box
                    sx={{ display: "flex", alignItems: "center", height: 200 }}
                  >
                    <Typography color="text.secondary">
                      No hay viáticos registrados para este año fiscal.
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
