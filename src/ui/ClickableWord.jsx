import { useState, useRef, useEffect } from "react";
import { SpeakerWaveIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../hooks/useAuth";
export const ClickableWord = ({ word, isLast }) => {
  const [isShowDefinition, setShowDefinition] = useState(false);
  const defenitionRef = useRef();
  const { showNotification } = useAuth();
  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!defenitionRef?.current?.contains(e.target)) {
        e.stopPropagation();
        setShowDefinition(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  });
  const speak = (text) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.8; // Скорость произношения
      window.speechSynthesis.speak(utterance);
    } else {
      console.error("Your browser does not support voicovers");
      showNotification("error", "Your browser does not support voicovers");
    }
  };
  return (
    <div className="font-medium relative flex items-center gap-0.5 max-w-full">
      <span>
        <SpeakerWaveIcon
          onClick={() => speak(word.term)}
          className="w-5 h-5 cursor-pointer flex-shrink-0"
        />
      </span>
      <span
        onClick={() => setShowDefinition(!isShowDefinition)}
        className="cursor-pointer hover:underline decoration-dashed whitespace-nowrap overflow-hidden text-ellipsis max-w-full"
      >
        {word.term}
      </span>
      {isLast ? "." : ","}

      {isShowDefinition && (
        <div
          ref={defenitionRef}
          className=" absolute bottom-full left-1/2 transform -translate-x-1/2 p-2 dark:bg-neutral-700 bg-white dark:text-white text-sm rounded max-w-50 w-max z-10 break-words shadow-lg"
        >
          {word.definition}
          {/* Стрелка */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-t-white  dark:border-t-neutral-700 border-r-transparent border-b-transparent border-l-transparent" />
        </div>
      )}
    </div>
  );
};
