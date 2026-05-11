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

  const [inicio, setInicio] = useState({
    lat: 19.0433,
    lng: -98.2019
  });

  const [fin, setFin] = useState({
    lat: 19.0355,
    lng: -98.2142
  });

  const [ruta, setRuta] = useState(RUTA_POR_DEFECTO);

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
      // CAMBIO IMPORTANTE
      // =========================
      // Ahora usamos los nombres
      // que espera FastAPI
      // =========================
      const body = {
        lat_inicio: Number(inicio.lat),
        lon_inicio: Number(inicio.lng),

        lat_destino: Number(fin.lat),
        lon_destino: Number(fin.lng),

        algorithm: "dijkstra"
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

      // =========================
      // CAMBIO IMPORTANTE
      // =========================
      // El backend devuelve "path"
      // no "ruta"
      // =========================
      if (!data.path || data.path.length === 0) {
        alert("No se encontró ruta");
        return;
      }

      setRuta({
        path: data.path
      });

    } catch (error) {

      console.error(error);
      alert("Error conectando con el backend");
    }
  };

  return (
    <div className="p-4 grid gap-4">

      <h1 className="text-2xl font-bold">
        Rutas Óptimas con Dijkstra
      </h1>

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
          placeholder="Latitud fin"
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
          placeholder="Longitud fin"
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

      <button
        onClick={calcularRuta}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Calcular ruta
      </button>

      <MapContainer
        center={RUTA_POR_DEFECTO.path[0]}
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

        {inicio.lat && inicio.lng && (
          <Marker
            position={[
              Number(inicio.lat),
              Number(inicio.lng)
            ]}
          >
            <Popup>Inicio</Popup>
          </Marker>
        )}

        {fin.lat && fin.lng && (
          <Marker
            position={[
              Number(fin.lat),
              Number(fin.lng)
            ]}
          >
            <Popup>Fin</Popup>
          </Marker>
        )}

        {ruta?.path?.length > 0 && (
          <Polyline
            positions={ruta.path}
            color="blue"
          />
        )}

      </MapContainer>

    </div>
  );
};

export default MapaRuta;