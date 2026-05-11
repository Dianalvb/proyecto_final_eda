import networkx as nx
import time
from itertools import islice

def run_k_shortest(graph, origin, destination, k=3):

    start_time = time.time()

    paths = list(
        islice(
            nx.shortest_simple_paths(
                graph,
                origin,
                destination,
                weight="weight"
            ),
            k
        )
    )

    execution_time = (time.time() - start_time) * 1000

    return paths, execution_time