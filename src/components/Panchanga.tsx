import React, { useEffect, useState } from 'react';
import CustomMarkdown from './CustomMarkdown';
import Loader from './Loader';

type PanchangaData = {
    sections?: {
        items?: { content: { content: string, subtitle: string } }[];
    }[];
};

export default function Panchanga() {
    const [data, setData] = useState<PanchangaData>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('https://gnanasangama.pythonanywhere.com/api/get/home/');
                const result = await res.json();
                setData(result); // Set the data when fetched
            } catch (error) {
                setError('Failed to fetch data');
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []); // Empty array ensures this effect runs once on mount

    // Handle loading and error states
    if (loading) {
        return (
            <div className="flex justify-center items-center h-30">
                <Loader />
            </div>
        );
    }

    if (error) {
        return <p>{error}</p>;
    }
    const panchang = `
### ಇಂದಿನ ಪಂಚಾಂಗ
${data.sections?.[1]?.items?.[0]?.content?.subtitle || ''}
${data.sections?.[1]?.items?.[0]?.content?.content || ''}
`;

    return (
        <div className="relative mb-3 w-full max-w-md rounded-lg overflow-hidden cursor-pointer select-none">
            {/* Background image layer */}
            <div
                className="absolute inset-0 bg-contain bg-center bg-no-repeat opacity-30"
                style={{ backgroundImage: `url('/images/brand/icon-without-bg.png')` }}
            ></div>

            {/* Foreground content layer */}
            <div className="relative z-10">
                <CustomMarkdown content={panchang || 'No Panchanga data available'} />
            </div>
        </div>
    );
}
