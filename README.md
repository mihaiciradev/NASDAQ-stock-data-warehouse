# Data Warehouse Application

This Node.js application serves as a data warehouse solution for retrieving financial data from the NASDAQ database, performing computations, and storing the processed data in an online database hosted on the DataStax platform. Additionally, the application acts as an API to retrieve the stored data based on different endpoints and parameters.

**Important: Since the application is linked to an online database, running it will not work properly, since the database is turned off on the third-party app.**

## Features

- Retrieve financial data from the NASDAQ database via web requests.
- Process and compute financial data.
- Store processed data in an online database hosted on DataStax.
- Serve as an API to provide access to stored data.
- Support various endpoints and parameters for customized data retrieval.

 ## Usage

### Ingest Data (Fetch and Process)

Run the following command to start the data ingestion process:

**npm run ingest** - This command will fetch data from NASDAQ, process it, and store it in the DataStax database.

### Consume Data (Start Server/API)

Run the following command to start the server and API for data consumption:

**npm run consume** - This command will start the server, allowing you to retrieve stored data through various endpoints.

### Endpoints example

As an example for the consumer, one of the endpoints is "/assets", which will return all the assets present in the database.
