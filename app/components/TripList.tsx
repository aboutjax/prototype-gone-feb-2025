import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Trip } from "@/app/components/MapComponent";

interface TripListProps {
  trips: Trip[];
  onTripClick: (trip: Trip) => void;
  onEditTrip: (trip: Trip) => void;
  onDeleteTrip: (id: string) => void;
}

export default function TripList({
  trips,
  onTripClick,
  onEditTrip,
  onDeleteTrip,
}: TripListProps) {
  // Sort trips by date in descending order (newest first)
  const sortedTrips = [...trips].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <div className="space-y-4">
      {sortedTrips.map((trip) => (
        <div key={trip.id} className="bg-white p-4 rounded shadow">
          <div className="flex items-center justify-between mb-2">
            <h3
              className="font-semibold text-lg cursor-pointer"
              onClick={() => onTripClick(trip)}
            >
              {trip.title}
            </h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEditTrip(trip)}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDeleteTrip(trip.id)}>
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <p className="text-sm text-gray-600 mb-2">{trip.description}</p>
          <p className="text-sm text-gray-500 mb-1">
            📅 {new Date(trip.date).toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-500 mb-2">📍 {trip.location}</p>
          {trip.gallery.length > 0 && (
            <div className="flex space-x-2 overflow-x-auto">
              {trip.gallery.slice(0, 3).map((img, index) => (
                <img
                  key={index}
                  src={img || "/placeholder.svg"}
                  alt={`Trip ${index + 1}`}
                  className="w-16 h-16 object-cover rounded"
                />
              ))}
              {trip.gallery.length > 3 && (
                <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-gray-600">
                  +{trip.gallery.length - 3}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
