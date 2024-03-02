import { useCallback, useState } from "react";

export interface Game {
  date: string;
  scores: Array<{ name: string; score: number }>;
}

const loadFromLocalStorage = (): Game[] => {
  try {
    const jsonStr = localStorage.getItem("gameHistory") || "[]";
    return JSON.parse(jsonStr);
  } catch {
    return [];
  }
};

const saveToLocalStorage = (games: Game[]) => {
  localStorage.setItem("gameHistory", JSON.stringify(games));
};

export const useGameHistory = () => {
  const [games, setGames] = useState<Game[]>(loadFromLocalStorage);

  const add = useCallback((game: Game) => {
    setGames((prev) => {
      const next = [game, ...prev];
      saveToLocalStorage(next);
      return next;
    });
  }, []);

  const remove = useCallback((gameIndex: number) => {
    setGames((prev) => {
      const next = prev.filter((_g, i) => i !== gameIndex);
      saveToLocalStorage(next);
      return next;
    });
  }, []);

  return { games, add, remove };
};
