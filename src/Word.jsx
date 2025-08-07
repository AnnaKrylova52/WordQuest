import { useState } from "react";
import axios from "axios";
// const API_KEY =
//   "dict.1.1.20250805T152237Z.317d9afb3f38114e.af09226d82f730fec226c957ddbb03d8e8e2c096"; //Яндекс Словарь

export const Words = () => {
  const [word, setWord] = useState("");
  const [definitions, setDefinitions] = useState([]);

  const fetchTranslations = async () => {
    if (!word.trim()) return;
    try {
      const response = await axios.get(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      );

      const data = await response.data;

      const allDefinitions = [];
      data.forEach((word) => {
        word.meanings.forEach((meaning) => {
          meaning.definitions.forEach((def) => {
            allDefinitions.push({
              definition: def.definition,
              synonyms: def.synonyms || "",
              example: def.example || "",
              partOfSpeech: meaning.partOfSpeech,
            });
          });
        });
      });

      setDefinitions(allDefinitions);
      console.log("translating");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <div className="text-center mt-10 text-white">
        <input
          className=" border border-white rounded-sm px-4 py-2 mr-2"
          type="text"
          placeholder="Введите слово"
          value={word}
          onChange={(e) => setWord(e.target.value)}
        />
        <button
          onClick={fetchTranslations}
          className="bg-red-600 p-2 rounded-md hover:cursor-pointer hover:bg-red-700"
        >
          Поиск
        </button>
      </div>
      {definitions.length > 0 && (
        <div className="flex justify-center mt-6">
          <div className="text-white text-center w-xs">
            {definitions.map((def, index) => (
              <div className="border rounded-md mb-4" key={index}>
                <div className="flex items-start">
                  <span className="bg-gray-500 rounded px-1 ">
                    {def.partOfSpeech}
                  </span>
                  <div>
                    <h3 className="p-1">Definition: {def.definition}</h3>

                    {def.example && (
                      <p className="text-red-600">Example: {def.example}</p>
                    )}
                  </div>
                </div>

                {def.synonyms.length > 0 && (
                  <div className="mb-3">
                    <h4 className="font-semibold mb-1">Synonyms:</h4>
                    <div className="flex flex-wrap gap-2">
                      {def.synonyms.map((synonym, sIndex) => (
                        <span
                          key={sIndex}
                          className="px-2 py-1 bg-gray-700 rounded-md text-sm"
                        >
                          {synonym}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
