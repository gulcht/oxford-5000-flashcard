"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Loader2,
} from "lucide-react";
import { useTheme } from "next-themes";

interface OxfordWord {
  id: number;
  value: {
    word: string;
    href: string;
    type: string;
    level: string;
    thai?: string; // Optional Thai translation
    us: {
      mp3: string;
      ogg: string;
    };
    uk: {
      mp3: string;
      ogg: string;
    };
    phonetics: {
      us: string;
      uk: string;
    };
    examples: string[];
  };
}

const levelColors = {
  A1: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  A2: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  B1: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  B2: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  C1: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  C2: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
};

const partOfSpeechColors = {
  noun: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  verb: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  adjective:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  adverb:
    "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  preposition: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
  pronoun:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  conjunction:
    "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
  "indefinite article":
    "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200",
};

export default function FlashcardWidget() {
  const [oxfordWords, setOxfordWords] = useState<OxfordWord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accent, setAccent] = useState<"us" | "uk">("us");
  const { theme, setTheme } = useTheme();

  // Load data from JSON file
  useEffect(() => {
    const loadWords = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/data/oxford-5000.json");
        if (!response.ok) {
          throw new Error("Failed to load vocabulary data");
        }
        const allWords: OxfordWord[] = await response.json();

        // Show ALL words - don't filter by Thai translations
        if (allWords.length === 0) {
          throw new Error("No vocabulary words found in the file");
        }

        setOxfordWords(allWords);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
        console.error("Error loading Oxford words:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadWords();
  }, []);

  const currentWord = oxfordWords[currentIndex]?.value;

  useEffect(() => {
    if (!isPlaying || oxfordWords.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % oxfordWords.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [isPlaying, oxfordWords.length]);

  const nextWord = () => {
    if (oxfordWords.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % oxfordWords.length);
    }
  };

  const prevWord = () => {
    if (oxfordWords.length > 0) {
      setCurrentIndex(
        (prev) => (prev - 1 + oxfordWords.length) % oxfordWords.length
      );
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const speakWord = () => {
    if (!currentWord) return;
    const audioUrl = accent === "us" ? currentWord.us.mp3 : currentWord.uk.mp3;
    const lang = accent === "us" ? "en-US" : "en-GB";
    const audio = new Audio(audioUrl);
    audio.play().catch(() => {
      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(currentWord.word);
        utterance.lang = lang;
        utterance.rate = 0.8;
        speechSynthesis.speak(utterance);
      }
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <Card className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-0 shadow-xl">
          <CardContent className="p-12">
            <div className="flex flex-col items-center justify-center space-y-6 h-80">
              <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
              <p className="text-xl text-slate-600 dark:text-slate-300">
                Loading Oxford 5000 vocabulary...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <Card className="relative overflow-hidden bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900 dark:to-red-800 border-0 shadow-xl">
          <CardContent className="p-12">
            <div className="flex flex-col items-center justify-center space-y-6 h-80">
              <p className="text-xl text-red-600 dark:text-red-300 text-center">
                {error}
              </p>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                size="lg"
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // No words available
  if (oxfordWords.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <Card className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-0 shadow-xl">
          <CardContent className="p-12">
            <div className="flex flex-col items-center justify-center space-y-6 h-80">
              <p className="text-xl text-slate-600 dark:text-slate-300 text-center">
                No vocabulary words available
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-0 shadow-xl">
        <CardContent className="p-6">
          {/* Progress indicator */}
          <div className="absolute top-0 left-0 w-full h-1 bg-slate-200 dark:bg-slate-700">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
              style={{
                width: `${((currentIndex + 1) / oxfordWords.length) * 100}%`,
              }}
            />
          </div>

          {/* Word counter */}
          <div className="absolute top-6 right-6 text-sm text-slate-500 dark:text-slate-400 font-mono">
            {currentIndex + 1} / {oxfordWords.length}
          </div>

          {/* Main content */}
          <div className="text-center space-y-8 mt-6">
            {/* English word */}
            <div className="space-y-4">
              <h1 className="text-6xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                {currentWord.word}
              </h1>
              <div className="flex items-center justify-center gap-4">
                <button
                  className={`px-2 py-1 rounded text-sm font-bold border ${
                    accent === "us"
                      ? "bg-blue-200 border-blue-400"
                      : "bg-transparent border-slate-300"
                  }`}
                  onClick={() => setAccent("us")}
                  aria-label="Switch to US accent"
                >
                  US
                </button>
                <button
                  className={`px-2 py-1 rounded text-sm font-bold border ${
                    accent === "uk"
                      ? "bg-blue-200 border-blue-400"
                      : "bg-transparent border-slate-300"
                  }`}
                  onClick={() => setAccent("uk")}
                  aria-label="Switch to UK accent"
                >
                  UK
                </button>
              </div>
              <p>
                {accent === "us"
                  ? `🇺🇸 ${currentWord.phonetics.us}`
                  : `‌🇬🇧 ${currentWord.phonetics.uk}`}
              </p>
            </div>

            {/* Part of speech and level */}
            <div className="flex justify-center gap-3">
              <span
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  partOfSpeechColors[
                    currentWord.type as keyof typeof partOfSpeechColors
                  ] ||
                  "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                }`}
              >
                {currentWord.type}
              </span>
              <span
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  levelColors[currentWord.level as keyof typeof levelColors] ||
                  "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                }`}
              >
                {currentWord.level}
              </span>
            </div>

            {/* Thai translation - only show if the field exists */}
            {currentWord.thai && (
              <div className="transition-all duration-300">
                <p className="text-2xl text-slate-600 dark:text-slate-300 font-medium">
                  {currentWord.thai}
                </p>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex justify-center items-center space-x-3 mt-6">
            <Button
              variant="ghost"
              size="lg"
              onClick={prevWord}
              className="h-12 w-12 p-0"
            >
              <SkipBack className="h-6 w-6" />
            </Button>

            <Button
              variant="ghost"
              size="lg"
              onClick={togglePlay}
              className="h-12 w-12 p-0"
            >
              {isPlaying ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="lg"
              onClick={nextWord}
              className="h-12 w-12 p-0"
            >
              <SkipForward className="h-6 w-6" />
            </Button>

            <Button
              variant="ghost"
              size="lg"
              onClick={speakWord}
              className="h-12 w-12 p-0"
            >
              <Volume2 className="h-6 w-6" />
            </Button>
          </div>

          {/* Auto-play indicator */}
          {isPlaying && (
            <div className="flex justify-center mt-6">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <div
                  className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-3 h-3 bg-pink-500 rounded-full animate-pulse"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
