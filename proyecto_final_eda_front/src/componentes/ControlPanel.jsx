export default function ControlPanel({
    algorithm,
    setAlgorithm,
    calculateRoute,
    clearMap
}) {

    return (
        <div className="control-panel">

            <h2>Route Analysis</h2>

            <select
                value={algorithm}
                onChange={(e) => setAlgorithm(e.target.value)}
            >
                <option value="dijkstra">
                    Dijkstra
                </option>

                <option value="astar">
                    A*
                </option>

                <option value="kshortest">
                    k-shortest paths
                </option>
            </select>

            <button onClick={calculateRoute}>
                Calcular Ruta
            </button>

            <button onClick={clearMap}>
                Limpiar
            </button>

        </div>
    );
}