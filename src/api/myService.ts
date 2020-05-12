import { GET_INFO } from "./graphqlQueries";

import AssistantAPIClient from "@io-maana/q-assistant-client";

const OTHER_SERVICE_ID = window.MAANA_ENV.LAMBDA_SERVICE_ID;

export const getMyServiceBaseUrl = async () => {
  const myServiceQueryResult = await AssistantAPIClient.executeGraphql({
    serviceId: "io.maana.catalog",
    query:
      "query getMyService($serviceId: ID!){ service(id: $serviceId) { endpointUrl } }",
    variables: {
      serviceId: OTHER_SERVICE_ID,
    },
  });

  const { data } = myServiceQueryResult;
  const { service } = data;
  const { endpointUrl } = service;

  return endpointUrl.replace("graphql", "");
};

const client = {
  query: async ({
    query,
    variables,
  }: {
    query: string;
    variables?: Record<string, any>;
  }) => {
    return await AssistantAPIClient.executeGraphql({
      serviceId: OTHER_SERVICE_ID,
      query,
      variables,
    });
  },
  mutate: async ({
    mutation,
    variables,
  }: {
    mutation: string;
    variables?: Record<string, any>;
  }) => {
    return await AssistantAPIClient.executeGraphql({
      serviceId: OTHER_SERVICE_ID,
      query: mutation,
      variables,
    });
  },
};

export const getInfo = async () => {
  const res = await client.query({
    query: GET_INFO,
  });
  return res && res.data ? res.data.info : null;
};
