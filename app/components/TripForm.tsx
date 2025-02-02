import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Trip } from "@/app/components/MapComponent";

interface TripFormProps {
  onSubmit: (trip: Trip) => void;
  initialTrip?: Trip | null;
  selectedLocation?: [number, number] | null;
}

export default function TripForm({
  onSubmit,
  initialTrip,
  selectedLocation,
}: TripFormProps) {
  const [title, setTitle] = useState(initialTrip?.title || "");
  const [description, setDescription] = useState(
    initialTrip?.description || ""
  );
  const [date, setDate] = useState<Date | undefined>(
    initialTrip?.date ? new Date(initialTrip.date) : undefined
  );
  const [location, setLocation] = useState(initialTrip?.location || "");
  const [content, setContent] = useState(initialTrip?.content || "");
  const [gallery, setGallery] = useState<string[]>(initialTrip?.gallery || []);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    if (initialTrip) {
      setTitle(initialTrip.title);
      setDescription(initialTrip.description);
      setDate(initialTrip.date ? new Date(initialTrip.date) : undefined);
      setLocation(initialTrip.location);
      setContent(initialTrip.content);
      setGallery(initialTrip.gallery);
    } else {
      setTitle("");
      setDescription("");
      setDate(undefined);
      setLocation("");
      setContent("");
      setGallery([]);
    }
  }, [initialTrip]);

  useEffect(() => {
    if (selectedLocation) {
      setLocation(
        `${selectedLocation[0].toFixed(6)}, ${selectedLocation[1].toFixed(6)}`
      );
    }
  }, [selectedLocation]);

  useEffect(() => {
    setIsFormValid(!!title && !!description && !!date && !!location);
  }, [title, description, date, location]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      const tripData: Trip = {
        id: initialTrip?.id || Date.now().toString(),
        title,
        description,
        date: date!.toISOString(),
        location,
        content,
        gallery,
        lat: selectedLocation?.[0] || initialTrip?.lat || 0,
        lng: selectedLocation?.[1] || initialTrip?.lng || 0,
      };
      onSubmit(tripData);
      // Reset form fields after submission
      setTitle("");
      setDescription("");
      setDate(undefined);
      setLocation("");
      setContent("");
      setGallery([]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newGallery = [...gallery];
      for (let i = 0; i < files.length && newGallery.length < 10; i++) {
        newGallery.push(URL.createObjectURL(files[i]));
      }
      setGallery(newGallery);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          type="text"
          placeholder="Trip Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Trip Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label>Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          type="text"
          placeholder="Trip Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          placeholder="Trip Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[200px]"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="gallery">Gallery (Max 10 photos)</Label>
        <Input
          id="gallery"
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          disabled={gallery.length >= 10}
        />
        <div className="grid grid-cols-5 gap-2 mt-2">
          {gallery.map((img, index) => (
            <img
              key={index}
              src={img || "/placeholder.svg"}
              alt={`Gallery ${index + 1}`}
              className="w-full h-20 object-cover rounded"
            />
          ))}
        </div>
      </div>
      <Button type="submit" disabled={!isFormValid}>
        {initialTrip ? "Update Trip" : "Add Trip"}
      </Button>
    </form>
  );
}
