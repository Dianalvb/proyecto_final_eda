import networkx as nx
import time
from itertools import islice

def k_shortest_routes(G, start_node, end_node, k=3):

    start_time = time.time()

    routes = list(
        islice(
            nx.shortest_simple_paths(
                G,
                start_node,
                end_node,
                weight="length"
            ),
            k
        )
    )

    execution_time = (time.time() - start_time) * 1000

    return routes, execution_time