# elements-analytics

Open API providing analytics about elements chain

## Docs

- GET /api/asset/:asset_id - get asset info
- GET /api/asset?regexp="string" - get all assets where asset.name OR asset.ticker OR asset.id match regexp
- GET /api/asset/supply - get asset supply / block height
- GET /ping

- GET /api/asset/:asset_id/enable - enable supply graph computation for an asset (requires authentication)
- DELETE /api/asset/:asset_id - delete graph data for an asset (requires authentication)



* middleware

- logger - log all requests
- authentication - check if request has valid token
