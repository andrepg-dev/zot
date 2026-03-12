import { heroui } from "@heroui/theme";

export default heroui({
  prefix: "heroui",
  addCommonColors: false,
  defaultTheme: "dark",
  defaultExtendTheme: "dark",
  layout: {
    disabledOpacity: "0.5",
    radius: {
      small: "7px",
      medium: ".45rem",
    },
    borderWidth: {
      medium: "thin",
    },
  },
});
