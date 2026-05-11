def calculate_distance(graph, path):

    total = 0

    for i in range(len(path) - 1):

        edge_data = graph[path[i]][path[i + 1]][0]

        total += edge_data.get("length", 0)

    return total


def calculate_time(graph, path):

    total = 0

    for i in range(len(path) - 1):

        edge_data = graph[path[i]][path[i + 1]][0]

        total += edge_data.get("time", 0)

    return total


def path_to_coordinates(graph, path):

    coordinates = []

    for node in path:

        lat = graph.nodes[node]["y"]
        lon = graph.nodes[node]["x"]

        coordinates.append([lat, lon])

    return coordinates