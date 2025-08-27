import { useCollections } from "../store/useCollections";
import { useUserData } from "../store/useUserData";
import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { BackButton } from "../ui/BackButton";
export const TimeGame = () => {
  const { currentCollection, fetchCollection } = useCollections();
  const navigate = useNavigate();
  const [words, setWords] = useState();
  const { id } = useParams();
  const loadCollection = useCallback(async () => {
    try {
      await fetchCollection(id);
    } catch (error) {
      console.error("Failed to fetch collection:", error);
    }
  }, [fetchCollection, id]);

  useEffect(() => {
    loadCollection();
  }, [loadCollection]);

  useEffect(() => {
    if (currentCollection?.words) {
      setWords(currentCollection?.words);
    }
  }, [currentCollection]);

  return (
    <div>
      <div>
        <BackButton />
        {words?.map((word, index) => (
          <div key={index}>{word.term}</div>
        ))}
      </div>
    </div>
  );
};
