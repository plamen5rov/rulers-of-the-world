
import React, { useState, useEffect, useCallback } from 'react';
import { GameState, Ruler, Portrait } from './types';
import { TOTAL_ROUNDS, POINTS_PER_CORRECT_ANSWER, ROUND_VICTORY_DELAY_MS, ROUND_WRONG_DELAY_MS } from './constants';
import { fetchRulers, generatePortraitsForRound } from './services/geminiService';
import { useSounds } from './hooks/useSounds';

import SplashScreen from './components/SplashScreen';
import GameOverScreen from './components/GameOverScreen';
import LoadingScreen from './components/LoadingScreen';
import Scoreboard from './components/Scoreboard';
import GameBoard from './components/GameBoard';
import Confetti from './components/Confetti';

const App: React.FC = () => {
    const [gameState, setGameState] = useState<GameState>(GameState.Splash);
    const [rulers, setRulers] = useState<Ruler[]>([]);
    const [portraits, setPortraits] = useState<Portrait[]>([]);
    const [preloadedPortraits, setPreloadedPortraits] = useState<Portrait[] | null>(null);
    const [isPreloading, setIsPreloading] = useState(false);
    const [currentRound, setCurrentRound] = useState(0);
    const [score, setScore] = useState(0);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
    const [isCorrectGuess, setIsCorrectGuess] = useState<boolean | null>(null);

    const { playVictorySound, playWrongSound } = useSounds();

    const startNewGame = useCallback(() => {
        setGameState(GameState.LoadingRulers);
        setLoadingMessage('Summoning Rulers...');
        setCurrentRound(0);
        setScore(0);
        setSelectedCardIndex(null);
        setIsCorrectGuess(null);
        setRulers([]);
        setPortraits([]);
        setPreloadedPortraits(null);
        setIsPreloading(false);
        fetchRulers()
            .then(setRulers)
            .catch(error => {
                console.error("Failed to start new game:", error);
                setGameState(GameState.Splash); // Revert to splash on error
            });
    }, []);
    
    const startNextRound = useCallback(async () => {
        if (currentRound >= TOTAL_ROUNDS || rulers.length === 0) {
            setGameState(GameState.Finished);
            return;
        }

        setSelectedCardIndex(null);
        setIsCorrectGuess(null);
        
        if (preloadedPortraits) {
            // Use preloaded data
            setPortraits(preloadedPortraits);
            setPreloadedPortraits(null);
            setGameState(GameState.Playing);
        } else {
            // Fetch data on-demand (for first round or if preloading failed)
            setGameState(GameState.LoadingRound);
            setLoadingMessage(`Painting Portraits for Round ${currentRound + 1}...`);
            try {
                const currentRuler = rulers[currentRound];
                const roundPortraits = await generatePortraitsForRound(currentRuler);
                setPortraits(roundPortraits);
                setGameState(GameState.Playing);
            } catch(error) {
                console.error(`Failed to start round ${currentRound + 1}:`, error);
                // Skip to the next round if this one fails to load
                setCurrentRound(round => round + 1);
            }
        }
    }, [currentRound, rulers, preloadedPortraits]);
    
    const preloadNextRound = useCallback(async () => {
        const nextRoundIndex = currentRound + 1;
        if (nextRoundIndex < TOTAL_ROUNDS && rulers[nextRoundIndex] && !isPreloading) {
            setIsPreloading(true);
            try {
                const nextRuler = rulers[nextRoundIndex];
                const nextPortraits = await generatePortraitsForRound(nextRuler);
                setPreloadedPortraits(nextPortraits);
            } catch (error) {
                console.error(`Failed to preload portraits for round ${nextRoundIndex + 1}:`, error);
                setPreloadedPortraits(null); // Ensure it doesn't use failed data
            } finally {
                setIsPreloading(false);
            }
        }
    }, [currentRound, rulers, isPreloading]);

    // Start the first round once rulers are fetched
    useEffect(() => {
        if (gameState === GameState.LoadingRulers && rulers.length > 0) {
            startNextRound();
        }
    }, [gameState, rulers, startNextRound]);

    // Preload the next round's data when a round starts
    useEffect(() => {
        if (gameState === GameState.Playing) {
            preloadNextRound();
        }
    }, [gameState, currentRound, preloadNextRound]);


    // Handle the delay after a round ends, then advance the round number
    useEffect(() => {
        if (gameState === GameState.RoundResult) {
            const delay = isCorrectGuess ? ROUND_VICTORY_DELAY_MS : ROUND_WRONG_DELAY_MS;
            const timer = setTimeout(() => {
                setCurrentRound(round => round + 1);
            }, delay);
            return () => clearTimeout(timer);
        }
    }, [gameState, isCorrectGuess]);

    // Start the next round when the round number changes
     useEffect(() => {
        if (currentRound > 0) { // On round change (except for initial)
            if (currentRound < TOTAL_ROUNDS) {
                startNextRound();
            } else {
                setGameState(GameState.Finished);
            }
        }
     }, [currentRound]); // Only depends on currentRound

    const handleCardClick = (index: number) => {
        if (gameState !== GameState.Playing) return;

        const selectedCard = portraits[index];
        setSelectedCardIndex(index);
        
        if (selectedCard.isCorrect) {
            setScore(prevScore => prevScore + POINTS_PER_CORRECT_ANSWER);
            setIsCorrectGuess(true);
            playVictorySound();
        } else {
            setIsCorrectGuess(false);
            playWrongSound();
        }
        setGameState(GameState.RoundResult);
    };

    const renderContent = () => {
        switch (gameState) {
            case GameState.Splash:
                return <SplashScreen onStart={startNewGame} />;
            case GameState.Finished:
                return <GameOverScreen score={score} onPlayAgain={startNewGame} />;
            case GameState.LoadingRulers:
            case GameState.LoadingRound:
                return <LoadingScreen message={loadingMessage} />;
            case GameState.Playing:
            case GameState.RoundResult:
                 if (!rulers[currentRound] || portraits.length === 0) return <LoadingScreen message="Preparing the battlefield..." />;
                return (
                    <>
                        <Scoreboard score={score} round={currentRound + 1} />
                        <GameBoard
                            rulerName={rulers[currentRound].name}
                            portraits={portraits}
                            onCardClick={handleCardClick}
                            selectedCardIndex={selectedCardIndex}
                            isRoundResult={gameState === GameState.RoundResult}
                        />
                        {isCorrectGuess && gameState === GameState.RoundResult && <Confetti />}
                    </>
                );
            default:
                return <SplashScreen onStart={startNewGame} />;
        }
    };
    
    return (
        <main className="bg-brand-bg text-white min-h-screen w-full flex flex-col items-center font-sans">
            {renderContent()}
        </main>
    );
};

export default App;