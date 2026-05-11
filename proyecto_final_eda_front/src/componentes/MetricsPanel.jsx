export default function MetricsPanel({ metrics }) {

    if (!metrics) return null;

    return (
        <div className="metrics-panel">

            <h3>Métricas</h3>

            <p>
                <strong>Algoritmo:</strong>
                {" "}
                {metrics.algorithm}
            </p>

            <p>
                <strong>Distancia:</strong>
                {" "}
                {metrics.distance_meters?.toFixed(2)} m
            </p>

            <p>
                <strong>Tiempo estimado:</strong>
                {" "}
                {metrics.estimated_time_seconds?.toFixed(2)} s
            </p>

            <p>
                <strong>Tiempo ejecución:</strong>
                {" "}
                {metrics.execution_time_ms?.toFixed(2)} ms
            </p>

            <p>
                <strong>Nodos explorados:</strong>
                {" "}
                {metrics.nodes_explored}
            </p>

        </div>
    );
}