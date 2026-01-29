'use client';

import { useEffect, useState } from 'react';
import { trackEvent } from '@/utils/analytics';

const STORAGE_KEY = 'android_app_promo_last_shown';
const SHOW_INTERVAL_HOURS = 3;

export default function AndroidPwaToAppModal() {
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const checkAndShowModal = () => {
            // Check if on Android
            const isAndroid =
                typeof navigator !== 'undefined' &&
                /Android/i.test(navigator.userAgent);

            if (!isAndroid) return;

            // Check if PWA is installed (standalone mode)
            const isPWAInstalled = window.matchMedia('(display-mode: standalone)').matches;

            if (!isPWAInstalled) return;

            // Check if we should show the modal based on time interval
            const lastShown = localStorage.getItem(STORAGE_KEY);
            const now = Date.now();

            if (!lastShown) {
                // First time, show it
                setShowModal(true);
                localStorage.setItem(STORAGE_KEY, now.toString());
            } else {
                const lastShownTime = parseInt(lastShown, 10);
                const timeDifference = now - lastShownTime;
                const intervalMs = SHOW_INTERVAL_HOURS * 60 * 60 * 1000;

                if (timeDifference >= intervalMs) {
                    // Enough time has passed, show modal again
                    setShowModal(true);
                    localStorage.setItem(STORAGE_KEY, now.toString());
                }
            }
        };

        checkAndShowModal();
    }, []);

    const handleClose = () => {
        setShowModal(false);
        trackEvent('android_app_promo_dismissed', {
            event_category: 'engagement',
            event_label: 'modal',
        });
    };

    const handleInstall = () => {
        trackEvent('android_app_promo_clicked', {
            event_category: 'engagement',
            event_label: 'modal',
        });

        window.location.href =
            'https://play.google.com/store/apps/details?id=app.gnanasangama';
    };

    if (!showModal) return null;

    return (
        <>

            {/* Modal */}
            <div
                className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 max-w-md bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
                role="dialog"
                aria-label="Download Android App"
            >
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl z-10"
                    aria-label="Close modal"
                >
                    ✕
                </button>

                {/* Content */}
                <div className="p-4 text-center pt-8">
                    <div className="mb-2">
                        <img
                            src="/images/brand/icon-without-bg.png"
                            alt="Prajnanam App"
                            className="w-32 h-20 mx-auto"
                        />
                    </div>

                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        ಸೂಚನೆ
                    </h2>

                    <p className="text-gray-700 text-base leading-relaxed mb-3">
                        ಈ ಆಪ್‌ನಲ್ಲಿ{' '}
                        <span className="font-semibold">
                            ಮಾರ್ಚ್ 1 ರಿಂದ ಹೊಸ ಅಪ್‌ಡೇಟ್‌ಗಳು ಲಭ್ಯವಿರುವುದಿಲ್ಲ.
                        </span>
                        <br />
                        <br />
                        ದಯವಿಟ್ಟು ನಮ್ಮ ಹೊಸ
                        <span className="font-semibold text-pink-500">
                            {' '}
                            Prajnanam{' '}
                        </span>
                        ಆಪ್ ಅನ್ನು Play Store ನಿಂದ ಇನ್‌ಸ್ಟಾಲ್ ಮಾಡಿ ಮತ್ತು ನಿಮ್ಮ
                        ಕಲಿಕೆಯ ಪಯಣವನ್ನು ಮುಂದುವರಿಸಿ.
                    </p>

                    <button onClick={handleInstall} aria-label="Install App">
                        <img
                            src="/images/google-play-badge.png" // 👈 your image
                            alt="Get it on Google Play"
                            className="w-2/3 mx-auto"
                        />
                    </button>
                </div>
            </div>
        </>
    );
}
