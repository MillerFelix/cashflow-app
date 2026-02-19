import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

/**
 * Hook Customizado: useAuth
 * Gerencia o estado de autenticação do usuário.
 * Escuta as mudanças do Firebase e busca o nome do usuário no Firestore.
 */
export function useAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Flag de segurança: impede que o estado seja atualizado se o componente for destruído (Memory Leak)
    let isMounted = true;

    // Cria o "olheiro" que avisa sempre que alguém logar ou deslogar
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Busca os dados adicionais do usuário (como o nome) no Firestore
          const userDocRef = doc(db, "users", firebaseUser.uid);
          const userDocSnap = await getDoc(userDocRef);

          // Só atualiza a tela se ela ainda estiver aberta
          if (isMounted) {
            if (userDocSnap.exists()) {
              const userData = userDocSnap.data();
              setUser({
                uid: firebaseUser.uid,
                displayName: userData.name || "Usuário",
              });
            } else {
              setUser({ uid: firebaseUser.uid, displayName: "Usuário" });
            }
          }
        } catch (error) {
          console.error("Erro ao buscar dados do usuário:", error);
          if (isMounted) {
            setUser({ uid: firebaseUser.uid, displayName: "Usuário" }); // Fallback seguro em caso de erro
          }
        }
      } else {
        if (isMounted) setUser(null); // Limpa o usuário se deslogou
      }
    });

    // Função de Limpeza (Cleanup): Para de ouvir o Firebase quando o hook é desmontado
    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  return user;
}
