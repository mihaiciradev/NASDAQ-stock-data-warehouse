import { sendQuery } from "../../const/utils.js";

export async function getAssetsById(client, id) {
    const query = `SELECT * FROM uvt.asset where id = ${id};`;
    const response = await sendQuery(client, query);

    //filter the response keyword in memory

    return response[0];
}