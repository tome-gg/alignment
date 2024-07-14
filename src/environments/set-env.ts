const setEnv = () => {
  const fs = require('fs');
  const writeFile = fs.writeFile;
// Configure Angular `environment.ts` file path
  const targetPath = './src/environments/environment.ts';
// Load node modules
  const colors = require('colors');
  const appVersion = require('../../package.json').version;
  require('dotenv').config({
    path: 'src/environments/.env'
  });

// `environment.ts` file structure
  const envConfigFile = `export const environment = {
  production: ${process.env['PRODUCTION'] || false},
  baseUrl: '${process.env['BASE_URL'] || ''}',
  appVersion: '${appVersion}',
  auth: {
    domain: '${process.env['AUTH0_DOMAIN']}',
    clientId: '${process.env['AUTH0_CLIENT_ID']}',
    cacheLocation: 'localstorage',
  },
  hasura: {
    graphql: '${process.env['HASURA_GRAPHQL_URL']}',
    wss: '${process.env['HASURA_WSS_URL']}',
    api: '${process.env['HASURA_API_URL']}'
  }
};
`;
  console.log(colors.magenta('The file `environment.ts` will be written with the following content: \n' + envConfigFile));
  writeFile(targetPath, envConfigFile, (err: any) => {
    if (err) {
      console.error(err);
      throw err;
    } else {
      console.log(colors.magenta(`Angular environment.ts file generated correctly at ${targetPath} \n`));
    }
  });
};

setEnv();