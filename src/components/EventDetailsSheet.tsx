"use client";

import { XMarkIcon } from "@heroicons/react/24/solid";
import React, { useEffect } from "react";
import CustomMarkdown from "./CustomMarkdown";
import { EventModel } from "@/models/Events";
import { formatLabel } from "@/utils/string_utils";
// import AdsterraAd320x50 from "./AdsterraAd/320x50";

interface EventDetailsSheetProps {
    open: boolean;
    onClose: () => void;
    event: EventModel;
}

export default function EventDetailsSheet({ open, onClose, event }: EventDetailsSheetProps) {
    // Prevent background scroll when modal is open
    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [open]);

    if (!open) return null;

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 pb-16">
                <div className="bg-white rounded-t-2xl w-full max-w-md shadow-lg animate-slideup h-[80vh] flex flex-col">
                    {/* Header (fixed) */}
                    <div className="px-4 py-3 flex items-center justify-between border-b border-gray-300">
                        <h2 className="text-lg font-semibold text-pink-400 truncate">{event.title}</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-pink-400 transition"
                            aria-label="Close"
                        >
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Scrollable Content */}
                    <div className="px-3 py-3 overflow-y-auto flex-1 space-y-3">
                        {/* Image */}
                        {event.image_url &&
                            (<div className="flex justify-center items-center bg-gray-100 rounded-lg">
                                <img
                                    src={event.image_url}
                                    alt={event.title}
                                    className="h-auto w-auto rounded-lg"
                                    loading="lazy"
                                />
                            </div>)}

                        <hr className="mb-2 border-gray-300" />

                        <p className="text-md text-gray-600">
                            <strong>Date: </strong>
                            {new Date(event.start_time).toLocaleString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                            })}
                        </p>

                        {event.organizer &&
                            <p className="text-sm text-gray-600">
                                <strong>ಅಯೋಜಕರು: </strong> {event.organizer}
                            </p>}


                        <Chip label={`${formatLabel(event.event_type)}`} className="bg-blue-200 text-blue-800" />

                        <Chip label={`${formatLabel(event.category)}`} className="bg-pink-100 text-pink-500" />

                        {/* {event.cta_label && event.cta_link && (
                        <a href={event.cta_link} target="_blank" rel="noopener noreferrer" className="underline">
                            <Chip label={`${formatLabel(event.cta_label)}`} className="bg-orange-100 text-orange-600" />
                        </a>
                    )} */}

                        <hr className="mb-2 border-gray-300" />

                        <div className="prose max-w-none">
                            <CustomMarkdown content={event.content} />
                        </div>
                    </div>
                </div>
            </div>
            {/* <div className="fixed bottom-2 left-0 w-full flex justify-center items-center z-100 bg-white">
                <AdsterraAd320x50 />
            </div> */}
        </>
    );
}

interface ChipProps {
    label: string;
    className: string;
}

export function Chip({ label, className = "" }: ChipProps) {
    return (
        <span
            className={`inline-block me-1 px-3 py-0.75 text-sm font-medium rounded-full select-none ${className}`}
        >
            {label}
        </span>
    );
}