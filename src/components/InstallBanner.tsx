'use client';

import { useEffect, useState } from 'react';

// Define the type for the BeforeInstallPromptEvent
interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export default function InstallBanner() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        const handler = (e: Event) => {
            const promptEvent = e as BeforeInstallPromptEvent;
            promptEvent.preventDefault();
            setDeferredPrompt(promptEvent);
            setShowBanner(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        setShowBanner(false);
        deferredPrompt.prompt();

        const { outcome } = await deferredPrompt.userChoice;

        // Track the installation choice
        if (typeof window.gtag !== 'undefined') {
            window.gtag('event', 'pwa_install_response', {
                event_category: 'engagement',
                event_label: outcome // 'accepted' or 'dismissed'
            });
        }
    };

    const handleClose = () => {
        setShowBanner(false);
    };

    if (!showBanner) return null;

    return (
        <div className="installBanner">
            <div className="installMessage">
                <div className="messageContent">
                    <button 
                        className="saveAppBtn" 
                        onClick={handleInstall}
                    >
                        Install App
                    </button>
                    <span>Install this app for a better experience</span>
                </div>
                <span 
                    className="closeBtn" 
                    onClick={handleClose}
                >
                    &times;
                </span>
            </div>
        </div>
    );
}
