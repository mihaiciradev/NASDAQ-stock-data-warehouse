import { Client } from 'cassandra-driver';
import express from 'express';
import { getAssets } from './consumer/assets/assets.js';
import { getAssetsById } from './consumer/assets/assetsById.js';
import { getDataSourceById } from './consumer/dataSources/dataSourceById.js';
import { getDataSource } from './consumer/dataSources/dataSource.js';
import { getData } from './consumer/data/data.js';
// const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

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

	const app = express();
	const PORT = process.env.PORT || 3001;

	const server = app.listen(PORT, () => {
		console.log(`Server listening on port ${PORT}`);
	});

	app.get('/assets', async (req, res) => {
		const offset = Number(req.query.offset) || 0;

		const response = await getAssets(client, offset);

		res.json(response);
	});

	app.get('/assets/:assetId', async (req, res) => {
		const id = req.params.assetId;

		const response = await getAssetsById(client, id);

		res.json(response);
	});

	app.get('/data-sources', async (req, res) => {
		const offset = Number(req.query.offset) || 0;

		const response = await getDataSource(client, offset);

		res.json(response);
	});

	app.get('/data-sources/:dataSourceId', async (req, res) => {
		const id = req.params.dataSourceId;

		const response = await getDataSourceById(client, id);

		res.json(response);
	});

	app.get('/data', async (req, res) => {
		const assetId = req.query.assetId || false;
		const dataSourceId = req.query.dataSourceId || false;
		const startBusinessDate = req.query.startBusinessDate || false;
		const endBusinessDate = req.query.endBusinessDate || false;
		const includeAttributes = !!parseInt(req.query.includeAttributes);

		const response = await getData(client, assetId, dataSourceId, startBusinessDate, endBusinessDate, includeAttributes);

		res.json(response);
	});


	app.get('/shutdown', async (req, res) => {
		await client.shutdown();
		const response = 'thanks. bye';

		console.log(response);

		res.json(response);
		server.close();
	});

}

// Run the async function
run();
