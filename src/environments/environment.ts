// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  ibgeApi: 'http://servicodados.ibge.gov.br/api/v3/noticias',
  economyApi: 'https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL,CNY-BRL,GBP-BRL,BTC-BRL,ETH-BRL,XRP-BRL',
  articleScrapingApi: 'https://mundo-hoje-web-scraping.up.railway.app/api/news/scraping-article'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
