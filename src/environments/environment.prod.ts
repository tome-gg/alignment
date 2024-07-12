export const environment = {
  production: false,
  auth: {
    domain: process.env['AUTH0_DOMAIN'],
    clientId: process.env['AUTH0_CLIENT_ID'],
    cacheLocation: 'localstorage',
  },
  hasura: {
    graphql: process.env['HASURA_GRAPHQL_URL'],
    wss: process.env['HASURA_WSS_URL'],
    api: process.env['HASURA_API_URL']
  }
};