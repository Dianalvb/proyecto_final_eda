import networkx as nx
import time

def dijkstra_route(G, start_node, end_node):

    start_time = time.time()

    route = nx.shortest_path(
        G,
        start_node,
        end_node,
        weight="length"
    )

    execution_time = (time.time() - start_time) * 1000

    distance = nx.shortest_path_length(
        G,
        start_node,
        end_node,
        weight="length"
    )

    return route, distance, execution_time