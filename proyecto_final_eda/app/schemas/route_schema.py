from pydantic import BaseModel

class RouteRequest(BaseModel):
    lat_inicio: float
    lon_inicio: float
    lat_destino: float
    lon_destino: float
    algorithm: str