import React from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { blue, deepOrange, grey, red } from "@material-ui/core/colors";

import AssistantAPIClient, { IUser } from "@io-maana/q-assistant-client";
import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { Main } from "./pages/Main";

const theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: blue,
    secondary: deepOrange,
    error: {
      light: "#E4AAAA",
      main: red[500],
      dark: "#721111",
      contrastText: grey[50],
    },
    text: {
      primary: grey[50],
      secondary: grey[200],
      disabled: grey[500],
      hint: grey[500],
    },
    divider: "rgba(255, 255, 255, 0.12)",
    action: {
      active: grey[100],
      hoverOpacity: 0.21,
      disabled: grey[700],
      disabledBackground: grey[500],
    },
    background: {
      default: grey[800],
      paper: "#515151",
    },
  },
  typography: {
    fontFamily: "PT Sans, display",
    htmlFontSize: 16,
  },
});

export const App = () => {
  const [user, setUser] = React.useState<IUser>();
  React.useEffect(() => {
    const loadUser = async () => {
      const qUser = await AssistantAPIClient.getUserInfo();
      setUser(qUser);
    };
    loadUser();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <React.Fragment>
        <CssBaseline />
        <Router>
          {user ? (
            <Switch>
              <Route path="/" component={() => <Main user={user} />} />
            </Switch>
          ) : (
            <Typography color="error" variant="body1">
              User not found
            </Typography>
          )}
        </Router>
        <div>
          <pre>{JSON.stringify(user, null, 2)}</pre>
        </div>
      </React.Fragment>
    </ThemeProvider>
  );
};
