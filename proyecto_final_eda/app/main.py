from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.routes import router

import osmnx as ox

print("Descargando red vial...")

bbox = (19.10, 19.00, -98.15, -98.30)

G = ox.graph_from_bbox(
    bbox=bbox,
    network_type="drive"
)

print("Red vial cargada correctamente")
print(f"Nodos: {G.number_of_nodes()}")
print(f"Aristas: {G.number_of_edges()}")

# IMPORTANTE: esto debe existir
app = FastAPI()

# CORS para React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

@app.get("/")
def root():
    return {"mensaje": "Backend funcionando"}