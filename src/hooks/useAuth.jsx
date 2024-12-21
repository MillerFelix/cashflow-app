import { useState, useEffect } from "react";
import { auth, onAuthStateChanged } from "../firebase";

export function useAuth() {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid); // Agora retorna apenas o user.uid
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return userId; // Retorna apenas o UID
}
