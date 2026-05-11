from fastapi import APIRouter, HTTPException
import osmnx as ox

from app.schemas.route_schema import RouteRequest
from app.services.graph_service import G

from app.algorithms.dijkstra import dijkstra_route
from app.algorithms.astar import astar_route
from app.algorithms.k_shortest import k_shortest_routes

from app.utils.metrics import route_to_coordinates



router = APIRouter()



@router.post("/routes")
def calculate_route(data: RouteRequest):

    try:

        start_node = ox.distance.nearest_nodes(
            G,
            data.lon_inicio,
            data.lat_inicio
        )

        end_node = ox.distance.nearest_nodes(
            G,
            data.lon_destino,
            data.lat_destino
        )

        if data.algorithm == "dijkstra":

            route, distance, exec_time = dijkstra_route(
                G,
                start_node,
                end_node
            )

            coordinates = route_to_coordinates(G, route)

            return {
                "algorithm": "dijkstra",
                "distance_meters": round(distance, 2),
                "execution_time_ms": round(exec_time, 2),
                "path": coordinates
            }

        elif data.algorithm == "astar":

            route, distance, exec_time = astar_route(
                G,
                start_node,
                end_node
            )

            coordinates = route_to_coordinates(G, route)

            return {
                "algorithm": "astar",
                "distance_meters": round(distance, 2),
                "execution_time_ms": round(exec_time, 2),
                "path": coordinates
            }

        elif data.algorithm == "kshortest":

            routes, exec_time = k_shortest_routes(
                G,
                start_node,
                end_node
            )

            formatted_routes = []

            for route in routes:

                coordinates = route_to_coordinates(G, route)

                formatted_routes.append(coordinates)

            return {
                "algorithm": "kshortest",
                "execution_time_ms": round(exec_time, 2),
                "routes": formatted_routes
            }

        else:
            raise HTTPException(
                status_code=400,
                detail="Algoritmo no válido"
            )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )