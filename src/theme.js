import { createMuiTheme } from "@material-ui/core/styles";
import { teal, purple } from "@material-ui/core/colors";

const theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: teal,
    secondary: purple,
  },
});

export default theme;
