import { heroui } from "@heroui/theme";

export default heroui({
  prefix: "heroui",
  addCommonColors: false,
  defaultTheme: "dark",
  defaultExtendTheme: "dark",
  layout: {
    disabledOpacity: "0.5",
    radius: {
      small: "5px",
      medium: ".45rem"
    },
    borderWidth: {
      medium: "thin"
    }
  },
  themes: {
    dark: {
      colors: {
        default: {
          "50": "#0D0D0E"
        }
      }
    }
  }
});
