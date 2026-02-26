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
      console.error("Erro ao buscar cartões:", error);
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
        console.error("Erro ao adicionar cartão:", error);
      } finally {
        setLoading(false);
      }
    },
    [userId],
  );

  const updateCard = useCallback(
    async (cardId, updatedData) => {
      if (!userId) return;

      setLoading(true);
      try {
        await CardService.update(userId, cardId, updatedData);
        setCards((prev) =>
          prev.map((card) =>
            card.id === cardId ? { ...card, ...updatedData } : card,
          ),
        );
      } catch (error) {
        console.error("Erro ao atualizar cartão:", error);
      } finally {
        setLoading(false);
      }
    },
    [userId],
  );

  const removeCard = useCallback(
    async (cardId) => {
      if (!userId) return;

      setLoading(true);
      try {
        await CardService.remove(userId, cardId);
        setCards((prev) => prev.filter((card) => card.id !== cardId));
      } catch (error) {
        console.error("Erro ao remover cartão:", error);
      } finally {
        setLoading(false);
      }
    },
    [userId],
  );

  return { cards, loading, addCard, updateCard, removeCard };
}
