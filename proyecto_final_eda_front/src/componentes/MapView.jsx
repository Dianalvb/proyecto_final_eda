import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

const RUTA_POR_DEFECTO = {
  path: [
    [19.0433, -98.2019],
    [19.0415, -98.2063],
    [19.0389, -98.2101],
    [19.0355, -98.2142]
  ]
};

const MapaRuta = () => {

  // =========================
  // Coordenadas
  // =========================
  const [inicio, setInicio] = useState({
    lat: 19.0433,
    lng: -98.2019
  });

  const [fin, setFin] = useState({
    lat: 19.0355,
    lng: -98.2142
  });

  // =========================
  // Algoritmo seleccionado
  // =========================
  const [algoritmo, setAlgoritmo] =
    useState("dijkstra");

  // =========================
  // Ruta
  // =========================
  const [ruta, setRuta] =
    useState(RUTA_POR_DEFECTO);

  // =========================
  // Métricas
  // =========================
  const [metricas, setMetricas] =
    useState({
      distancia: 0,
      tiempo: 0
    });

  // =========================
  // Calcular ruta
  // =========================
  const calcularRuta = async () => {

    if (
      !inicio.lat ||
      !inicio.lng ||
      !fin.lat ||
      !fin.lng
    ) {
      alert("Completa todas las coordenadas");
      return;
    }

    try {

      // =========================
      // Body enviado al backend
      // =========================
      const body = {
        lat_inicio: Number(inicio.lat),
        lon_inicio: Number(inicio.lng),

        lat_destino: Number(fin.lat),
        lon_destino: Number(fin.lng),

        algorithm: algoritmo
      };

      // =========================
      // Request al backend
      // =========================
      const response = await fetch(
        "http://127.0.0.1:8000/routes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(body)
        }
      );

      const data = await response.json();

      console.log(data);

      // =========================
      // K shortest
      // =========================
      if (algoritmo === "kshortest") {

        if (
          !data.routes ||
          data.routes.length === 0
        ) {
          alert("No se encontraron rutas");
          return;
        }

        setRuta({
          path: data.routes[0]
        });

        setMetricas({
          distancia: 0,
          tiempo: data.execution_time_ms
        });

      } else {

        // =========================
        // Dijkstra / A*
        // =========================
        if (
          !data.path ||
          data.path.length === 0
        ) {
          alert("No se encontró ruta");
          return;
        }

        setRuta({
          path: data.path
        });

        // =========================
        // Guardar métricas
        // =========================
        setMetricas({
          distancia: data.distance_meters,
          tiempo: data.execution_time_ms
        });
      }

    } catch (error) {

      console.error(error);
      alert("Error conectando con backend");
    }
  };

  return (

    <div className="min-h-screen bg-gray-100 p-6">

      <div className="bg-white p-6 rounded-xl shadow-lg grid gap-4">

        {/* ========================= */}
        {/* Título */}
        {/* ========================= */}
        <h1 className="text-3xl font-bold text-center">
          Sistema de Rutas Óptimas
        </h1>

        {/* ========================= */}
        {/* Selector algoritmo */}
        {/* ========================= */}
        <div className="grid gap-2">

          <label className="font-semibold">
            Algoritmo
          </label>

          <select
            value={algoritmo}
            onChange={(e) =>
              setAlgoritmo(e.target.value)
            }
            className="border p-2 rounded"
          >

            <option value="dijkstra">
              Dijkstra
            </option>

            <option value="astar">
              A*
            </option>

            <option value="kshortest">
              K Shortest Paths
            </option>

          </select>

        </div>

        {/* ========================= */}
        {/* Inputs */}
        {/* ========================= */}
        <div className="grid grid-cols-2 gap-3">

          <input
            type="number"
            step="any"
            placeholder="Latitud inicio"
            value={inicio.lat}
            onChange={(e) =>
              setInicio({
                ...inicio,
                lat: e.target.value
              })
            }
            className="border p-2 rounded"
          />

          <input
            type="number"
            step="any"
            placeholder="Longitud inicio"
            value={inicio.lng}
            onChange={(e) =>
              setInicio({
                ...inicio,
                lng: e.target.value
              })
            }
            className="border p-2 rounded"
          />

          <input
            type="number"
            step="any"
            placeholder="Latitud destino"
            value={fin.lat}
            onChange={(e) =>
              setFin({
                ...fin,
                lat: e.target.value
              })
            }
            className="border p-2 rounded"
          />

          <input
            type="number"
            step="any"
            placeholder="Longitud destino"
            value={fin.lng}
            onChange={(e) =>
              setFin({
                ...fin,
                lng: e.target.value
              })
            }
            className="border p-2 rounded"
          />

        </div>

        {/* ========================= */}
        {/* Botón */}
        {/* ========================= */}
        <button
          onClick={calcularRuta}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold"
        >
          Calcular Ruta
        </button>

        {/* ========================= */}
        {/* Métricas */}
        {/* ========================= */}
        <div className="bg-gray-50 border rounded p-4 grid gap-2">

          <h2 className="text-xl font-bold">
            Métricas
          </h2>

          <p>
            <strong>Algoritmo:</strong>
            {" "}
            {algoritmo}
          </p>

          <p>
            <strong>Distancia:</strong>
            {" "}
            {metricas.distancia}
            {" "}
            metros
          </p>

          <p>
            <strong>Tiempo ejecución:</strong>
            {" "}
            {metricas.tiempo}
            {" "}
            ms
          </p>

        </div>

        {/* ========================= */}
        {/* MAPA */}
        {/* ========================= */}
        <MapContainer
          center={RUTA_POR_DEFECTO.path[0]}
          zoom={14}
          style={{
            height: "550px",
            width: "100%"
          }}
        >

          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Inicio */}
          {inicio.lat && inicio.lng && (
            <Marker
              position={[
                Number(inicio.lat),
                Number(inicio.lng)
              ]}
            >
              <Popup>
                Punto de inicio
              </Popup>
            </Marker>
          )}

          {/* Destino */}
          {fin.lat && fin.lng && (
            <Marker
              position={[
                Number(fin.lat),
                Number(fin.lng)
              ]}
            >
              <Popup>
                Punto destino
              </Popup>
            </Marker>
          )}

          {/* Ruta */}
          {ruta?.path?.length > 0 && (
            <Polyline
              positions={ruta.path}
              color="blue"
            />
          )}

        </MapContainer>

      </div>

    </div>
  );
};

export default MapaRuta;