import fetch from 'node-fetch';
import {
	API_KEY,
	DATABASE,
	DATA_SOURCE,
	END_DATE,
	START_DATE,
	STOCK_RESULTS_ASSETS,
	STOCK_RESULTS_DATA,
	STOCK_RESULTS_DATASOURCES,
} from '../const/const.js';
import { Data } from '../models/data.js';
import { Asset } from '../models/asset.js';
import { DataSource } from '../models/dataSource.js';
import { formatUnixTime, makeDelayedRequest } from '../const/utils.js';

export const getData = async (stock) => {
	const dataUri = `${DATA_SOURCE}/datasets/${DATABASE}/${stock}/data.csv?api_key=${API_KEY}&start_date=${START_DATE}&end_date=${END_DATE}&rows=50`;
	const assetUri = `${DATA_SOURCE}/datasets/${DATABASE}/${stock}/metadata.json`;
	const databaseUri = `${DATA_SOURCE}/databases/${DATABASE}`;

	try {
		const dataResponse = await makeDelayedRequest(fetch, dataUri, 300);
		const assetResponse = await makeDelayedRequest(fetch, assetUri, 300);
		const databaseResponse = await makeDelayedRequest(fetch, databaseUri, 300);

		if (!dataResponse.ok) {
			throw new Error(`HTTP error ${dataResponse.status}  ${dataResponse.statusText}`);
		}

		if (!assetResponse.ok) {
			throw new Error(`HTTP error ${assetResponse.status} ${assetResponse.statusText}`);
		}

		if (!databaseResponse.ok) {
			throw new Error(`HTTP error ${databaseResponse.status}  ${databaseResponse.statusText}`);
		}

		//process the data response
		const data = await dataResponse.text();
		const dataList = data.split('\n');
		//initialize the table metadata & content
		let headers = dataList[0].split(','); //get the first row
		let content = dataList.slice(1); //get the others rows
		content.pop(); //remove the last element, since it's an empty string
		content = content.map((e) => e.split(',')); //break each row of data at coma

		//process the asset response
		const assetData = await assetResponse.json();
		// console.log(assetData.dataset)
		const [assetId, assetName, assetDescription, assetAttributes] = [
			assetData.dataset.id,
			DATABASE + '/' + stock,
			assetData.dataset.name,
			{
				'refreshed_at': assetData.dataset.refreshed_at,
				'newest_available_date': assetData.dataset.newest_available_date,
				'frequency': assetData.dataset.frequency,
				'type': assetData.dataset.type,
			}
		];

		//process the database response
		const databaseData = await databaseResponse.json();
		// console.log(databaseData.database)
		const [dataSourceId, dataSourceName, dataSourceDescription] = [
			databaseData.database.id,
			DATABASE,
			databaseData.database.name,
		];

		const now = formatUnixTime(Date.now());

		//map the ASSET
		const asset = new Asset(now, assetId, assetName, assetDescription, headers, content[1], assetAttributes); //initialize the asset
		//verify if doesnt exist already
		if (STOCK_RESULTS_ASSETS.every((elem) => elem.id !== assetId)) STOCK_RESULTS_ASSETS.push(asset);

		//map the DATASOURCE
		const dataSource = new DataSource(dataSourceId, dataSourceName, dataSourceDescription, now, Array.from(Object.keys(asset.attributeTypes)));
		//verify if doesnt exist already
		if (STOCK_RESULTS_DATASOURCES.every((elem) => elem.id !== dataSourceId))
			STOCK_RESULTS_DATASOURCES.push(dataSource);

		//map the DATA
		content.forEach((e) => {
			//parse each value of each row and map it accordingly to the Data object
			const system_date = now;
			let business_date;
			let values_double = {},
				values_int = {},
				values_text = {};

			e.forEach((value, i) => {
				if (asset.attributeTypes[headers[i]] === 'date') business_date = value;
				else if (asset.attributeTypes[headers[i]] === 'float') values_double[headers[i]] = parseFloat(value);
				else if (asset.attributeTypes[headers[i]] === 'int') values_int[headers[i]] = parseInt(value);
				else values_text[headers[i]] = value;
			});

			const data = new Data(
				assetId,
				dataSourceId,
				business_date,
				system_date,
				values_double,
				values_int,
				values_text
			);
			STOCK_RESULTS_DATA.push(data);
		});
	} catch (error) {
		console.error(error);
	}
};
