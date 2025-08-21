'use client';

import { useEffect, useState } from 'react';
import styles from './InstallBanner.module.css';

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
            e.preventDefault();
            setDeferredPrompt(promptEvent);

            // Show only on hard reload (check navigation type)
            const navType = (performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming)?.type;
            if (navType === 'reload' || navType === 'navigate') {
                setShowBanner(true);
            }
        };

        window.addEventListener('beforeinstallprompt', handler);

        if (window.matchMedia('(display-mode: standalone)').matches) {
            setShowBanner(false);
        }

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        setShowBanner(false);
        try {
            await deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;

            if (typeof window.gtag !== 'undefined') {
                window.gtag('event', 'pwa_install_response', {
                    event_category: 'engagement',
                    event_label: outcome,
                });
            }
        } catch (err) {
            console.error('Installation error:', err);
        }
    };

    if (!showBanner) return null;

    return (
        <div className={styles.banner} role="dialog" aria-label="Install App Banner">
            <div className={styles.content}>
                <div className={styles.iconContainer}>
                    <img src="/images/brand/icon-without-bg.png" alt="App Icon" className={styles.appIcon} />
                </div>

                <div className={styles.textContent}>
                    <strong>Install Prajnanam</strong>
                    <p>Enjoy a faster, full-screen experience on your device.</p>
                </div>
                    <button 
                        className={styles.closeButton} 
                        onClick={() => setShowBanner(false)}
                        aria-label="Close Install Banner"
                    >
                        ✕
                    </button>
            </div>

            <button 
                className={styles.installButton} 
                onClick={handleInstall}
                aria-label="Install App"
            >
                Install App
            </button>
        </div>
    );
}
