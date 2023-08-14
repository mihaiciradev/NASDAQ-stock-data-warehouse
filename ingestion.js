import { Client } from 'cassandra-driver';
import { getData } from './ingestion/getData.js';
import { STOCK_LIST, STOCK_RESULTS_ASSETS, STOCK_RESULTS_DATA, STOCK_RESULTS_DATASOURCES } from './const/const.js';
import { sendQuery } from './const/utils.js';

async function run() {
  const client = new Client({
    cloud: {
      secureConnectBundle: './secure-connect-data-warehouse-db.zip',
    },
    credentials: {
      username: 'NJtCsHIEZizdPZxiJMyAfBZf',
      password:
        'bd.RmP-9DbbGAc55pMr-atCLkNLkN9,DyC6WR,Ny6aN4sIW4MMt1dCKMfFjNyQSeCp69hpDsChu,kngPIsiIF6r_8GoXHv.nhiXiD_wPxe55U9CWGhsy,pYqUETZ+HP.',
    },
  });

  await client.connect();
  console.log('Successfully connected to the DataStax database.');

  // get all the stocks from the API;
  for (const stock of STOCK_LIST) {
    await getData(stock);
    console.log('Fetched data for:', stock);
  }

  // console.log(STOCK_RESULTS_ASSETS)
  // console.log(STOCK_RESULTS_DATA)
  // console.log(STOCK_RESULTS_DATASOURCES)

  if (STOCK_RESULTS_ASSETS.length === 0) {
    console.log('No data fetched');
    await client.shutdown();
    return;
  }

  //Assets ingestion
  const assetsQueryPreprocessed = STOCK_RESULTS_ASSETS.map((asset) =>`INSERT INTO uvt.asset (id, system_date, attributes, description, name) VALUES (${asset.id}, toTimestamp('${asset.system_date}'), ${JSON.stringify(asset.attributes).replaceAll('"', "'")}, '${asset.description}', '${asset.name}');`);
  const assetsQuery = `BEGIN BATCH ${assetsQueryPreprocessed.join(' ')} APPLY BATCH;`;
  await sendQuery(client, assetsQuery, '[ingestion of the ASSETS]');

  //Datasource ingestion
  const dataSource = STOCK_RESULTS_DATASOURCES[0];
  const dataSourcesQuery = `INSERT INTO uvt.data_source (id, system_date, attributes, description, name) VALUES (${dataSource.id
    }, toTimestamp('${dataSource.system_date}'), ${JSON.stringify(dataSource.attributes)
      .replaceAll('"', "'")
      .replaceAll('[', '{')
      .replaceAll(']', '}')}, '${dataSource.description}', '${dataSource.name}');`;
  await sendQuery(client, dataSourcesQuery, '[ingestion of the DATASOURCES]');

  //Data ingestion
  const dataQueryPreprocessed = STOCK_RESULTS_DATA.map(
    (data) => `
  INSERT INTO uvt.data (asset_id, data_source_id, business_date, system_date, values_double, values_int, values_text) VALUES (${data.asset_id
      }, ${data.data_source_id}, toTimestamp('${data.business_date}'), toTimestamp('${data.system_date}'), ${JSON.stringify(
        data.values_double
      ).replaceAll('"', "'")}, ${JSON.stringify(data.values_int).replaceAll('"', "'")}, ${JSON.stringify(
        data.values_text
      ).replaceAll('"', "'")});`
  );
  const dataQuery = `BEGIN BATCH ${dataQueryPreprocessed.join(' ')} APPLY BATCH;`;
  await sendQuery(client, dataQuery, '[ingestion of the DATA]');

  await client.shutdown();
}

// Run the async function
run();
