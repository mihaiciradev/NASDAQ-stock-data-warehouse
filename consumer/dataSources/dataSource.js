import { sendQuery } from "../../const/utils.js";

export async function getDataSource(client, offset) {
    const limit = 20;

    const query = `SELECT * FROM uvt.data_source;`;
    const response = await sendQuery(client, query);

    //filter the response keyword in memory


    return response;
}