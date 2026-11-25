# How the map data was made

The pages do not need these scripts. They are only for rebuilding `assets/map/` (v4 uses `southeast.json`; v5 also uses `charlotte.json`, `relief.webp` and `mask.webp`).

- `geo.py` writes `southeast.json`. Needs Python with shapely 2.0.6 and three files in one folder:
  - `us.json`: https://cdn.jsdelivr.net/npm/us-atlas@3.0.1/states-albers-10m.json
  - `counties.json`: https://cdn.jsdelivr.net/npm/us-atlas@3.0.1/counties-albers-10m.json
  - `world.json`: https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-50m.json
- `bake.py` writes the other three. Needs numpy and Pillow, and in one folder:
  - `dem/<x>-<y>.png`: Terrain Tiles, terrarium, zoom 6, x 12–19, y 23–28 (https://s3.amazonaws.com/elevation-tiles-prod/terrarium/6/{x}/{y}.png)
  - `roads1.json`, `city.json`, `county.json`, `tryon8.json`: TIGERweb queries as GeoJSON (primary roads in -81.45,34.85,-80.35,35.65; Charlotte city 3712000; Mecklenburg County 37119; S Tryon St)
- The two showrooms were located with the US Census Geocoder: 6010 Kenley Lane (-80.886793, 35.157546) and 1316 South Tryon Street (-80.854135, 35.218174).

v5 uses a wider sheet than these defaults (25 Nov 2026, for the full-screen map):

- `geo.py`: `W=box(-420,-120,1480,1180)`, grid longitudes -124 to -60, grid latitudes 18 to 48, parallels drawn from 16 to 50, and Canada (`'124'`) added to the neighbours.
- `bake.py`: `X0,X1,Y0,Y1=8,19,22,29`, `BX=(-780,540)`, `BZ=(-360,430)`, `W=2816`; Terrain Tiles x 8–19, y 22–29.
