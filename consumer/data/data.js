import { sendQuery } from "../../const/utils.js";

export async function getData(client, assetId, dataSourceId, startBusinessDate, endBusinessDate, includeAttributes) {
    const limit = 20;

    const areFiltersActive = (assetId);

    const assetFilter = assetId ? `asset_id=${assetId}` : '';
    const dataSourceFilter = dataSourceId ? `data_source_id=${dataSourceId}` : '';
    const startBusinessDateFilter = startBusinessDate ? `business_date>'${startBusinessDate}'` : '';
    const endBusinessDateFilter = endBusinessDate ? `business_date<'${endBusinessDate}'` : '';
    const selector = includeAttributes ? '*' : 'asset_id, data_source_id, business_date, system_date'

    const filters = 'WHERE ' + [assetFilter, dataSourceFilter, startBusinessDateFilter, endBusinessDateFilter].join(' AND ') + ' ALLOW FILTERING';

    const query = `SELECT ${selector} FROM uvt.data ${areFiltersActive ? filters : ''};`;

    console.log(query);

    const response = await sendQuery(client, query);

    return response;
}