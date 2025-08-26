import { useEffect } from 'react';
import { AtOptions } from './320x50';

const AdsterraAd300x250 = () => {
    useEffect(() => {
        // Set the ad options
        (window as Window & { atOptions?: AtOptions }).atOptions = {
            'key': '06e4f47a67c1ea8805e644f4cd59ec66',
            'format': 'iframe',
            'height': 250,
            'width': 300,
            'params': {}
        };

        // Create script tag
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = '//www.highperformanceformat.com/06e4f47a67c1ea8805e644f4cd59ec66/invoke.js';
        script.async = true;

        // Append to the DOM
        document.getElementById('ad-container-300x250')?.appendChild(script);

        // Optional cleanup
        return () => {
            const container = document.getElementById('ad-container-300x250');
            if (container) container.innerHTML = '';
        };
    }, []);

    return <div id="ad-container-300x250" style={{ width: 300, height: 250 }} />;
};

export default AdsterraAd300x250;
