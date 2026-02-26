import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

// 1. Criamos o Contexto Global
const AuthContext = createContext();

// 2. Criamos o Provider que vai abraçar a aplicação
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Evita renderizar a tela antes de saber o auth

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, "users", firebaseUser.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setUser({
              uid: firebaseUser.uid,
              displayName: userData.name || "Usuário",
            });
          } else {
            setUser({ uid: firebaseUser.uid, displayName: "Usuário" });
          }
        } catch (error) {
          console.error("Erro ao buscar dados do usuário:", error);
          setUser({ uid: firebaseUser.uid, displayName: "Usuário" });
        }
      } else {
        setUser(null);
      }
      setLoading(false); // Finaliza o loading global
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {/* Só exibe a aplicação quando terminar de verificar o Firebase */}
      {!loading && children}
    </AuthContext.Provider>
  );
}

// 3. O hook agora apenas consome o contexto (não quebra o resto do seu app)
export function useAuth() {
  const context = useContext(AuthContext);
  return context?.user || null;
}
