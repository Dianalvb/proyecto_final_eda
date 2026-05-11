import networkx as nx
import time
from math import radians, sin, cos, sqrt, atan2

def heuristic(node1, node2, graph):

    lat1 = graph.nodes[node1]["y"]
    lon1 = graph.nodes[node1]["x"]

    lat2 = graph.nodes[node2]["y"]
    lon2 = graph.nodes[node2]["x"]

    R = 6371000

    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)

    a = sin(dlat / 2) ** 2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon / 2) ** 2

    c = 2 * atan2(sqrt(a), sqrt(1 - a))

    return R * c


def run_astar(graph, origin, destination):

    start_time = time.time()

    path = nx.astar_path(
        graph,
        origin,
        destination,
        heuristic=lambda a, b: heuristic(a, b, graph),
        weight="weight"
    )

    execution_time = (time.time() - start_time) * 1000

    return path, execution_time