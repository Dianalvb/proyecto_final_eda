import { useState } from "react";

import {
    MapContainer,
    TileLayer,
    Polyline,
    Marker,
    Popup
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

export default function MapaRuta() {

    // ============================================
    // ESTADOS
    // ============================================

    const [inicio, setInicio] = useState({
        lat: 19.0433,
        lng: -98.2019
    });

    const [fin, setFin] = useState({
        lat: 19.0355,
        lng: -98.2142
    });

    // CAMBIO:
    // Ahora la ruta es un array directamente.
    const [ruta, setRuta] = useState([]);

    const [metricas, setMetricas] = useState(null);

    const [loading, setLoading] = useState(false);

    // ============================================
    // CALCULAR RUTA
    // ============================================

    const calcularRuta = async () => {

        try {

            setLoading(true);

            // CAMBIO:
            // Body compatible con FastAPI.
            const body = {

                lat_inicio: Number(inicio.lat),
                lon_inicio: Number(inicio.lng),

                lat_final: Number(fin.lat),
                lon_final: Number(fin.lng),

                algorithm: "dijkstra"
            };

            // CAMBIO:
            // URL real del backend.
            const response = await fetch(
                "http://127.0.0.1:8000/ruta",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(body)
                }
            );

            if (!response.ok) {

                throw new Error(
                    "Error calculando ruta"
                );
            }

            const data = await response.json();

            console.log(data);

            // CAMBIO:
            // coordinates viene desde FastAPI.
            setRuta(data.coordinates);

            setMetricas(data);

        } catch (error) {

            console.error(error);

            alert("Error en backend");

        } finally {

            setLoading(false);
        }
    };

    return (

        <div className="p-4">

            <h1>
                Trazado de ruta
            </h1>

            {/* =========================
                INPUTS
            ========================== */}

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "10px",
                    marginBottom: "10px"
                }}
            >

                <input
                    placeholder="Latitud inicio"
                    value={inicio.lat}
                    onChange={(e) =>
                        setInicio({
                            ...inicio,
                            lat: e.target.value
                        })
                    }
                />

                <input
                    placeholder="Longitud inicio"
                    value={inicio.lng}
                    onChange={(e) =>
                        setInicio({
                            ...inicio,
                            lng: e.target.value
                        })
                    }
                />

                <input
                    placeholder="Latitud fin"
                    value={fin.lat}
                    onChange={(e) =>
                        setFin({
                            ...fin,
                            lat: e.target.value
                        })
                    }
                />

                <input
                    placeholder="Longitud fin"
                    value={fin.lng}
                    onChange={(e) =>
                        setFin({
                            ...fin,
                            lng: e.target.value
                        })
                    }
                />

            </div>

            {/* =========================
                BOTÓN
            ========================== */}

            <button onClick={calcularRuta}>

                {
                    loading
                        ? "Calculando..."
                        : "Calcular ruta"
                }

            </button>

            {/* =========================
                MÉTRICAS
            ========================== */}

            {
                metricas && (

                    <div
                        style={{
                            marginTop: "15px",
                            marginBottom: "15px"
                        }}
                    >

                        <p>
                            <strong>Algoritmo:</strong>
                            {" "}
                            {metricas.algorithm}
                        </p>

                        <p>
                            <strong>Distancia:</strong>
                            {" "}
                            {metricas.distance_meters?.toFixed(2)}
                            {" "}m
                        </p>

                        <p>
                            <strong>Tiempo estimado:</strong>
                            {" "}
                            {metricas.estimated_time_seconds?.toFixed(2)}
                            {" "}s
                        </p>

                        <p>
                            <strong>Tiempo ejecución:</strong>
                            {" "}
                            {metricas.execution_time_ms?.toFixed(2)}
                            {" "}ms
                        </p>

                    </div>
                )
            }

            {/* =========================
                MAPA
            ========================== */}

            <MapContainer
                center={[19.0414, -98.2063]}
                zoom={14}
                style={{
                    height: "500px",
                    width: "100%"
                }}
            >

                <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Inicio */}

                <Marker
                    position={[
                        Number(inicio.lat),
                        Number(inicio.lng)
                    ]}
                >
                    <Popup>
                        Inicio
                    </Popup>
                </Marker>

                {/* Fin */}

                <Marker
                    position={[
                        Number(fin.lat),
                        Number(fin.lng)
                    ]}
                >
                    <Popup>
                        Destino
                    </Popup>
                </Marker>

                {/* Ruta */}

                {
                    ruta.length > 0 && (

                        <Polyline
                            positions={ruta}
                            color="blue"
                        />
                    )
                }

            </MapContainer>

        </div>
    );
}