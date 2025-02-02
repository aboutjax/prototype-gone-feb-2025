"use client";

import { useEffect, useState } from "react";
import { MapComponent } from "@/app/components/MapComponent";
import type { Trip } from "@/app/components/MapComponent";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TripForm from "./components/TripForm";
import TripList from "./components/TripList";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<
    [number, number] | null
  >(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);

  const addTrip = (trip: Trip) => {
    setTrips((prevTrips) => [
      ...prevTrips,
      { ...trip, id: Date.now().toString() },
    ]);
    setSelectedLocation(null);
    setIsDialogOpen(false);
    setEditingTrip(null); // Add this line to reset editingTrip
  };

  const updateTrip = (updatedTrip: Trip) => {
    setTrips((prevTrips) =>
      prevTrips.map((trip) => (trip.id === updatedTrip.id ? updatedTrip : trip))
    );
    setEditingTrip(null);
    setIsDialogOpen(false);
  };

  const handleMapClick = (latlng: [number, number]) => {
    setSelectedLocation(latlng);
    setEditingTrip(null);
    setIsDialogOpen(true);
  };
  const handleTripClick = (trip: Trip) => {
    if (map) {
      map.flyTo({
        center: [trip.lng, trip.lat],
        zoom: 12,
        speed: 1,
        essential: true,
      });
    }
  };

  const handleEditTrip = (trip: Trip) => {
    setEditingTrip(trip);
    setIsDialogOpen(true);
  };

  const deleteTrip = (id: string) => {
    setTrips((prevTrips) => prevTrips.filter((trip) => trip.id !== id));
  };

  return (
    <div className="flex h-screen">
      <div className="w-[380px] fixed z-10 left-0 p-4  overflow-y-auto">
        <TripList
          trips={trips}
          onTripClick={handleTripClick}
          onEditTrip={handleEditTrip}
          onDeleteTrip={deleteTrip}
        />
      </div>
      <div className="w-full">
        <MapComponent
          setMapInstance={setMap}
          trips={trips}
          onMapClick={handleMapClick}
          onTripClick={handleTripClick}
        />
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingTrip ? "Edit Trip" : "Add a New Trip"}
            </DialogTitle>
          </DialogHeader>
          <TripForm
            onSubmit={editingTrip ? updateTrip : addTrip}
            initialTrip={editingTrip}
            selectedLocation={selectedLocation}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
