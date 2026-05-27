import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import ColorModeIconDropdown from "../../shared-theme/ColorModeIconDropdown";

// Importamos nuestro nuevo componente dinámico
import NavbarBreadcrumbs from "./NavbarBreadcrumbs";

export default function Header() {
  const fechaHoy = new Date().toLocaleDateString("es-EC", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <Stack
      direction="row"
      sx={{
        display: { xs: "none", md: "flex" },
        width: "100%",
        alignItems: { xs: "flex-start", md: "center" },
        justifyContent: "space-between", //Volvemos a separar los extremos
        maxWidth: { sm: "100%", md: "1700px" },
        pt: 1.5,
      }}
      spacing={2}
    >
      {/* IZQUIERDA: Nuestras Migas de Pan dinámicas */}
      <NavbarBreadcrumbs />

      {/* DERECHA: Fecha y Modo Oscuro */}
      <Stack direction="row" sx={{ gap: 2, alignItems: "center" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
            px: 1.5,
            py: 0.75,
            bgcolor: "background.paper",
          }}
        >
          <CalendarTodayRoundedIcon
            sx={{ fontSize: 18, color: "text.secondary" }}
          />
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              color: "text.secondary",
              textTransform: "capitalize",
            }}
          >
            {fechaHoy}
          </Typography>
        </Box>

        <ColorModeIconDropdown />
      </Stack>
    </Stack>
  );
}
