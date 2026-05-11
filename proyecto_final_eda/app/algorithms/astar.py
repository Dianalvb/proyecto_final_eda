import networkx as nx
import time

def heuristic(u, v, G):

    y1 = G.nodes[u]["y"]
    x1 = G.nodes[u]["x"]

    y2 = G.nodes[v]["y"]
    x2 = G.nodes[v]["x"]

    return ((x1 - x2) ** 2 + (y1 - y2) ** 2) ** 0.5


def astar_route(G, start_node, end_node):

    start_time = time.time()

    route = nx.astar_path(
        G,
        start_node,
        end_node,
        heuristic=lambda u, v: heuristic(u, v, G),
        weight="length"
    )

    execution_time = (time.time() - start_time) * 1000

    distance = nx.path_weight(
        G,
        route,
        weight="length"
    )

    return route, distance, execution_time