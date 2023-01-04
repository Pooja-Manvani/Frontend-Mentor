import React, { useEffect, useMemo } from "react";
import { Marker, Popup, useMap } from "react-leaflet";
import icon from "../Components/icon";

export default function MarkerPosition({ address, latitude, longitude }) {
  /**
   * @description set Postion as lattitudes, longittudes for marker.
   */

  const position = useMemo(() => {
    return [latitude, longitude];
  }, [latitude, longitude]);
  const map = useMap();
  map.setView([latitude, longitude], map.getZoom());
  /**
   * UseEffect Hook
   */
  useEffect(() => {
    map.flyTo(position, 13, {
      animate: true,
    });
  }, [map, position]);

  return (
    // Start:Marker
    <Marker icon={icon} position={position}>
      <Popup>This is the location of the IP Address or Domain</Popup>
    </Marker>
    // End:Marker
  );
}
