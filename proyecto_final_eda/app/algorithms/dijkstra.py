import networkx as nx
import time

def run_dijkstra(graph, origin, destination):

    start_time = time.time()

    path = nx.shortest_path(
        graph,
        source=origin,
        target=destination,
        weight="weight",
        method="dijkstra"
    )

    execution_time = (time.time() - start_time) * 1000

    return path, execution_time