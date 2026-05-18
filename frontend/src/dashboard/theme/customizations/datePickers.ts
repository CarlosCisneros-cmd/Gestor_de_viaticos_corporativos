import { alpha, type Theme } from "@mui/material/styles";
import { menuItemClasses } from "@mui/material/MenuItem";
import { type PickerComponents } from "@mui/x-date-pickers/themeAugmentation";
import { pickerDayClasses, yearCalendarClasses } from "@mui/x-date-pickers";
import { gray } from "../../../shared-theme/themePrimitives";

/* eslint-disable import/prefer-default-export */
export const datePickersCustomizations: PickerComponents<Theme> = {
  MuiPickerPopper: {
    styleOverrides: {
      paper: ({ theme }: { theme: Theme }) => ({
        marginTop: 4,
        borderRadius: theme.shape.borderRadius,
        border: `1px solid ${(theme.vars || theme).palette.divider}`,
        backgroundImage: "none",
        background: "hsl(0, 0%, 100%)",
        boxShadow:
          "hsla(220, 30%, 5%, 0.07) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.07) 0px 8px 16px -5px",
        [`& .${menuItemClasses.root}`]: {
          borderRadius: 6,
          margin: "0 6px",
        },
        ...(theme.applyStyles &&
          theme.applyStyles("dark", {
            background: gray[900],
            boxShadow:
              "hsla(220, 30%, 5%, 0.7) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.8) 0px 8px 16px -5px",
          })),
      }),
    },
  },
  MuiPickerDay: {
    styleOverrides: {
      root: ({ theme }: { theme: Theme }) => ({
        borderRadius: theme.shape.borderRadius,
        color: (theme.vars || theme).palette.text.primary,
        [`&.${pickerDayClasses.selected}`]: {
          backgroundColor: (theme.vars || theme).palette.primary.main,
          color: (theme.vars || theme).palette.primary.contrastText,
          "&:hover": {
            backgroundColor: (theme.vars || theme).palette.primary.dark,
          },
        },
      }),
    },
  },
  MuiYearCalendar: {
    styleOverrides: {
      root: ({ theme }: { theme: Theme }) => ({
        [`& .${yearCalendarClasses.button}`]: {
          borderRadius: theme.shape.borderRadius,
        },
      }),
    },
  },
};
