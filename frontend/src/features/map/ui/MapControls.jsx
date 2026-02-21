import { useState } from "react";
import { LocateFixed } from "lucide-react";

export default function MapControls({ onCenterToUser }) {

  const stop = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  return (
    <div className="map-controls"onClick={stop} onMouseDown={stop} onDoubleClick={stop}>
    <button
    className="map-control-btn"
        onClick={(e) => {
           e.preventDefault();
           e.stopPropagation();
           onCenterToUser();
  }}
        type="button"
        title="Keskitä sijaintiin"
        aria-label="Keskitä sijaintiin"

        
      >
      <LocateFixed size={22}/> 
      </button>

     
    </div>
  );
}
