import { useLocation } from "react-router-dom";
import { BackButton } from "../ui/BackButton";
import { useUserData } from "../store/useUserData";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ClickableWord } from "../ui/ClickableWord";
import { useAuth } from "../hooks/useAuth";
export const LearningMode = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [words, setWords] = useState([]);
  const [currentWord, setCurrentWord] = useState({});
  const [answers, setAnswers] = useState([]);
  const [isNext, setNext] = useState(false);
  const [isStarted, setStarted] = useState(false);
  const [isSecondPart, setSecondPart] = useState(false);
  const [term, setTerm] = useState("");
  const [selectedAnswer, setSelectedAnswer] = useState(false);
  const [countMistakes, setCountMistakes] = useState(0);
  const [isFinished, setFinished] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [error, setError] = useState(null);
  const { shuffleArray, updateLearningProgress } = useUserData();
  const [sessionWords, setSessionWords] = useState([]);
  const location = useLocation();
  const currentCollection = location.state?.currentCollection;

  useEffect(() => {
    const saveProgress = async () => {
      if (isFinished && sessionWords.length > 0) {
        try {
          await updateLearningProgress(
            sessionWords,
            currentCollection.id,
            user.uid
          );
        } catch (error) {
          console.error("Ошибка при сохранении прогресса:", error);
        }
      }
    };
    saveProgress();
    console.log("words", sessionWords);
  }, [isFinished, sessionWords]);

  const handleStart = () => {
    console.log(user);
    const shuffled = shuffleArray(currentCollection.words).slice(0, 3);
    const words = shuffled.map((word) => {
      const wordProgress =
        user?.collectionsProgress?.[currentCollection.id]?.[word.id]
          ?.progress || 0;

      return {
        ...word,
        roundsLeft: 2,
        errors: 0,
        progress: wordProgress,
      };
    });

    const currentWord = words[0];
    setWords(words);
    setSessionWords(words);
    setCurrentWord(currentWord);
    const answers = shuffleAnswers(currentWord.term);
    setStarted(true);
    setStartTime(Date.now());
    setFinished(false);
    setNext(false);
    setSecondPart(false);
    setCountMistakes(0);
    setError(null);
    setAnswers(answers);
  };

  const shuffleAnswers = (term) => {
    const terms = shuffleArray(
      currentCollection.words
        .map((word) => word.term)
        .filter((word) => word !== term)
    ).slice(0, 3);
    const answers = [term, ...terms];
    return shuffleArray(answers);
  };

  const handleAnswerClick = (word) => {
    setNext(true);
    setSelectedAnswer(word);
    if (word === currentWord.term) {
      const newWords = words.map((word) =>
        word.id === currentWord.id ? { ...word, roundsLeft: 1 } : word
      );
      setWords(newWords);
      setSessionWords((prev) =>
        prev.map((w) => (w.id === currentWord.id ? { ...w, roundsLeft: 1 } : w))
      );
    } else {
      setCountMistakes((prev) => prev + 1);
      const newWords = words.map((word) =>
        word.id === currentWord.id ? { ...word, errors: word.errors + 1 } : word
      );
      console.log(newWords);
      setWords(newWords);
      setSessionWords((prev) =>
        prev.map((w) =>
          w.id === currentWord.id ? { ...w, errors: w.errors + 1 } : w
        )
      );
    }
  };

  const handleNextClick = () => {
    setError(null);
    setNext(false);
    setSelectedAnswer(null);
    const index = words.findIndex((word) => word.id === currentWord.id);
    const nextIndex = (index + 1) % words.length;
    const nextWord = words[nextIndex];
    setCurrentWord(nextWord);

    if (nextWord.roundsLeft === 1) {
      setSecondPart(true);
    } else {
      setSecondPart(false);
      const answers = shuffleAnswers(nextWord.term);
      setAnswers(answers);
    }
    setTerm("");
  };

  const handleConfirm = () => {
    if (term.trim() === "") {
      return;
    }
    if (term.trim().toLowerCase() === currentWord.term.toLowerCase()) {
      const updatedWords = words.filter((w) => w.id !== currentWord.id);
      setWords(updatedWords);
      setSessionWords((prev) =>
        prev.map((w) =>
          w.id === currentWord.id && w.errors === 0 && w.progress < 5
            ? {
                ...w,
                progress: w.progress + 1,
              }
            : w
        )
      );
      if (updatedWords.length === 0) {
        setFinished(true);
        setStarted(false);
        setEndTime(Date.now());

        return;
      }
      const nextWord = updatedWords[0];
      setCurrentWord(nextWord);
      if (nextWord.roundsLeft === 1) {
        setSecondPart(true);
      } else {
        setSecondPart(false);
        const newAnswers = shuffleAnswers(nextWord.term);
        setAnswers(newAnswers);
      }
    } else {
      setError("wrong!");
      setCountMistakes((prev) => prev + 1);
      const newWords = words.map((word) =>
        word.id === currentWord.id ? { ...word, errors: word.errors + 1 } : word
      );
      console.log(newWords);
      setWords(newWords);
      setSessionWords((prev) =>
        prev.map((w) =>
          w.id === currentWord.id ? { ...w, errors: w.errors + 1 } : w
        )
      );
      setTimeout(() => {
        setError(null);
      }, 1000);
    }
    setTerm("");
  };

  const handleShowWord = () => {
    setNext(true);
    setCountMistakes((prev) => prev + 1);
    const newWords = words.map((word) =>
      word.id === currentWord.id ? { ...word, errors: word.errors + 1 } : word
    );
    console.log(newWords);
    setWords(newWords);
    setSessionWords((prev) =>
      prev.map((w) =>
        w.id === currentWord.id ? { ...w, errors: w.errors + 1 } : w
      )
    );
    setTerm(currentWord.term);
    setError(currentWord.term);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleConfirm();
    }
  };

  return (
    <div className="min-h-screen pt-6 pb-2 flex flex-col">
      <div className="max-w-6xl mx-auto px-4 dark:text-white w-full">
        <BackButton />
        <h1 className="dark:text-white text-2xl sm:text-3xl md:text-4xl text-center mb-2 font-bold text-gray-800 ">
          {isFinished ? "The learning session is over" : "Learning"}
        </h1>
        {isFinished && (
          <div className="flex justify-center mt-6">
            <div className="flex  flex-col md:flex-row gap-4 md:gap-10 border px-8 md:px-20 bg-neutral-700/20  rounded-xl py-5">
              <div className="flex flex-col items-center md:items-start">
                <h3>Mistakes:</h3>
                <span
                  className={` font-medium ${
                    countMistakes === 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {countMistakes === 1
                    ? `${countMistakes} mistake`
                    : `${countMistakes} mistakes`}
                </span>
              </div>
              <div className="flex flex-col items-center md:items-start max-w-full">
                <h3>Duration:</h3>
                <span className=" font-medium">
                  {formatTime(Math.floor((endTime - startTime) / 1000))}
                </span>
              </div>
              <div className="flex flex-col items-center md:items-start max-w-xs md:max-w-md w-full">
                <h3>Session words:</h3>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-1">
                  {sessionWords.map((word, i) => (
                    <ClickableWord
                      key={i}
                      word={word}
                      isLast={i === sessionWords.length - 1}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center flex-1 px-4 mt-4">
        {!isStarted ? (
          <div className="space-x-4">
            <button
              className="px-6 py-3 bg-red-600 text-white rounded-4xl hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-700 cursor-pointer transition-colors text-lg font-medium"
              onClick={handleStart}
            >
              {isFinished ? "Learn again" : " Start learning"}
            </button>
            {isFinished && (
              <button
                className="px-6 py-3 bg-neutral-400 hover:bg-neutral-500 dark:bg-neutral-600  text-white rounded-4xl dark:hover:bg-neutral-700 cursor-pointer transition-colors text-lg font-medium"
                onClick={() => navigate("/collections")}
              >
                Browse collections
              </button>
            )}
          </div>
        ) : (
          <div className="max-w-xl w-full">
            <div className="flex flex-col text-center gap-2">
              <h3 className=" text-xl break-words px-4 dark:text-white">
                {currentWord?.definition}
              </h3>
              {error && (
                <span className="text-xl font-bold text-red-600">{error}</span>
              )}
            </div>

            {!isSecondPart ? (
              <div className="grid grid-cols-2 gap-3 mt-6">
                {answers?.map((word, i) => (
                  <input
                    onClick={() => handleAnswerClick(word)}
                    key={i}
                    type="button"
                    value={word}
                    className={`p-6 border border-red-600 rounded-lg dark:text-white cursor-pointer ${
                      isNext && word === currentWord.term
                        ? "bg-green-500 border-0"
                        : ""
                    } ${
                      isNext &&
                      selectedAnswer === word &&
                      word !== currentWord.term
                        ? "bg-red-500 border-0"
                        : ""
                    }`}
                  />
                ))}
              </div>
            ) : (
              <div className="mt-4 flex flex-col items-center gap-4">
                <input
                  autoComplete="off"
                  required
                  maxLength="50"
                  type="text"
                  id="term"
                  placeholder="Enter the term"
                  value={term}
                  onKeyDown={handleKeyPress}
                  onChange={(e) => setTerm(e.target.value)}
                  className={`flex-1 border border-red-600 rounded-2xl p-4 bg-white dark:bg-neutral-950 focus:outline-none focus:ring-2 focus:ring-red-500 w-full dark:text-white`}
                  autoFocus
                />
                {!error && (
                  <div className="space-x-4">
                    <button
                      onClick={handleConfirm}
                      className="px-6 py-4 bg-red-600 text-white rounded-4xl hover:bg-red-700 cursor-pointer transition-colors font-medium whitespace-nowrap"
                    >
                      Confirm
                    </button>

                    <button
                      onClick={handleShowWord}
                      className="px-6 py-4 bg-neutral-600 text-white rounded-4xl hover:bg-neutral-700 cursor-pointer transition-colors font-medium whitespace-nowrap"
                    >
                      Show word
                    </button>
                  </div>
                )}
              </div>
            )}
            <div className="flex justify-end">
              {isNext && (
                <button
                  onClick={handleNextClick}
                  className="px-6 py-3 bg-red-600 text-white rounded-4xl hover:bg-red-700 cursor-pointer transition-colors text-lg font-medium mt-4"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
