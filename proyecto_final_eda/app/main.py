from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from pydantic import BaseModel

import osmnx as ox
import networkx as nx

import time

# ====================================================
# CONFIGURACIÓN OSMNX
# ====================================================

ox.settings.use_cache = True
ox.settings.log_console = False

# ====================================================
# DESCARGA DE RED VIAL
# ====================================================

print("Descargando red vial...")

# CAMBIO:
# Antes usabas graph_from_place()
# Ahora usamos graph_from_point()
# porque es más estable.

centro_puebla = (19.0414, -98.2063)

G = ox.graph_from_point(
    centro_puebla,
    dist=5000,
    network_type="drive"
)

print("Red vial cargada")

print(
    f"Nodos: {G.number_of_nodes()}, "
    f"Aristas: {G.number_of_edges()}"
)

# ====================================================
# FASTAPI
# ====================================================

app = FastAPI(
    title="Route Analysis API",
    version="1.0.0"
)

# ====================================================
# CORS
# ====================================================

# CAMBIO:
# Esto permite que React consuma FastAPI.

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ====================================================
# ESQUEMAS
# ====================================================

class RouteRequest(BaseModel):

    lat_inicio: float
    lon_inicio: float

    lat_final: float
    lon_final: float

    algorithm: str = "dijkstra"

# ====================================================
# RUTA PRINCIPAL
# ====================================================

@app.get("/")
def root():

    return {
        "message": "API funcionando"
    }

# ====================================================
# ENDPOINT DE RUTAS
# ====================================================

@app.post("/ruta")
def ruta_corta(data: RouteRequest):

    try:

        start_time = time.time()

        # ============================================
        # NODOS MÁS CERCANOS
        # ============================================

        nodo_inicio = ox.distance.nearest_nodes(
            G,
            data.lon_inicio,
            data.lat_inicio
        )

        nodo_final = ox.distance.nearest_nodes(
            G,
            data.lon_final,
            data.lat_final
        )

        # ============================================
        # ALGORITMOS
        # ============================================

        # CAMBIO:
        # Ahora puedes seleccionar algoritmo.

        if data.algorithm == "dijkstra":

            ruta = nx.shortest_path(
                G,
                nodo_inicio,
                nodo_final,
                weight="length"
            )

        elif data.algorithm == "astar":

            ruta = nx.astar_path(
                G,
                nodo_inicio,
                nodo_final,
                weight="length"
            )

        else:

            raise HTTPException(
                status_code=400,
                detail="Algoritmo inválido"
            )

        # ============================================
        # DISTANCIA TOTAL
        # ============================================

        distancia_total = nx.shortest_path_length(
            G,
            nodo_inicio,
            nodo_final,
            weight="length"
        )

        # ============================================
        # CONVERTIR NODOS → COORDENADAS
        # ============================================

        # CAMBIO:
        # Leaflet necesita coordenadas reales.

        coordenadas = []

        for node in ruta:

            coordenadas.append([
                G.nodes[node]["y"],
                G.nodes[node]["x"]
            ])

        # ============================================
        # MÉTRICAS
        # ============================================

        execution_time = (
            time.time() - start_time
        ) * 1000

        # velocidad promedio aproximada
        estimated_time = distancia_total / 13.89

        return {

            "algorithm": data.algorithm,

            "distance_meters": distancia_total,

            "estimated_time_seconds": estimated_time,

            "execution_time_ms": execution_time,

            "nodes_explored": len(ruta),

            "coordinates": coordenadas
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )