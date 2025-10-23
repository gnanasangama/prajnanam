"use client";

import { useEffect, useState } from "react";
import { EventModel } from "@/models/Events";
import { getEvents } from "@/api/getEvents";
import Loader from "./Loader";
import EventDetailsSheet, { Chip } from "./EventDetailsSheet";
import { formatLabel } from "@/utils/string_utils";
import { FaCalendarCheck } from "react-icons/fa";

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
                <h2 className="text-xl font-semibold text-pink-400 my-4 flex items-center">
                    <FaCalendarCheck className="text-pink-400 mr-2" />
                    ಸುತ್ತ - ಮುತ್ತ
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {events.map((event) => (
                        <div
                            key={event.id}
                            className="border border-gray-300 rounded-lg overflow-hidden bg-white flex flex-col relative" // Add relative for positioning chips
                            onClick={() => openDetails(event)}
                        >
                            {/* Chips */}
                            <div className="absolute top-2 right-1 flex space-x-2 z-10">
                                {event.event_type === 'online' && <Chip label={`${formatLabel(event.event_type)}`} className="bg-blue-200 text-blue-800" />}
                                <Chip label={`${formatLabel(event.category)}`} className="bg-pink-100 text-pink-500 font-semibold" />
                            </div>

                            {/* Image */}
                            <div className="w-full h-[70%] bg-gray-100 overflow-hidden">
                                <img
                                    src={event.image_url}
                                    alt={event.title}
                                    className="w-full h-60 object-cover object-top"
                                    loading="lazy"
                                />
                            </div>

                            {/* Event Info */}
                            <div className="p-3 flex flex-col justify-between">
                                <h2 className="text-lg font-semibold text-pink-400 line-clamp-2" title={event.title}>
                                    {event.title}
                                </h2>
                                <p className="text-md text-gray-600">
                                    {event.organizer && (
                                        <b>{event.organizer}<br /></b>
                                    )}
                                    {event.start_time && new Date(event.start_time).toLocaleString("en-IN", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: true,
                                    })}
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
