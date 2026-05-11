import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

const colores = [
  "blue",
  "red",
  "green",
  "purple",
  "orange"
];

const MapaRuta = () => {

  const [inicio, setInicio] = useState({
    lat: 19.0433,
    lng: -98.2019
  });

  const [fin, setFin] = useState({
    lat: 19.0355,
    lng: -98.2142
  });

  const [algoritmo, setAlgoritmo] = useState("dijkstra");

  const [ruta, setRuta] = useState([]);
  const [rutas, setRutas] = useState([]);

  const [metricas, setMetricas] = useState(null);

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

      const body = {
        lat_inicio: Number(inicio.lat),
        lon_inicio: Number(inicio.lng),
        lat_destino: Number(fin.lat),
        lon_destino: Number(fin.lng),
        algorithm: algoritmo
      };

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

      setMetricas(data);

      // K shortest
      if (algoritmo === "kshortest") {

        if (!data.routes) {
          alert("No se encontraron rutas");
          return;
        }

        setRutas(data.routes);
        setRuta([]);

      } else {

        if (!data.path) {
          alert("No se encontró ruta");
          return;
        }

        setRuta(data.path);
        setRutas([]);
      }

    } catch (error) {

      console.error(error);
      alert("Error conectando con backend");
    }
  };

  return (
    <div className="p-4 grid gap-4">

      <h1 className="text-2xl font-bold">
        Rutas Óptimas
      </h1>

      {/* Inputs */}
      <div className="grid grid-cols-2 gap-2">

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

      {/* Selector algoritmo */}
      <select
        value={algoritmo}
        onChange={(e) => setAlgoritmo(e.target.value)}
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

      {/* Botón */}
      <button
        onClick={calcularRuta}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Calcular Ruta
      </button>

      {/* Métricas */}
      {metricas && (
        <div className="border p-4 rounded bg-gray-100">

          <p>
            <strong>Algoritmo:</strong>
            {" "}
            {metricas.algorithm}
          </p>

          {metricas.distance_meters && (
            <p>
              <strong>Distancia:</strong>
              {" "}
              {metricas.distance_meters}
              {" "}
              metros
            </p>
          )}

          <p>
            <strong>Tiempo:</strong>
            {" "}
            {metricas.execution_time_ms}
            {" "}
            ms
          </p>

        </div>
      )}

      {/* MAPA */}
      <MapContainer
        center={[19.0433, -98.2019]}
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
          <Popup>Inicio</Popup>
        </Marker>

        {/* Destino */}
        <Marker
          position={[
            Number(fin.lat),
            Number(fin.lng)
          ]}
        >
          <Popup>Destino</Popup>
        </Marker>

        {/* Ruta única */}
        {ruta.length > 0 && (
          <Polyline
            positions={ruta}
            color="blue"
          />
        )}

        {/* Múltiples rutas */}
        {rutas.length > 0 &&
          rutas.map((r, index) => (

            <Polyline
              key={index}
              positions={r}
              color={colores[index % colores.length]}
            />

          ))
        }

      </MapContainer>

    </div>
  );
};

export default MapaRuta;