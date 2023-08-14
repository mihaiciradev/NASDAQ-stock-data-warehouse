export function isInt(value) {
  if (isNaN(value)) {
    return false;
  }
  const num = parseFloat(value);
  return Number.isInteger(num);
}

export function isFloat(value) {
  if (isNaN(value)) {
    return false;
  }
  const num = parseFloat(value);
  return !Number.isNaN(num) && !Number.isInteger(num);
}

export async function makeDelayedRequest(fetchFn, url, delayMs) {
  // Helper function: delay
  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  await delay(delayMs);
  return fetchFn(url);
}

export function formatUnixTime(value) {
  // format to: yyyy/mm/dd
  var unixTimestamp = value;

  var date = new Date(unixTimestamp);

  // Generate date string

  const dateElements = date.toLocaleDateString('en-GB').split('/');

  return `${dateElements[2]}-${dateElements[1]}-${dateElements[0]}`;
}

export async function sendQuery(client, query, label) {
  const rs = await client.execute(query);
  if (!!label)
    console.log(`Your cluster returned ${rs.rowLength} row(s). ${label ? label : ''}`);
  return rs.rows;
}
