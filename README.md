punya
=====

## Structure

This is a monorepo powered by [the SST framework](https://sst.dev), which simplifies the job of scattering the
application components across multiple platforms to better leverage any free tiers.

## Components

### Client

  - Static site posted on Cloudflare
  - Sveltekit
  - UI inspired by Elite Dangerous itself
    - daisyUI 5 for core structures
    - Bits UI for trickier components (so far only the system autocomplete)

### Database

  - ~~Cloudflare D1?~~
    - ~~Good old SQLite~~
    - ~~Native integration with Workers~~
    - ~~No geospatial support (making distance search unnecessarily complex)~~
  - ~~Oracle Autonomous Database?~~
    - ~~Geospatial data types~~
    - ~~Builtin REST API via ORDS~~
      - ~~Can it have the distance filters set up?~~
    - ~~Sequelize is the only proper Node ORM~~
      - ~~Geospatial type not implemented for this DB~~
      - ~~With SST we can multilang, though!~~
    - ~~No `RETURNING` on upsert~~
      - ~~Sequelize works around this, but see above~~
  - ~~Oracle HeatWave?~~
    - ~~Good old MySQL~~
    - ~~Geospatial data types~~
    - ~~Upsert lacks functionality (multifield comparison, `RETURNING`)~~
  - Azure Cosmos DB?
    - Free tier lasts 30 days, infinitely renewable
      - Would require some kind of automated "maintenance"
    - Multiple APIs (the PostgreSQL one supports PostGIS!)
  - Azure SQL?
    - Good old SQL Server
    - Geospatial data types
    - Sequelize is the only proper Node ORM
      - Same caveats as Oracle, however
  - ~~AWS Aurora?~~
    - ~~Compatible with PostgreSQL tooling~~
    - ~~No PostGIS (or even fkeys, at that!)~~

### EDDN collector

  - Constantly running; serverless is not an option
  - Lightweight enough for a cloud VM free tier
  - Must connect with database in some way

### API

  - Cloudflare Workers?
    - Their Hono framework is very good
    - Supports MSAL (and thus Azure) since they added `node:crypto` support
  - ~~Azure Functions?~~
    - ~~A natural integration with their database... presumably~~
    - ~~Lower free tier (1m/month vs. 100k/day for Cloudflare)~~
      - ~~Still, FaaS is very cheap~~
    - ~~Terrible documentation~~
    - ~~Too much friction for simpler use cases like this~~