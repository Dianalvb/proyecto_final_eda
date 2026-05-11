from pydantic import BaseModel
from typing import List

class RouteRequest(BaseModel):
    origin_lat: float
    origin_lon: float
    destination_lat: float
    destination_lon: float
    algorithm: str


class RouteResponse(BaseModel):
    algorithm: str
    distance_meters: float
    estimated_time_seconds: float
    execution_time_ms: float
    nodes_explored: int
    coordinates: List[List[float]]