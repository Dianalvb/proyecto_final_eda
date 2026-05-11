import osmnx as ox

ox.settings.use_cache = True
ox.settings.log_console = False

print("Descargando red vial...")

# Puebla centro aproximado
CENTER_POINT = (19.0433, -98.2019)

# radio en metros
DISTANCE = 5000

# CAMBIO IMPORTANTE:
# usamos graph_from_point en vez de graph_from_place

G = ox.graph_from_point(
    CENTER_POINT,
    dist=DISTANCE,
    network_type="drive"
)

print("Red vial cargada correctamente")
print(f"Nodos: {len(G.nodes)}")
print(f"Aristas: {len(G.edges)}")