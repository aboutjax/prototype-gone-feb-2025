import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

export interface Trip {
  id: string;
  title: string;
  description: string;
  content: string;
  location: string;
  gallery: string[];
  date: string;
  lng: number; // changed from longitude
  lat: number; // changed from latitude
}

interface MapComponentProps {
  setMapInstance: (map: mapboxgl.Map) => void;
  trips: Trip[];
  onMapClick: (latlng: [number, number]) => void;
  onTripClick: (trip: Trip) => void;
}

function MapComponent({
  setMapInstance,
  trips,
  onMapClick,
  onTripClick,
}: MapComponentProps) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null); // Add this line

  const [lng, setLng] = useState(-70);
  const [lat, setLat] = useState(40);
  const [zoom, setZoom] = useState(2);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-74.5, 40], // Default position
      zoom: 9,
      accessToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
    });

    mapInstanceRef.current = map;
    setMapInstance(map); // Pass the map instance to parent

    map.on("click", (e) => {
      onMapClick([e.lngLat.lat, e.lngLat.lng]);
    });

    return () => map.remove(); // Cleanup on unmount
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const markers = document.getElementsByClassName("mapboxgl-marker");
    while (markers[0]) {
      markers[0].parentNode?.removeChild(markers[0]);
    }

    // Add markers for trips
    trips.forEach((trip) => {
      const el = document.createElement("div");
      el.className = "marker";
      el.innerHTML = "📍";
      el.style.fontSize = "56px";
      el.style.cursor = "pointer";

      const popupContent = `
          <h3 class="font-semibold">${trip.title}</h3>
          <p class="text-sm">${trip.description}</p>
          <p class="text-xs">📍 ${trip.location}</p>
        `;

      const marker = new mapboxgl.Marker(el)
        .setLngLat([trip.lng, trip.lat])
        .addTo(mapInstanceRef.current!);
      // .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(popupContent))

      el.addEventListener("click", (e) => {
        e.stopPropagation(); // Prevent the map click event from firing
        onTripClick(trip);
      });
    });
  }, [trips, onTripClick]);

  return (
    <div
      ref={mapContainerRef}
      className="map-container"
      style={{ height: "100vh", width: "100%" }}
    />
  );
}

export { MapComponent };
