from fastapi import APIRouter, HTTPException
import osmnx as ox

from app.schemas.route_schema import RouteRequest
from app.services.graph_service import G

from app.algorithms.dijkstra import run_dijkstra
from app.algorithms.astar import run_astar
from app.algorithms.k_shortest import run_k_shortest

from app.utils.metrics import (
    calculate_distance,
    calculate_time,
    path_to_coordinates
)

router = APIRouter()

@router.post("/route")

def calculate_route(request: RouteRequest):

    try:

        origin = ox.distance.nearest_nodes(
            G,
            request.origin_lon,
            request.origin_lat
        )

        destination = ox.distance.nearest_nodes(
            G,
            request.destination_lon,
            request.destination_lat
        )

        if request.algorithm == "dijkstra":

            path, execution_time = run_dijkstra(
                G,
                origin,
                destination
            )

            return {
                "algorithm": "Dijkstra",
                "distance_meters": calculate_distance(G, path),
                "estimated_time_seconds": calculate_time(G, path),
                "execution_time_ms": execution_time,
                "nodes_explored": len(path),
                "coordinates": path_to_coordinates(G, path)
            }

        elif request.algorithm == "astar":

            path, execution_time = run_astar(
                G,
                origin,
                destination
            )

            return {
                "algorithm": "A*",
                "distance_meters": calculate_distance(G, path),
                "estimated_time_seconds": calculate_time(G, path),
                "execution_time_ms": execution_time,
                "nodes_explored": len(path),
                "coordinates": path_to_coordinates(G, path)
            }

        elif request.algorithm == "kshortest":

            paths, execution_time = run_k_shortest(
                G,
                origin,
                destination
            )

            routes = []

            for path in paths:

                routes.append({
                    "distance_meters": calculate_distance(G, path),
                    "estimated_time_seconds": calculate_time(G, path),
                    "nodes_explored": len(path),
                    "coordinates": path_to_coordinates(G, path)
                })

            return {
                "algorithm": "k-shortest-paths",
                "execution_time_ms": execution_time,
                "routes": routes
            }

        else:
            raise HTTPException(status_code=400, detail="Algoritmo inválido")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))