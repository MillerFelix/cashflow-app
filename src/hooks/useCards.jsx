import { useState, useCallback, useEffect } from "react";
import { CardService } from "../services/cardService";

export function useCards(userId) {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCards = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const data = await CardService.getAll(userId);
      setCards(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  const addCard = useCallback(
    async (cardData) => {
      if (!userId) return;
      setLoading(true);
      try {
        const newCard = await CardService.add(userId, cardData);
        setCards((prev) => [...prev, newCard]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [userId],
  );

  const updateCard = useCallback(
    async (id, data) => {
      if (!userId) return;
      setLoading(true);
      try {
        await CardService.update(userId, id, data);
        setCards((prev) =>
          prev.map((c) => (c.id === id ? { ...c, ...data } : c)),
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [userId],
  );

  const removeCard = useCallback(
    async (id) => {
      if (!userId) return;
      setLoading(true);
      try {
        await CardService.remove(userId, id);
        setCards((prev) => prev.filter((c) => c.id !== id));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [userId],
  );

  return { cards, loading, addCard, updateCard, removeCard };
}
