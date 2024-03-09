import { useCallback, useState } from "react";

const getCharacterPoints = (char: string) => {
  switch (char.toLowerCase()) {
    case "a":
    case "e":
    case "i":
    case "o":
    case "u":
    case "l":
    case "n":
    case "r":
    case "s":
    case "t":
      return 1;
    case "d":
    case "g":
      return 2;
    case "b":
    case "c":
    case "m":
    case "p":
      return 3;
    case "f":
    case "h":
    case "v":
    case "w":
    case "y":
      return 4;
    case "k":
      return 5;
    case "j":
    case "x":
      return 8;
    case "q":
    case "z":
      return 10;
    default:
      return 0;
  }
};

const calculateWordScore = (word: string) =>
  word.split("").reduce((acc, letter) => acc + getCharacterPoints(letter), 0);

const loadFromLocalStorage = (): Player[] => {
  try {
    const jsonStr = localStorage.getItem("players") || "[]";
    return JSON.parse(jsonStr);
  } catch {
    return [];
  }
};

const saveToLocalStorage = (players: Player[]) => {
  localStorage.setItem("players", JSON.stringify(players));
};

interface Word {
  word: string;
  score: number;
}

export interface Player {
  name: string;
  words: Word[];
  leftover?: Word;
  score: number;
}

export const useScoringLogic = () => {
  const [players, RAW_setPlayers] = useState<Player[]>(loadFromLocalStorage);

  const setPlayers = useCallback((callback: (prev: Player[]) => Player[]) => {
    RAW_setPlayers((prev) => {
      const newPlayers = callback(prev);
      saveToLocalStorage(newPlayers);
      return newPlayers;
    });
  }, []);

  const addPlayer = useCallback((name: string) => {
    setPlayers((prev) => [...prev, { name, words: [], score: 0 }]);
  }, []);

  const setPlayerName = useCallback((playerIndex: number, name: string) => {
    setPlayers((prev) =>
      prev.map((player, index) => {
        if (index !== playerIndex) return player;
        return {
          ...player,
          name,
        };
      })
    );
  }, []);

  const removePlayer = useCallback((index: number) => {
    setPlayers((prev) => {
      const next = [...prev];
      next.splice(index, 1);
      return next;
    });
  }, []);

  const addWord = useCallback((playerIndex: number, word: string) => {
    setPlayers((players) =>
      players.map((player, index) => {
        if (index !== playerIndex) return player;

        const score = calculateWordScore(word);
        const words = [...player.words, { word, score }];
        return {
          ...player,
          words,
          score: words.reduce((acc, w) => acc + w.score, 0) + (player.leftover?.score || 0),
        };
      })
    );
  }, []);

  const setLeftoverLetters = useCallback((playerIndex: number, letters: string) => {
    setPlayers((players) => players.map((player, index) => {
      if (index !== playerIndex) return player

      const leftoverScore = -1 * calculateWordScore(letters)
      return {
        ...player,
        leftover: {
          word: letters,
          score: leftoverScore,
        },
        score: player.words.reduce((acc, w) => acc + w.score, 0) + leftoverScore
      }
    }))
  }, [])

  const removeWord = useCallback((playerIndex: number, wordIndex: number) => {
    setPlayers((players) =>
      players.map((player, index) => {
        if (index !== playerIndex) return player;
        const words = player.words.filter((_w, i) => i !== wordIndex);

        return {
          ...player,
          words,
          score: words.reduce((acc, w) => acc + w.score, 0),
        };
      })
    );
  }, []);

  const clearWords = useCallback(() => {
    setPlayers((players) =>
      players.map((p) => ({ ...p, words: [], leftover: { word: "", score: 0 }, score: 0 }))
    );
  }, []);

  return {
    players,
    addPlayer,
    setPlayerName,
    removePlayer,
    addWord,
    removeWord,
    clearWords,
    setLeftoverLetters,
  };
};
