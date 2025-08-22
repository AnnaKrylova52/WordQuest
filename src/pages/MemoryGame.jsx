import { useEffect } from "react";
import { useCollections } from "../store/useCollections";

export const MemoryGame = () => {
  const { userCollections } = useCollections();
  const words = userCollections.map((col) => col.words.term);
  useEffect(() => {
    console.log(words);
  });
  return <div></div>;
};
