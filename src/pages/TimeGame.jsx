import { useCollections } from "../store/useCollections";
import { useUserData } from "../store/useUserData";
import { useEffect, useRef, useState } from "react";
import { BackButton } from "../ui/BackButton";
import { useAuth } from "../hooks/useAuth";
import { useLocation } from "react-router-dom";
export const TimeGame = () => {
  const location = useLocation();
  const currentCollection = location.state?.currentCollection;
  const { shuffleArray, uploadTimeGameResults, setUserData } = useUserData();
  const { user } = useAuth();
  const [words, setWords] = useState([]);
  const [currentWord, setCurrentWord] = useState({});
  const [isStarted, setStarted] = useState(false);
  const [isFinished, setFinished] = useState(false);
  const [guessedWords, setGuessedWords] = useState(0);
  const [error, setError] = useState("");
  const [term, setTerm] = useState("");
  const [time, setTime] = useState(120);
  const timeRef = useRef();

  useEffect(() => {
    if (isStarted && time > 0) {
      timeRef.current = setTimeout(() => {
        setTime((prev) => prev - 1);
      }, 1000);
    } else if (time === 0 && isStarted) {
      setStarted(false);
      setFinished(true);
      uploadTimeGameResults(user.uid, guessedWords);
      setTerm("");
    }
    return () => clearTimeout(timeRef.current);
  }, [isStarted, time]);

  const handleStart = () => {
    setFinished(false);
    const shuffledWords = shuffleArray([...currentCollection.words]);
    console.log(shuffledWords);

    const randomWord = shuffledWords[0];
    setCurrentWord(randomWord);
    setWords(shuffledWords.slice(1));
    setGuessedWords(0);
    setTime(120);
    setStarted(true);
    setError("");
  };

  const handleWordClick = async () => {
    if (term.trim() === "") {
      return;
    }
    if (term.toLowerCase() !== currentWord.term.toLowerCase()) {
      setError("Wrong! Try again!");
      setTerm("");
      return;
    }
    const newGuessedWords = guessedWords + 1;
    setGuessedWords(newGuessedWords);
    setError("");

    if (words.length === 0) {
      setStarted(false);
      setFinished(true);
      const updatedUserData = await uploadTimeGameResults(
        user.uid,
        newGuessedWords
      );
      if (updatedUserData) {
        setUserData(updatedUserData);
      }
      setTerm("");
      return;
    }
    const randomWord = words[0];
    setCurrentWord(randomWord);
    setWords((prev) => prev.slice(1));
    setTerm("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleWordClick();
    }
  };

  const handleSkipWord = async () => {
    setTime((prev) => Math.max(0, prev - 10));
    setWords((prev) => prev.slice(1));
    setError(currentWord.term);
    setTimeout(() => {
      setError("");
    }, 1000);
    if (words.length === 0) {
      setStarted(false);
      setFinished(true);
      const updatedUserData = await uploadTimeGameResults(
        user.uid,
        guessedWords
      );
      setUserData(updatedUserData);
      setTerm("");
      return;
    }

    const randomWord = words[0];
    setWords((prev) => prev.filter((word) => word.id !== randomWord.id));
    setCurrentWord(randomWord);
    setTerm("");
  };
  return (
    <div className="pt-6 pb-2">
      <div className="max-w-6xl mx-auto px-4 dark:text-white">
        <BackButton />
        <h1 className="dark:text-white text-3xl sm:text-4xl text-center mb-2 font-bold text-gray-800 ">
          Time Game
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
          Match terms with their definitions
        </p>
        <div className="flex flex-col items-center justify-center space-y-6">
          {!isStarted && !isFinished && (
            <button
              onClick={handleStart}
              className="px-6 py-3 bg-red-600 text-white rounded-3xl hover:bg-red-700 cursor-pointer transition-colors text-lg font-medium"
            >
              Start game
            </button>
          )}

          {isFinished && (
            <div className="text-center py-8">
              <div className="text-2xl font-bold text-green-600 mb-4">
                {guessedWords === currentCollection.words.length
                  ? "Congratulations! You got all words right!"
                  : `You got ${guessedWords} ${
                      guessedWords !== 1 ? "words" : "word"
                    }  of ${currentCollection.words.length}`}
              </div>
              <button
                onClick={handleStart}
                className="px-6 py-3 bg-red-600 text-white rounded-3xl hover:bg-red-700 cursor-pointer transition-colors"
              >
                Play Again
              </button>
            </div>
          )}

          {isStarted && !isFinished && (
            <div className="max-w-3xl  space-y-4 mx-auto">
              {isStarted && (
                <div className="mb-6">
                  <div className="text-center mt-2 text-lg font-medium">
                    Time left: {time}s
                  </div>
                </div>
              )}
              <div className="w-xl flex items-center justify-center">
                <h3 className="text-center text-lg break-words px-4">
                  {currentWord?.definition}
                </h3>
              </div>
              <div className="text-red-600 text-center">{error}</div>
              <div className="flex flex-col items-center gap-4">
                <input
                  autoComplete="off"
                  required
                  maxLength="50"
                  type="text"
                  id="term"
                  placeholder="Enter the term"
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="flex-1 border border-red-600 rounded-xl p-4 bg-white dark:bg-neutral-950 focus:outline-none focus:ring-2 focus:ring-red-500 w-full"
                  autoFocus
                />
                <div className="space-x-4">
                  <button
                    onClick={handleWordClick}
                    className="px-6 py-4 bg-red-600 text-white rounded-xl hover:bg-red-700 cursor-pointer transition-colors font-medium whitespace-nowrap"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={handleSkipWord}
                    className="px-6 py-4 bg-neutral-600 text-white rounded-xl hover:bg-neutral-700 cursor-pointer transition-colors font-medium whitespace-nowrap"
                  >
                    Skip word
                  </button>
                </div>
              </div>

              {/* Прогресс-бар */}
              <div className="mt-6">
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                  <span>Progress</span>
                  <span>
                    {guessedWords}/{currentCollection.words.length}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div
                    className="bg-green-500 h-2.5 rounded-full transition-all"
                    style={{
                      width: `${
                        (guessedWords / currentCollection.words.length) * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
