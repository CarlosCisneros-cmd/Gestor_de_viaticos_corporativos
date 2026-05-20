import { styled } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import MuiDrawer, { drawerClasses } from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import MenuContenido from "./MenuContenido";
import OptionsMenu from "./OptionsMenu";
import WorkHistoryRoundedIcon from "@mui/icons-material/WorkHistoryRounded";

const drawerWidth = 240;

const Drawer = styled(MuiDrawer)({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: "border-box",
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: "border-box",
  },
});

export default function SideMenu() {
  return (
    <Drawer variant="permanent" sx={{ display: { xs: "none", md: "block" } }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, p: 2.5 }}>
        <WorkHistoryRoundedIcon sx={{ color: "primary.main", fontSize: 28 }} />
        <Typography
          variant="h6"
          component="h1"
          sx={{ fontWeight: 700, fontSize: "1.1rem", letterSpacing: "-0.5px" }}
        >
          GestorVC
        </Typography>
      </Box>

      <Divider />

      <Box
        sx={{
          overflow: "auto",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Ya no pasamos props de estado */}
        <MenuContenido />
      </Box>

      <Stack
        direction="row"
        sx={{
          p: 2,
          gap: 1,
          alignItems: "center",
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <Avatar
          alt="Jose Martinez"
          src="/static/images/avatar/7.jpg"
          sx={{ width: 36, height: 36 }}
        />
        <Box sx={{ mr: "auto" }}>
          <Typography
            variant="body2"
            sx={{ fontWeight: 500, lineHeight: "16px" }}
          >
            Jose Martinez
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            empleado@email.com
          </Typography>
        </Box>
        <OptionsMenu />
      </Stack>
    </Drawer>
  );
}
