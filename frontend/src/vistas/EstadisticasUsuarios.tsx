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

// Componentes para la Tabla (NUEVOS)
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

// Iconos
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import { BarChart } from "@mui/x-charts/BarChart";

interface DataUsuario {
  nombre: string;
  total: number;
}

interface DataDepartamento {
  departamento: string;
  total: number;
}

export default function EstadisticasUsuarios() {
  const [datosUsuarios, setDatosUsuarios] = useState<DataUsuario[]>([]);
  const [datosDeptos, setDatosDeptos] = useState<DataDepartamento[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados para los filtros
  const [anio, setAnio] = useState<number>(new Date().getFullYear());
  const [deptoFiltro, setDeptoFiltro] = useState<string>("Todos");
  const [mesFiltro, setMesFiltro] = useState<string>("Todos");

  useEffect(() => {
    const cargarDatosUsuarios = async () => {
      try {
        setLoading(true);
        const [resUsuarios, resDeptos] = await Promise.all([
          fetch(
            `http://localhost:3977/api/viaticos/estadisticas/gasto-usuario?anio=${anio}&departamento=${deptoFiltro}&mes=${mesFiltro}`,
          ),
          fetch(
            `http://localhost:3977/api/viaticos/estadisticas/gasto-departamento?anio=${anio}`,
          ),
        ]);

        if (resUsuarios.ok && resDeptos.ok) {
          setDatosUsuarios(await resUsuarios.json());
          setDatosDeptos(await resDeptos.json());
        }
      } catch (error) {
        console.error("Error al cargar las métricas de usuarios:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatosUsuarios();
  }, [anio, deptoFiltro, mesFiltro]);

  // Cálculos para las tarjetas de resumen
  const gastoTotal = datosUsuarios.reduce(
    (acc, curr) => acc + (Number(curr.total) || 0),
    0,
  );

  const usuarioTop =
    datosUsuarios.length > 0
      ? [...datosUsuarios].sort(
          (a, b) => (Number(b.total) || 0) - (Number(a.total) || 0),
        )[0]
      : null;

  const cantidadUsuarios = datosUsuarios.length;
  const promedioGasto =
    cantidadUsuarios > 0 ? gastoTotal / cantidadUsuarios : 0;

  // Formateador de moneda
  const formatearDinero = (monto: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(monto);
  };

  // Arreglos para el gráfico de barras
  const usuariosLabels = datosUsuarios.map((u) => u.nombre || "Desconocido");
  const usuariosValores = datosUsuarios.map((u) => Number(u.total) || 0);

  return (
    <Box sx={{ width: "100%", mt: 2 }}>
      {/* Cabecera Principal */}
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
            Análisis de Consumo por Beneficiario
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Seguimiento de viáticos asignados individualmente a los
            colaboradores.
          </Typography>
        </Box>

        {/* Filtro General de Año */}
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel id="select-anio-usuarios-label">Año Fiscal</InputLabel>
          <Select
            labelId="select-anio-usuarios-label"
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

      {/* Tarjetas de Resumen (KPIs) */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 4 }}>
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
                TOTAL ASIGNADO EN PANTALLA
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {formatearDinero(gastoTotal)}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            variant="outlined"
            sx={{ p: 2, display: "flex", alignItems: "center", gap: 2 }}
          >
            <EmojiEventsIcon color="secondary" sx={{ fontSize: 40 }} />
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontWeight: 500 }}
              >
                USUARIO CON MAYOR GASTO
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {usuarioTop
                  ? `${usuarioTop.nombre} (${formatearDinero(Number(usuarioTop.total) || 0)})`
                  : "Sin registros ($0.00)"}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            variant="outlined"
            sx={{ p: 2, display: "flex", alignItems: "center", gap: 2 }}
          >
            <QueryStatsIcon color="success" sx={{ fontSize: 40 }} />
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontWeight: 500 }}
              >
                PROMEDIO POR BENEFICIARIO
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {formatearDinero(promedioGasto)}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

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
          {/* SECCIÓN DEL GRÁFICO */}
          <Grid size={{ xs: 12 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Gasto por Usuario
              </Typography>

              <Box sx={{ display: "flex", gap: 2 }}>
                {/* Filtro de meses */}
                <FormControl size="small" sx={{ minWidth: 160 }}>
                  <InputLabel>Filtrar por Mes</InputLabel>
                  <Select
                    value={mesFiltro}
                    label="Filtrar por Mes"
                    onChange={(e) => setMesFiltro(e.target.value)}
                  >
                    <MenuItem value="Todos">Todo el año</MenuItem>
                    <MenuItem value="1">Enero</MenuItem>
                    <MenuItem value="2">Febrero</MenuItem>
                    <MenuItem value="3">Marzo</MenuItem>
                    <MenuItem value="4">Abril</MenuItem>
                    <MenuItem value="5">Mayo</MenuItem>
                    <MenuItem value="6">Junio</MenuItem>
                    <MenuItem value="7">Julio</MenuItem>
                    <MenuItem value="8">Agosto</MenuItem>
                    <MenuItem value="9">Septiembre</MenuItem>
                    <MenuItem value="10">Octubre</MenuItem>
                    <MenuItem value="11">Noviembre</MenuItem>
                    <MenuItem value="12">Diciembre</MenuItem>
                  </Select>
                </FormControl>

                {/* Filtro de departamentos */}
                <FormControl size="small" sx={{ minWidth: 220 }}>
                  <InputLabel>Filtrar por Departamento</InputLabel>
                  <Select
                    value={deptoFiltro}
                    label="Filtrar por Departamento"
                    onChange={(e) => setDeptoFiltro(e.target.value)}
                  >
                    <MenuItem value="Todos">Todos los departamentos</MenuItem>
                    {datosDeptos.map((d) => (
                      <MenuItem key={d.departamento} value={d.departamento}>
                        {d.departamento}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>

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
                {datosUsuarios.length > 0 ? (
                  <BarChart
                    width={800}
                    height={350}
                    series={[
                      {
                        data: usuariosValores,
                        label: "Gasto ($)",
                        color: "#9c27b0",
                      },
                    ]}
                    xAxis={[{ data: usuariosLabels, scaleType: "band" }]}
                  />
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      py: 10,
                    }}
                  >
                    <Typography color="text.secondary">
                      No hay registros de usuarios para estos filtros.
                    </Typography>
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>

          {/* NUEVA SECCIÓN: TABLA DE DESGLOSE / RANKING */}
          {datosUsuarios.length > 0 && (
            <Grid size={{ xs: 12 }} sx={{ mt: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Ranking Detallado de Consumo
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table sx={{ minWidth: 500 }}>
                  <TableHead>
                    <TableRow
                      sx={{
                        backgroundColor: (theme) => theme.palette.action.hover,
                      }}
                    >
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Colaborador / Beneficiario
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: "bold" }}>
                        Monto Total Consumido
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: "bold" }}>
                        Porcentaje del Total
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {[...datosUsuarios]
                      // Los ordenamos automáticamente de mayor a menor gasto
                      .sort(
                        (a, b) =>
                          (Number(b.total) || 0) - (Number(a.total) || 0),
                      )
                      .map((u, idx) => {
                        const totalItem = Number(u.total) || 0;
                        const porcentaje =
                          gastoTotal > 0 ? (totalItem / gastoTotal) * 100 : 0;

                        return (
                          <TableRow key={idx} hover>
                            <TableCell sx={{ fontWeight: 500 }}>
                              {u.nombre || "Desconocido"}
                            </TableCell>
                            <TableCell
                              align="right"
                              sx={{ color: "text.primary" }}
                            >
                              {formatearDinero(totalItem)}
                            </TableCell>
                            <TableCell
                              align="right"
                              sx={{
                                fontWeight: "bold",
                                color: "text.secondary",
                              }}
                            >
                              {porcentaje.toFixed(1)}%
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          )}
        </Grid>
      )}
    </Box>
  );
}
