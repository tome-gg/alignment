export const environment = {
  production: false,
  baseUrl: 'http://localhost:4200',
  appVersion: '1.0.1',
  auth: {
    domain: 'dev-phh2u7lm3h45n2fy.us.auth0.com',
    clientId: 'xOWUb7eGFmKmdCobWEcpGswGEI87EL84',
    cacheLocation: 'localstorage',
  },
  hasura: {
    graphql: 'https://hasura.tome.gg/v1/graphql',
    wss: 'wss://hasura.tome.gg/v1/graphql',
    api: 'https://hasura.tome.gg/v1/*'
  }
};
