import osmnx as ox
from app.config.settings import DEFAULT_SPEED_KMH

print("Descargando red vial...")

# Coordenadas del centro de Puebla
center_point = (19.0414, -98.2063)

# Descargar calles alrededor del punto
G = ox.graph_from_point(
    center_point,
    dist=5000,
    network_type="drive"
)

print("Red vial cargada")

# Velocidad en m/s
speed_m_per_s = (DEFAULT_SPEED_KMH * 1000) / 3600

# Agregar pesos a las aristas
for u, v, key, data in G.edges(keys=True, data=True):

    distance = data.get("length", 1)

    time_seconds = distance / speed_m_per_s

    data["weight"] = distance
    data["time"] = time_seconds