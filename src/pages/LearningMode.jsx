import { useLocation } from "react-router-dom";
import { BackButton } from "../ui/BackButton";
import { useUserData } from "../store/useUserData";
import { useState } from "react";

export const LearningMode = () => {
  const [words, setWords] = useState([]);
  const [currentWord, setCurrentWord] = useState({});
  const [answers, setAnswers] = useState([]);
  const [isNext, setNext] = useState(false);
  const [isStarted, setStarted] = useState(false);
  const [isSecondPart, setSecondPart] = useState(false);
  const [term, setTerm] = useState("");
  const [selectedAnswer, setSelectedAnswer] = useState(false);
  const { shuffleArray } = useUserData();
  const location = useLocation();
  const currentCollection = location.state?.currentCollection;

  const handleStart = () => {
    const shuffled = shuffleArray(currentCollection.words).slice(0, 10);
    const words = shuffled.map((word) => ({
      ...word,
      roundsLeft: 2,
    }));
    const currentWord = words[0];
    setWords(words);
    setCurrentWord(currentWord);
    const answers = shuffleAnswers(currentWord.term);
    console.log(answers);
    setStarted(true);
    setNext(false);
    setSecondPart(false);
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
        word.id === currentWord.id ? { ...word, roundsLeft: 1 } : { ...word }
      );
      console.log(newWords);
      setWords(newWords);
    }
  };

  const handleNextClick = () => {
    setNext(false);
    setSelectedAnswer(null);
    const index = words.findIndex((word) => word.id === currentWord.id);
    if (currentWord.roundsLeft === 1) {
      setSecondPart(true);
      return;
    }
    if (index < words.length - 1) {
      const nextWord = words[index + 1];
      if (nextWord.roundsLeft === 2) {
        const answers = shuffleAnswers(nextWord.term);
        setAnswers(answers);
      }
      setCurrentWord(nextWord);
      setTerm("");
    } else {
      if (words[0].roundsLeft === 2) {
        const answers = shuffleAnswers(words[0].term);
        setAnswers(answers);
      }
      setCurrentWord(words[0]);
      setTerm("");
    }
  };

  const handleConfirm = () => {
    if (currentWord.term === term) {
      const updatedWords = words.filter((word) => word.id !== currentWord.id);
      setWords(updatedWords);
      if (updatedWords.length > 0) {
        const nextWord = updatedWords[0];
        setCurrentWord(nextWord);
        setTerm("");

        if (nextWord.roundsLeft === 2) {
          const answers = shuffleAnswers(nextWord.term);
          setAnswers(answers);
        }
      } else {
        setStarted(false);
      }
    }
  };

  return (
    <div className="min-h-screen pt-6 pb-2 flex flex-col">
      <div className="max-w-6xl mx-auto px-4 dark:text-white w-full">
        <BackButton />
        <h1 className="dark:text-white text-3xl sm:text-4xl text-center mb-2 font-bold text-gray-800 ">
          Learning
        </h1>
      </div>

      <div className="flex flex-col items-center flex-1 px-4 mt-4">
        {!isStarted ? (
          <button
            className="px-6 py-3 bg-red-600 text-white rounded-4xl hover:bg-red-700 cursor-pointer transition-colors text-lg font-medium"
            onClick={handleStart}
          >
            Start learning
          </button>
        ) : (
          <div className="max-w-xl w-full">
            <div className="flex justify-center">
              <h3 className="text-center text-lg break-words px-4 dark:text-white">
                {currentWord?.definition}
              </h3>
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
                  onChange={(e) => setTerm(e.target.value)}
                  className="flex-1 border border-red-600 rounded-2xl p-4 bg-white dark:bg-neutral-950 focus:outline-none focus:ring-2 focus:ring-red-500 w-full dark:text-white"
                  autoFocus
                />
                <div className="space-x-4">
                  <button
                    onClick={handleConfirm}
                    className="px-6 py-4 bg-red-600 text-white rounded-4xl hover:bg-red-700 cursor-pointer transition-colors font-medium whitespace-nowrap"
                  >
                    Confirm
                  </button>
                  <button className="px-6 py-4 bg-neutral-600 text-white rounded-4xl hover:bg-neutral-700 cursor-pointer transition-colors font-medium whitespace-nowrap">
                    Show word
                  </button>
                </div>
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
