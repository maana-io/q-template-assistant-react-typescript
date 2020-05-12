import AssistantAPIClient, {
  IService,
  IUpdateFunctionInput,
  IFunction,
} from "@io-maana/q-assistant-client";
import flatten from "lodash/flatten";
import { v4 as uuid } from "uuid";

/**
 * Recursively removes a key from an object
 * @param obj Object to remove key from
 * @param key Key to remove
 */
function filterObject(obj: any, key: string): any {
  for (var i in obj) {
    if (!obj.hasOwnProperty(i)) continue;
    if (typeof obj[i] == "object") {
      filterObject(obj[i], key);
    } else if (i === key) {
      delete obj[i];
    }
  }
  return obj;
}

/**
 * Removes all provided keys from provided object
 * @param obj Object to remove keys from
 * @param keys List of keys to remove from object
 */
function filterKeys(obj: any, keys: string[]): any {
  let result = {};
  keys.forEach((key) => {
    result = {
      ...result,
      ...filterObject(obj, key),
    };
  });

  // @ts-ignore
  return result;
}

export interface ILocalWorkspace {
  id: string;
  allKinds: any[];
  functions: any[];
  kinds: any[];
  services: any[];
  endpointServiceId: string;
  currentSelection: any;
  knowledgeGraphs: any[];
}

const WorkspaceClient = {
  getWorkspace: async (): Promise<ILocalWorkspace> => {
    const workspace = await AssistantAPIClient.getWorkspace();

    // @ts-ignore
    window.ws = workspace;

    const currentSelection = await AssistantAPIClient.getCurrentSelection();

    const kinds = await workspace.getKinds();
    // console.log('Kinds:', kinds)
    const functions = await workspace.getFunctions();
    const fids = functions.map((f: IFunction) => f.id);

    const functionsWithEverything = await Promise.all(
      fids.map(async (fid: string) => {
        const res = await AssistantAPIClient.getFunctionById(fid);
        return JSON.parse(JSON.stringify(res));
      })
    );

    const importedServices = await workspace.getImportedServices();
    const services: IService[] = await Promise.all(
      // todo: importedService should have its type declared
      importedServices.map(async (importedService: IService) => {
        const { id, name } = importedService;

        const kinds = await importedService.getKinds();
        const functions = await importedService.getFunctions();
        return {
          id,
          name,
          kinds,
          functions,
        };
      })
    );

    const servicesKinds = flatten(services.map((service) => service.kinds));
    const allKinds = [...kinds, ...servicesKinds];
    const graphPromises = await workspace.getKnowledgeGraphs();

    const knowledgeGraphs = await Promise.all(
      graphPromises.map(async (graphPromise: any) => {
        const graph = await graphPromise;
        // console.log('graph', graph)
        const nodes = graph ? await graph.getNodes() : null;
        // console.log('nodes', JSON.stringify(nodes))

        return graph && nodes
          ? Promise.all(
              nodes.map(
                // todo: update this type definition
                (node: {
                  knowledgeGraphNode: { innerFunction: { id: any } };
                }) => {
                  return node.knowledgeGraphNode.innerFunction
                    ? // todo: update this type definition
                      functions.filter((func: { id: any }) => {
                        return (
                          func.id === node.knowledgeGraphNode.innerFunction.id
                        );
                      })
                    : null;
                }
              )
            )
          : [];
      })
    );

    let localWorkspace: ILocalWorkspace = {
      id: workspace.id,
      kinds,
      allKinds,
      functions: functionsWithEverything,
      services,
      endpointServiceId: workspace.endpointUrl
        .split("/service/")[1]
        .split("/graphql")[0],
      currentSelection: currentSelection.selection[0],
      knowledgeGraphs,
    };

    localWorkspace = filterKeys(localWorkspace, ["__typename"]);

    return localWorkspace;
  },

  addFunctionToGraph: async (
    kgFunction: IUpdateFunctionInput,
    implementationFunction: IUpdateFunctionInput
  ) => {
    if (!implementationFunction.arguments) {
      throw new Error("implementationFunction.arguments must be defined");
    }

    if (!kgFunction || !kgFunction.arguments) {
      throw new Error("kgFunction.arguments must be defined");
    }

    const operationId = uuid();
    const argumentValues = implementationFunction.arguments.map(
      (argument, key) => {
        return {
          argument: argument.id,
          operation: null,
          // @ts-ignore
          argumentRef: kgFunction.arguments[key].id,
        };
      }
    );

    const updatedFunction: IUpdateFunctionInput = {
      id: kgFunction.id,
      name: kgFunction.name,
      implementation: {
        entrypoint: operationId,
        operations: [
          {
            id: operationId,
            function: implementationFunction.id,
            type: "APPLY",
            argumentValues,
          },
        ],
      },
    };

    const node = await AssistantAPIClient.updateFunction(updatedFunction);
    return node;
  },

  addServiceToWorkspace: async (service: IService) => {
    try {
      const createdService = await AssistantAPIClient.createService(service);
      console.log("CREATED SERVICE", createdService);
    } catch (e) {
      console.log("didnt create service", e);
    }

    await AssistantAPIClient.importService(service.id);
    const updatedWorkspace = await AssistantAPIClient.getWorkspace();
    console.log(updatedWorkspace);
    return service;
  },

  reloadService: async (serviceId: string) => {
    console.log("RELOADING");
    await AssistantAPIClient.refreshServiceSchema(serviceId);
    await AssistantAPIClient.reloadServiceSchema(serviceId);
    console.log("RELOADING done");
  },

  clearWorkspaceCache: async (serviceId: string) => {
    try {
      await AssistantAPIClient.executeGraphql({
        serviceId,
        query: "mutation { clearCache } ",
        variables: {},
      });
    } catch (e) {
      console.error("Failed clearing cache", e);
    }
  },
};

export default WorkspaceClient;
