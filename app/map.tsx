"use client";

import { MapContainer, Marker, TileLayer,Tooltip } from "react-leaflet";
import { LatLngExpression, LatLngTuple } from "leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { useEffect, useRef } from "react";
import 'leaflet-rotatedmarker';
interface MapProps {
  posix: LatLngExpression | LatLngTuple;
  zoom?: number;
  flights: string[][];
}

const defaults = {
  zoom: 10,
};

const Plane = new L.Icon({
  iconUrl: "/plane.svg",
  iconSize: [25, 41],
});

const Map = (Map: MapProps) => {
  const flights: string[][] = Map.flights;
  const { zoom = defaults.zoom, posix } = Map;
  const mapRef = useRef<L.Map | null>(null);
  useEffect(() => {
    mapRef.current?.setView(posix, zoom);
  }, [posix]);
  return (
    <MapContainer
      ref={mapRef}
      center={posix}
      zoom={zoom}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />

      {flights.map((flight: string[]) => {
        return (
          <div key={flight[4]} className="rotate-90">
            <Marker
              rotationAngle={Number(flight[6])}
              rotationOrigin="center"
              key={flight[4]}
              icon={Plane}
              position={
                [
                  parseFloat(flight[7]),
                  parseFloat(flight[8]),
                ] as LatLngExpression
              }
              draggable={false}
            >
              <Tooltip
                permanent={true}
                sticky={false}
                direction="top"

                
                offset={[0, 0]}
                className="bg-white text-black"
              >
                <p className="text-black">{flight[4]}</p>
              </Tooltip>
            </Marker>
          </div>
        );
      })}
    </MapContainer>
  );
};

export default Map;
