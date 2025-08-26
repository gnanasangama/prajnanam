import { useEffect } from 'react';

export interface AtOptions {
    key: string;
    format: string;
    height: number;
    width: number;
    params: Record<string, unknown>;
}

const AdsterraAd320x50 = () => {
    useEffect(() => {
        // Set the ad options
        (window as Window & { atOptions?: AtOptions }).atOptions = {
            key: '598893225a4127bed4f78fb72ecf447d',
            format: 'iframe',
            height: 50,
            width: 320,
            params: {}
        };


        // Create script tag
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = '//www.highperformanceformat.com/598893225a4127bed4f78fb72ecf447d/invoke.js';
        script.async = true;

        // Append to the DOM
        document.getElementById('ad-container-320x50')?.appendChild(script);

        // Optional cleanup
        return () => {
            const container = document.getElementById('ad-container-320x50');
            if (container) container.innerHTML = '';
        };
    }, []);

    return <div id="ad-container-320x50" style={{ width: 320, height: 50 }} />;
};

export default AdsterraAd320x50;
