"use client";

import { useEffect, useState } from "react";
import { EventModel } from "@/models/Events";
import { getEvents } from "@/api/getEvents";
import Loader from "./Loader";
import EventDetailsSheet from "./EventDetailsSheet";

export default function EventsWidget() {
    const [events, setEvents] = useState<EventModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState<EventModel | null>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    useEffect(() => {
        setLoading(true);
        getEvents()
            .then((data) => {
                if (data) setEvents(data);
            })
            .catch((err) => console.error("Failed to fetch events:", err))
            .finally(() => setLoading(false));
    }, []);

    const openDetails = (event: EventModel) => {
        setSelectedEvent(event);
        setIsSheetOpen(true);
    };

    const closeDetails = () => {
        setIsSheetOpen(false);
        setSelectedEvent(null);
    };

    if (loading) return <Loader />;

    if (!loading && events.length > 0) {
        return (
            <>
                <h2 className="text-xl font-semibold text-pink-400 my-4">ಸುತ್ತ - ಮುತ್ತ</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {events.map((event) => (
                        <div
                            key={event.id}
                            className="border border-gray-300 rounded-lg overflow-hidden bg-white flex flex-col"
                            onClick={() => openDetails(event)}>
                            {/* Image */}
                            <div className="w-full h-[60%] bg-gray-100 overflow-hidden">
                                <img
                                    src={event.image_url}
                                    alt={event.title}
                                    className="w-full h-60 object-cover object-top"
                                    loading="lazy"
                                />
                            </div>

                            {/* Event Info */}
                            <div className="p-3 flex flex-col justify-between">
                                <h2
                                    className="text-lg font-semibold mb-1 line-clamp-2"
                                    title={event.title}
                                >
                                    {event.title}
                                </h2>
                                <p className="text-sm text-gray-600 mb-1">
                                    {new Date(event.start_time).toLocaleString("en-IN", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: true,
                                    })}
                                </p>
                                <p className="text-sm text-gray-600 truncate whitespace-nowrap">
                                    <strong>Organiser:</strong> {event.organizer}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
                {selectedEvent && (
                    <EventDetailsSheet
                        open={isSheetOpen}
                        onClose={closeDetails}
                        event={selectedEvent} />
                )}</>
        );
    }
}
