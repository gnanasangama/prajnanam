"use client";

import { XMarkIcon } from "@heroicons/react/24/solid";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

// Setup PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

interface BottomTopSheetWithPdfProps {
    open: boolean;
    onClose: () => void;
    title: string;
    pdfUrl: string;
}

export default function BottomTopSheetWithPdf({
    open,
    onClose,
    title,
    pdfUrl,
}: BottomTopSheetWithPdfProps) {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageWidth, setPageWidth] = useState<number>(window.innerWidth);

    // Disable body scroll when modal is open
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

    // Handle resize
    useEffect(() => {
        const handleResize = () => {
            setPageWidth(window.innerWidth - 64);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
        setCurrentPage(1); // Reset to page 1 on load
    };

    const goToPrevPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const goToNextPage = () => {
        if (numPages) {
            setCurrentPage((prev) => Math.min(prev + 1, numPages));
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 pb-16">
            <div className="bg-white rounded-t-2xl w-full max-w-md shadow-lg animate-slideup h-[70vh] flex flex-col">
                {/* Header */}
                <div className="px-4 py-3 flex items-start justify-between border-b border-gray-300">
                    <h2 className="text-lg font-semibold text-pink-500">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-pink-500 transition"
                        aria-label="Close"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                {/* PDF Viewer */}
                <div className="flex overflow-auto py-2 flex justify-center">
                    <Document
                        file={pdfUrl}
                        onLoadSuccess={onDocumentLoadSuccess}
                        loading={<p className="text-gray-500 text-center">Loading PDF...</p>}
                    >
                        <Page
                            pageNumber={currentPage}
                            width={pageWidth}
                            renderAnnotationLayer={false}
                            renderTextLayer={false}
                        />
                    </Document>
                </div>

                {/* Footer Navigation */}
                <div className="flex items-center justify-between px-4 py-2 border-t">
                    <button
                        onClick={goToPrevPage}
                        disabled={currentPage <= 1}
                        className="flex items-center gap-1 text-sm px-3 py-2 border rounded hover:bg-gray-100 disabled:opacity-50"
                    >
                        <ChevronLeftIcon className="w-4 h-4" />
                        Prev
                    </button>

                    <span className="text-xs text-gray-500">
                        Page {currentPage} of {numPages}
                    </span>

                    <button
                        onClick={goToNextPage}
                        disabled={numPages !== null && currentPage >= numPages}
                        className="flex items-center gap-1 text-sm px-3 py-2 border rounded hover:bg-gray-100 disabled:opacity-50"
                    >
                        Next
                        <ChevronRightIcon className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
