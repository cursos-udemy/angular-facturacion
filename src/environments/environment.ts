// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  //backendServiceURL: process.env.BACKEND_SERVICE_URL || "http://localhost:8080",
  //appClientId: process.env.APP_CONFIG_CLIENT_ID || 'angular-app',
  //appClientSecret: process.env.APP_CONFIG_CLIENT_SECRET || '12345',
  backendServiceURL: 'http://localhost:8080',
  appClientId: 'angular-app',
  appClientSecret: '12345',

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
