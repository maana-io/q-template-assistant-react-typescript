/**
 * Very rough typings for the Q Assistant Client.
 *
 * These were pieced together using the following sources:
 * - kportal/src/util/
 * -    assistantAPI/workspace.js
 * -    test/schema.gql
 * - @io-maana/q-assistant-client
 *
 * Versions:
 * - kportal: develop as of commit: 0e8fbf6e2d176aa3614d3666689d5ca9eac1fe0a
 * - @io-maana/q-assistant-client: develop as of commit: f263b85fa09f69e0cc5a30bf1a8f9d171f743812
 *
 * I also used https://graphql-code-generator.com/ to generate a few typings from schema.gql.
 * We might want to integrate this tool into kportal and/or the assistant client to maintain
 * stable typings across versions of the API.
 */

declare module "@io-maana/q-assistant-client" {
  export interface IUser {
    email: string;
    name: string;
  }

  export interface IExecuteGraphqlParams {
    serviceId: string;
    query: string;
    variables?: Record<string, any>;
  }

  // todo: update this interface
  export interface IQWorkspace {
    id: string;
    name: string;
    endpointUrl: string;
    logicServiceId: string;
    modelServiceId: string;
    workspaceServiceId: string;

    createFunction: () => Promise<any>;
    createFunctions: () => Promise<any>;
    createKind: () => Promise<any>;
    createKinds: () => Promise<any>;
    createKnowledgeGraph: () => Promise<any>;
    createKnowledgeGraphs: () => Promise<any>;
    deleteFunction: () => Promise<any>;
    deleteKind: () => Promise<any>;
    deleteService: () => Promise<any>;
    getActiveGraph: () => Promise<any>;
    getFunctionGraph: () => Promise<any>;
    getFunctions: () => Promise<any>;
    getImportedAssistants: () => Promise<any>;
    getImportedServices: () => Promise<any>;
    getKinds: () => Promise<any>;
    getKnowledgeGraphs: () => Promise<any>;
    importService: () => Promise<any>;
    importServices: () => Promise<any>;
    refreshServiceSchema: () => Promise<any>;
    reloadServiceSchema: () => Promise<any>;
    removeService: () => Promise<any>;
    removeServices: () => Promise<any>;
    triggerRepairEvent: () => Promise<any>;
    updateFunction: () => Promise<any>;
    updateFunctions: () => Promise<any>;
    updateKind: () => Promise<any>;
    updateKinds: () => Promise<any>;
  }

  export interface IService {
    id: string;
    name: string;
    endpointUrl: string;
    serviceType: string;
  }

  export interface IUpdateArgumentInput {
    id: string;
    name?: string;
    type?: FieldType;
    typeKindId?: string;
    modifiers?: FieldModifiers[];
    description?: string;
  }

  // todo: complete this type
  export interface IService {
    id: string;
    name: string;
    kinds: any[];
    getKinds: () => Promise<any>;
    getFunctions: () => Promise<any>;
  }

  // todo: complete this type
  export interface IFunction {
    id: string;
    name: string;
    service: IService;
  }

  export type IFieldType =
    | "ID"
    | "STRING"
    | "INT"
    | "FLOAT"
    | "BOOLEAN"
    | "DATE"
    | "TIME"
    | "DATETIME"
    | "JSON"
    | "KIND";

  export type IFieldModifiers =
    | "NONULL"
    | "LIST"
    | "NOIDX"
    | "EPHEMERAL"
    | "IMIDX";

  export type IGraphqlOperationType = "QUERY" | "MUTATION";
  export type IFunctionType = "SERVICE" | "PROJECTION" | "CKG";
  export interface IImplementationInput {
    id?: string;
    entrypoint?: string;
    // todo: extract this
    operations: Array<{
      id: string;
      function: string;
      type: string;
      argumentValues: Record<string, any>[];
    }>;
  }

  export interface IUpdateFunctionInput {
    id: string;
    service?: string;
    name?: string;
    description?: string;
    arguments?: IUpdateArgumentInput[];
    outputType?: IFieldType;
    outputKindId?: string;
    outputModifiers?: IFieldModifiers[];
    graphqlOperationType?: IGraphqlOperationType;
    functionType?: IFunctionType;
    implementation?: IImplementationInput;
  }

  export function getUserInfo(): Promise<IUser>;

  export function executeGraphql<T = any>(
    params: IExecuteGraphqlParams
  ): Promise<T>;

  export function getWorkspace(): Promise<IQWorkspace>;
  export function getCurrentSelection(): Promise<any>;
  export function getKinds(): Promise<any>;
  export function getKindById(id: string): Promise<any>;
  export function getFunctions(): Promise<IFunction[]>;
  export function getImportedServices(): Promise<any>;
  export function getKnowledgeGraphs(): Promise<any>;
  export function updateFunction(
    updatedFunction: IUpdateFunctionInput
  ): Promise<any>;
  export function createService(service: IService): Promise<any>;
  export function importService(serviceId: string): Promise<any>;
  export function refreshServiceSchema(serviceId: string): Promise<any>;
  export function reloadServiceSchema(serviceId: string): Promise<any>;
  export function getFunctionById(functionId: string): Promise<any>;

  export function addSelectionChangedListener(
    callback: (event: any) => void
  ): void;
  export function removeSelectionChangedListener(): void;

  export function addInventoryChangedListener(
    callback: (event: any) => void
  ): void;
  export function removeInventoryChangedListener(): void;
}
