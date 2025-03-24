punya
=====

## Components

### Front end

  - Static site posted on Cloudflare
    - Consider Azure as other components are moving there
  - Sveltekit
  - UI inspired by Elite Dangerous itself
    - daisyUI 5 for core structures
    - Bits UI for tricker components (so far only the system autocomplete)

### Database

  - ~~Cloudflare D1?~~
    - ~~Free tier~~
    - ~~Good old SQLite~~
    - ~~Native integration with Workers~~
    - ~~No geospatial support (making distance search unnecessarily complex)~~
  - ~~Oracle Autonomous Database?~~
    - ~~Free tier~~
    - ~~Oracle Spatial!~~
    - ~~Builtin REST API via ORDS~~
      - ~~Can it have the distance filters set up?~~
    - ~~Sequelize is the only proper Node ORM~~
      - ~~Geospatial type not implemented for this DB~~
      - ~~Upsert is too constrained, collector would need to go raw~~
    - ~~No RETURNING on upsert~~
      - ~~Sequelize works around this, but see above~~
  - ~~Oracle HeatWave?~~
    - ~~Free tier~~
    - ~~Good old MySQL~~
    - ~~Geospatial data types~~
    - ~~Upsert only checks PK, lacks RETURNING~~
  - Azure Cosmos DB?
    - Free tier lasts 30 days, infinitely renewable
      - Would require some kind of automated "maintenance"
    - Multiple APIs (the PostgreSQL one supports PostGIS!)
  - Azure SQL?
    - Free tier
    - Good old SQL Server
    - Geospatial data types
    - Sequelize is the only proper Node ORM
      - Same issues as Oracle, however

### EDDN collector

  - Constantly running; serverless is not an option
  - Lightweight enough for a cloud VM free tier
  - Must connect with database in some way

### API

  - Cloudflare Workers?
    - Lacks support from MSAL, if we stick with Azure SQL
      - https://github.com/Azure/azure-sdk-for-js/pull/32422
      - ~~Blocked by https://github.com/cloudflare/workerd/issues/3284~~
  - Azure Functions?
    - A natural integration with their database... presumably
    - Lower free tier (1m/month vs. 100k/day for Cloudflare)
      - Still, FaaS is very cheap
    - Terrible documentation
    - Too much friction for simpler use cases like this