'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import AppBar from '@/components/app-bar';

type Question = {
    id: string;
    question: string;
    options: string[];
    answer: string;
    description: string;
    category: string;
    group_code: string;
};

type UserAnswer = {
    question: string;
    yourAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    description: string;
};

export default function QuizPage() {
    const [allQuestions, setAllQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
    const [quizMeta, setQuizMeta] = useState<{ category: string; groupCode: string } | null>(null);

    const [loading, setLoading] = useState(true);
    const [showSplash, setShowSplash] = useState(true);
    const [showStartScreen, setShowStartScreen] = useState(false);
    const [showQuiz, setShowQuiz] = useState(false);
    const [showResultModal, setShowResultModal] = useState(false);
    const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null);
    const [showSummaryScreen, setShowSummaryScreen] = useState(false);

    useEffect(() => {
        document.title = `Quiz - Prajnanam`;
    }, []);

    useEffect(() => {
        async function initializeQuiz() {
            const todayStr = new Date().toISOString().split('T')[0];
            const savedStatus = localStorage.getItem('quizStatus');
            const quizInfo = savedStatus ? JSON.parse(savedStatus) : null;

            setShowSplash(true);
            setShowStartScreen(false);
            setShowQuiz(false);
            setShowSummaryScreen(false);

            setTimeout(() => {
                setShowSplash(false);

                if (quizInfo?.date === todayStr) {
                    setUserAnswers(quizInfo.data);
                    setShowSummaryScreen(true);
                } else {
                    setShowStartScreen(true);

                    setTimeout(() => {
                        setShowStartScreen(false);
                        setShowQuiz(true);
                    }, 2000);
                }
            }, 3000);

            await loadTodayQuestions();
            setLoading(false);
        }

        initializeQuiz();
    }, []);

    async function loadTodayQuestions() {
        const { data: questions, error } = await supabase.rpc('get_today_questions');

        if (error) {
            alert('Error fetching questions');
            return;
        }

        setAllQuestions(questions);
        setQuizMeta({ category: questions[0]?.category ?? '', groupCode: questions[0]?.group_code ?? '' });
    }

    function showQuestion() {
        if (currentQuestionIndex >= allQuestions.length) return null;
        const q = allQuestions[currentQuestionIndex];
        return (
            <>
                <div className="text-xl font-semibold mb-4">{`${currentQuestionIndex + 1}. ${q.question}`}</div>
                <div className="grid grid-cols-1 gap-3">
                    {q.options.map((option) => (
                        <button
                            key={option}
                            className="w-full bg-white border border-gray-300 rounded-xl py-3 px-3 text-left text-lg font-medium shadow-sm hover:bg-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                            onClick={() => handleAnswer(option)}
                            disabled={showResultModal}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </>
        );
    }

    function handleAnswer(selected: string) {
        if (showResultModal) return;

        const q = allQuestions[currentQuestionIndex];
        const isCorrect = selected === q.answer;

        const answerRecord: UserAnswer = {
            question: q.question,
            yourAnswer: selected,
            correctAnswer: q.answer,
            isCorrect,
            description: q.description,
        };

        setUserAnswers((prev) => [...prev, answerRecord]);
        setLastAnswerCorrect(isCorrect);
        setShowResultModal(true);

        setTimeout(() => {
            setShowResultModal(false);
            setLastAnswerCorrect(null);
            if (currentQuestionIndex + 1 < allQuestions.length) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
            } else {
                setShowQuiz(false);
                setShowSummaryScreen(true);
                saveResults();
            }
        }, 1000);
    }

    function saveResults() {
        const todayStr = new Date().toISOString().split('T')[0];
        localStorage.setItem(
            'quizStatus',
            JSON.stringify({
                date: todayStr,
                data: userAnswers,
            })
        );
    }

    function showSummary() {
        document.title = `Quiz Results - Prajnanam`;
        const correctCount = userAnswers.filter((a) => a.isCorrect).length;
        const total = userAnswers.length;

        const message =
            correctCount === total
                ? 'ಅಭಿನಂದನೆಗಳು! ಎಲ್ಲಾ ಉತ್ತರ ಸರಿಯಾದವು!'
                : correctCount >= total * 0.7
                    ? 'ಅತ್ಯುತ್ತಮ ಪ್ರಯತ್ನ! ಇನ್ನಷ್ಟು ಅಭ್ಯಾಸ ಮಾಡಿ.'
                    : 'ಚಿಂತಿಸಬೇಡಿ – ಅಭ್ಯಾಸ ಮುಂದುವರಿಸಿ!';

        return (
            <div className="space-y-8 bg-white min-h-screen max-w-md mx-auto pb-14">
                <h2 className="text-2xl font-bold text-orange-500 text-center animate-fadein mb-4">
                    ಅಭಿನಂದನೆಗಳು!<br /> ನೀವು ರಸಪ್ರಶ್ನೆ ಪೂರ್ಣಗೊಳಿಸಿದ್ದೀರಿ 🎉
                </h2>

                <div
                    className="w-full bg-gradient-to-r from-green-100 to-green-50 border border-green-300 rounded-xl p-4 mb-6 shadow-md text-center animate-fadein"
                    aria-live="polite"
                >
                    <div className="text-4xl font-extrabold text-green-700" id="quiz-score-value">
                        {correctCount} / {total}
                    </div>
                    <div className="text-lg font-semibold text-green-600 mt-2" id="quiz-score-message">
                        {message}
                    </div>
                </div>

                <div id="summary-cards" className="space-y-4">
                    {userAnswers.map((entry, index) => (
                        <div
                            key={index}
                            className={`bg-white shadow-sm border-l-3 ${entry.isCorrect ? 'border-green-400' : 'border-red-400'
                                } rounded-lg p-3 hover:shadow-md transition-shadow`}
                        >
                            <h4 className="font-semibold text-gray-800 mb-2">
                                {index + 1}. {entry.question}{' '}
                                <span className="ms-1">{entry.isCorrect ? '✅' : '❌'}</span>
                            </h4>
                            <p className={`mb-1 ${entry.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                                ನಿಮ್ಮ ಉತ್ತರ: <strong>{entry.yourAnswer}</strong>
                            </p>
                            {!entry.isCorrect && (
                                <p className="mb-1 text-blue-700">
                                    ಸರಿಯಾದ ಉತ್ತರ: <strong>{entry.correctAnswer}</strong>
                                </p>
                            )}
                            <p className="text-sm text-gray-500 italic mt-2 text-justify">{entry.description}</p>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8">
                    <button
                        onClick={() => (window.location.href = '/')}
                        className="primary-button w-full sm:w-1/3 transition duration-200 rounded-4xl bg-pink-400 hover:bg-pink-600 text-white py-3 font-semibold shadow-md"
                    >
                        ಪ್ರಜ್ಞಾನಂಗೆ ಹಿಂತಿರುಗಿ
                    </button>
                    <button
                        onClick={shareWhatsApp}
                        className="custom-button w-full sm:w-1/3 border-2 border-green-500 text-green-600 hover:bg-green-50 transition duration-200 rounded-4xl py-3 font-semibold shadow-sm"
                    >
                        WhatsApp ನಲ್ಲಿ ಹಂಚಿಕೊಳ್ಳಿ
                    </button>
                </div>
            </div>
        );
    }

    function shareWhatsApp() {
        const quizURL = `${window.location.origin}/quiz`;
        const message = `ನಾನು ಈ ರಸಪ್ರಶ್ನೆಯಲ್ಲಿ ಭಾಗವಹಿಸಿದ್ದೆ - ತುಂಬಾ ಮಾಹಿತಿಯುತ ಹಾಗೂ ಆಸಕ್ತಿದಾಯಕವಾಗಿದೆ! ನೀವೂ ಓಮ್ಮೆ ಪ್ರಯತ್ನಿಸಿ.\n\nನೀವು ಈ ರಸಪ್ರಶ್ನೆಯನ್ನು ಇಲ್ಲಿ ಆಡಬಹುದು: ${quizURL}`;
        const encodedMessage = encodeURIComponent(message);
        const url = `https://wa.me/?text=${encodedMessage}`;
        window.open(url, '_blank');
    }

    return (
        <>
            <AppBar title={`ರಸಪ್ರಶ್ನೆ - ಪ್ರಜ್ಞಾನಂ`} isSpecialGradient={true} />
            <main className="max-h-screen max-w-md mx-auto font-sans relative">
                {/* Splash Screen */}
                {showSplash && (
                    <div className="fixed inset-0 flex flex-col items-center justify-center animate-fadein bg-gradient-to-t from-orange-500 to-yellow-400 text-white text-center z-40 select-none pointer-events-none">
                        <h1 className="text-4xl font-bold mb-4 animate-bounce select-text-none">ರಸಪ್ರಶ್ನೆ - ಪ್ರಜ್ಞಾನಂ</h1>
                    </div>
                )}

                {/* Start Screen */}
                {showStartScreen && (
                    <div className="fixed inset-0 flex flex-col items-center justify-center text-center bg-gray-50 z-40 animate-fadein select-none pointer-events-none">
                        <h2 className="text-2xl font-bold mb-2">ನಿಮ್ಮ ರಸಪ್ರಶ್ನೆ ಲೋಡ್ ಆಗುತ್ತಿದೆ!</h2>
                    </div>
                )}

                {/* Quiz Screen */}
                {showQuiz && (
                    <section
                        id="quiz"
                        className="bg-white rounded-xl p-2 space-y-6"
                        aria-live="polite"
                    >
                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-3 mb-4 overflow-hidden">
                            <div
                                id="progress-bar"
                                className="bg-gradient-to-r from-orange-500 to-yellow-400 h-3 rounded-full transition-all duration-300"
                                style={{ width: `${(currentQuestionIndex / allQuestions.length) * 100}%` }}
                                aria-valuemin={0}
                                aria-valuemax={allQuestions.length}
                                aria-valuenow={currentQuestionIndex}
                                role="progressbar"
                            />
                        </div>

                        {/* Quiz Meta Info */}
                        <div className="flex justify-between items-center text-sm text-gray-600 font-medium select-none">
                            <span id="quiz-category">{quizMeta?.category ?? ''}</span>
                            <span id="quiz-progress">
                                ಪ್ರಶ್ನೆ {currentQuestionIndex + 1} / {allQuestions.length}
                            </span>
                        </div>

                        {/* Question & Options */}
                        {loading ? <p className="text-center">Loading...</p> : showQuestion()}
                    </section>
                )}

                {/* Result Modal */}
                {showResultModal && lastAnswerCorrect !== null && (
                    <div
                        id="result-modal"
                        className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
                        aria-live="assertive"
                        role="dialog"
                        aria-label={lastAnswerCorrect ? 'Correct answer' : 'Incorrect answer'}
                    >
                        {/* Light overlay (background is still visible) */}
                        <div className="absolute inset-0 bg-black opacity-35 z-10 backdrop-blur-sm" />

                        {/* Modal card */}
                        <div
                            className="relative z-20 bg-white dark:bg-gray-900 text-center rounded-2xl shadow-xl px-8 py-6 w-[60%] max-w-xs animate-zoom-in pointer-events-auto"
                        >
                            <div
                                id="result-icon"
                                className={`text-6xl mb-3 ${lastAnswerCorrect ? 'text-green-500' : 'text-red-500'}`}
                                aria-hidden="true"
                            >
                                {lastAnswerCorrect ? '✅' : '❌'}
                            </div>
                            <p
                                id="result-text"
                                className={`text-2xl sm:text-3xl font-bold ${lastAnswerCorrect ? 'text-green-600' : 'text-red-600'}`}
                            >
                                {lastAnswerCorrect ? 'ಸರಿ!' : 'ತಪ್ಪು!'}
                            </p>
                        </div>
                    </div>
                )}

                {/* Summary Screen */}
                {showSummaryScreen && showSummary()}
            </main>
        </>
    );
}
