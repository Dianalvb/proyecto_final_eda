def route_to_coordinates(G, route):

    coordinates = []

    for node in route:
        lat = G.nodes[node]["y"]
        lon = G.nodes[node]["x"]

        coordinates.append([lat, lon])

    return coordinates