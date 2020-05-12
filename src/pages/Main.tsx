/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button, Typography } from "@material-ui/core";
import React from "react";

import AssistantAPIClient, { IFunction } from "@io-maana/q-assistant-client";
import { first, flatten } from "lodash";
import { green } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";
import { withRouter, RouteComponentProps } from "react-router-dom";

import * as MyServiceClient from "../api/myService";
import WorkspaceClient, { ILocalWorkspace } from "../api/workspace";
import { useAsync } from "../hooks/useAsync";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flex: "1 1 auto",
    flexDirection: "column",
    overflow: "hidden",
    height: "100%",
    padding: theme.spacing(),
  },
  button: {
    maxWidth: "100px",
    marginTop: theme.spacing(),
  },
  success: {
    background: green[600],
    color: theme.palette.text.primary,
  },
}));

// todo: update this type definition
const _Main = (props: { user: any } & RouteComponentProps) => {
  const { user } = props;

  const classes = useStyles();
  const [selectedItem, setSelectedItem] = React.useState<any | undefined>();

  const {
    execute: loadWorkspace,
    pending: workspaceLoading,
    value: workspace,
    error: workspaceError,
  } = useAsync<ILocalWorkspace>(WorkspaceClient.getWorkspace, true);

  const {
    execute: getBaseUrl,
    pending: loadingBaseUrl,
    value: baseUrl,
    error: getBaseUrlError,
  } = useAsync(MyServiceClient.getMyServiceBaseUrl, false);

  const {
    execute: getInfo,
    pending: loadingInfo,
    value: info,
    error: getInfoError,
  } = useAsync(MyServiceClient.getInfo, false);

  // * Example: save an object on the window for debugging purposes.
  // * Note: be sure to select the correct debugging context in the dev tools console.
  // * (in the drop down, change "top" to "maanaFrame...")
  React.useEffect(() => {
    // @ts-ignore
    window.workspace = workspace;
  }, [workspace]);

  // * load workspace initially; only runs once
  React.useEffect(() => {
    loadWorkspace();
  }, [loadWorkspace]);

  React.useEffect(() => {
    if (workspace && workspace.id && workspace.currentSelection) {
      AssistantAPIClient.addSelectionChangedListener(async (event: any) => {
        const _selectedItem = first(event.selection);
        setSelectedItem(_selectedItem);
        loadWorkspace();
      });

      AssistantAPIClient.addInventoryChangedListener(loadWorkspace);
    }

    return function cleanup() {
      AssistantAPIClient.removeSelectionChangedListener();
      AssistantAPIClient.removeInventoryChangedListener();
    };
  }, [workspace, loadWorkspace]);

  return (
    <div className={classes.root}>
      {workspaceLoading && <Typography>Loading...</Typography>}

      {!workspaceLoading && (
        <Typography variant="h6">
          Hello, {user.name} ({user.email})!
        </Typography>
      )}

      {baseUrl && <Typography>{JSON.stringify(baseUrl, null, 2)}</Typography>}

      <Button
        onClick={() => {
          getBaseUrl();
        }}
      >
        Get Base URL
      </Button>
      {info && <Typography>{JSON.stringify(info, null, 2)}</Typography>}

      <Button
        onClick={() => {
          getInfo();
        }}
      >
        Get Info
      </Button>

      <pre>{JSON.stringify(selectedItem, null, 2)}</pre>
    </div>
  );
};

// * named exports are better than default
export const Main = withRouter(_Main);
