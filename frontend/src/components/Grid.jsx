import React from "react";
import "../styles/Grid.css";

function Grid({ items, rows, columns }) {
    const gridStyle = {
        display: "grid",
        gridRows: `repeat(${rows}, 1fr)`,
        gridColumns: `repeat(${columns}, 1fr)`,
        gap: "10px",
    };

    return (
        <div className="grid-container" style={gridStyle}>
            {items.map((item, index) => (
                <div key={index} className="grid-item">
                    {item}
                </div>
            ))}
        </div>
    );
}

export default Grid;
