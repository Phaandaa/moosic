import { alpha } from "@mui/material/styles";

const withAlphas = (color) => {
  return {
    ...color,
    alpha4: alpha(color.main, 0.04),
    alpha8: alpha(color.main, 0.08),
    alpha12: alpha(color.main, 0.12),
    alpha30: alpha(color.main, 0.3),
    alpha50: alpha(color.main, 0.5),
  };
};

export const neutral = {
  50: "#F8F9FA",
  100: "#F3F4F6",
  200: "#E5E7EB",
  300: "#D2D6DB",
  400: "#9DA4AE",
  500: "#6C737F",
  600: "#4D5761",
  700: "#2F3746",
  800: "#1C2536",
  900: "#111927",
};

export const indigo = withAlphas({
  lightest: "#F5F7FF",
  light: "#EBEEFE",
  main: "#6366F1",
  dark: "#4338CA",
  darkest: "#312E81",
  contrastText: "#FFFFFF",
});

export const success = withAlphas({
  lightest: "#F0FDF9",
  light: "#3FC79A",
  main: "#10B981",
  dark: "#0B815A",
  darkest: "#134E48",
  contrastText: "#FFFFFF",
});

export const info = withAlphas({
  lightest: "#ECFDFF",
  light: "#CFF9FE",
  main: "#06AED4",
  dark: "#0E7090",
  darkest: "#164C63",
  contrastText: "#FFFFFF",
});

export const warning = withAlphas({
  lightest: "#FFFAEB",
  light: "#FEF0C7",
  main: "#F79009",
  dark: "#B54708",
  darkest: "#7A2E0E",
  contrastText: "#FFFFFF",
});

export const error = withAlphas({
  lightest: "#FEF3F2",
  light: "#FEE4E2",
  main: "#F04438",
  dark: "#B42318",
  darkest: "#7A271A",
  contrastText: "#FFFFFF",
});

export const figmaColors = {
  bgWhite: "#FFFFFF",
  accentGrey: "#EEF0F7",
  fontSecondary: "#525F7F",
  fontPrimary: "#2E3340",
  mainPurple: "#6F66FF",
  accentPink: "#FA698C",
  accentGreen: "#65D155",
  accentBlue: "#3FA6F0",
  accentYellow: "#F6D855",
  accentRed: "#EE4242",
  accentOrange: "#F1934B",

  fontPrimary: "#2E3340",
  fontSecondary: "#525F7F",
  fontTertiary: "#8193AB",
  fontQuaternary: "#A1B2CF",

  primary500: "#6F66FF", // main-purple
  primary600: "#640233",
  primary700: "#4e0329",
  primary800: "#3b021f",
  accent500: "#ddb52f",

  transparentGreen: alpha("#65D155", 0.2),
  transparentRed: alpha("#EE4242", 0.2),
  transparentPurple: alpha("#6F66FF", 0.2),
};
