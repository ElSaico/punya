punya
=====

## Components

### Front end

  - Static site posted on Cloudflare
  - Sveltekit
  - UI inspired by Elite Dangerous itself
    - daisyUI 5 for core structures
    - Bits UI for tricker components (so far only the system autocomplete)

### Database

  - Cloudflare D1?
    - Free tier
    - Good old SQLite
    - Nice integration with Workers
    - No spatial support (making distance search far more complex)
  - Oracle Autonomous Database?
    - Free tier
    - Oracle Spatial!
    - Builtin REST API via ORDS
      - Can it have the distance filters set up?
    - Sequelize is the only proper Node ORM (needs custom data class for spatial)
    - No RETURNING on upsert
      - Apparently Sequelize handles this
  - Oracle HeatWave?
    - Free tier
    - Good old MySQL
    - Spatial data types
    - Upsert only checks PK, lacks RETURNING
  - Azure Cosmos DB?
    - Free tier lasts 30 days, infinitely renewable
      - Would require some kind of automated "maintenance"
    - Several APIs (the PostgreSQL one supports PostGIS!)
  - Azure SQL?
    - Free tier
    - Good old SQL Server
    - Spatial data types
    - Sequelize is the only proper Node ORM (needs custom data class for spatial)

### EDDN collector

  - Constantly running (means no serverless)
  - Lightweight enough for a cloud VM free tier
  - Must connect with database in some way
  
### API

  - Can integrate to other components, depending on solution