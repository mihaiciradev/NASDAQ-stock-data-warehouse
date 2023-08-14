import { sendQuery } from "../../const/utils.js";

export async function getAssets(client, offset) {
    const limit = 20;

    const query = `SELECT * FROM uvt.asset;`;
    const response = await sendQuery(client, query);

    //filter the response keyword in memory


    return response;
}