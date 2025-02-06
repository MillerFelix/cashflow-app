import React, { useState, useEffect } from "react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaTimes,
  FaEnvelope,
  FaInstagram,
} from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";

function HelpModal({ isOpen, onClose }) {
  const [step, setStep] = useState(0);
  const user = useAuth();
  const userName = user?.displayName?.split(" ")[0] || "Usuário";

  useEffect(() => {
    if (isOpen) setStep(0); // Sempre volta para a primeira página ao abrir
  }, [isOpen]);

  if (!isOpen) return null;

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 2));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full shadow-lg relative">
        {/* Botão de Fechar */}
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-xl"
          onClick={onClose}
        >
          <FaTimes />
        </button>

        {/* Seções do modal */}
        {step === 0 && (
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-green-800">
              Olá, {userName}! Bem-vindo ao CashFlow
            </h2>
            <img
              src="/about-image.svg"
              alt="Sobre o App"
              className="w-full h-40 mx-auto my-4"
            />
            <p className="text-gray-700 text-sm">
              O <strong>CashFlow</strong> é um aplicativo para organizar suas
              finanças. Com ele, você pode acompanhar seus ganhos, gastos e
              definir metas financeiras.
            </p>
          </div>
        )}

        {step === 1 && (
          <div className="text-sm">
            <h2 className="text-2xl font-semibold text-green-800">Como Usar</h2>
            <ul className="mt-4 space-y-2 text-gray-700">
              <li>
                <strong>📌 Atualizar Saldo:</strong> No dashboard clique em
                "Atualizar Saldo" e informe o saldo atual.
              </li>
              <li>
                <strong>🎯 Criar Metas:</strong> Você pode começar definindo
                metas de ganho e despesas para organizar seu dinheiro.
              </li>
              <li>
                <strong>💰 Registrar Transações:</strong> Insira créditos e
                débitos que atualizarão seu saldo e metas.
              </li>
              <li>
                <strong>📊 Analisar o Dashboard:</strong> Visualize informações
                que te ajudam a entender detalhes de suas finanças.
              </li>
            </ul>
          </div>
        )}

        {step === 2 && (
          <div className="text-sm">
            <h2 className="text-2xl font-semibold text-green-800">
              Sobre o Desenvolvedor
            </h2>
            <p className="text-gray-700 mt-3">
              Olá! Meu nome é <strong>Miller</strong>, desenvolvedor solo deste
              projeto. O CashFlow foi criado por mim para facilitar o
              gerenciamento financeiro e está em constante evolução.
            </p>
            <p className="text-gray-700 mt-3">Futuras melhorias incluem:</p>
            <ul className="list-disc list-inside text-gray-700 mt-2">
              <li>🔹 Agendar transações recorrentes</li>
              <li>🔹 Perfil do Usuário</li>
              <li>🔹 Exportação de dados</li>
            </ul>

            {/* Contatos */}
            <div className="mt-5">
              <h3 className="text-lg font-semibold text-green-800">
                📩 Entre em contato
              </h3>
              <p className="text-gray-700 text-sm mt-1">
                Tem sugestões ou feedbacks? Fale comigo! 👇
              </p>
              <div className="mt-2">
                <p className="text-sm flex items-center gap-2">
                  <FaEnvelope className="text-green-700" />
                  Email:{" "}
                  <a
                    href="mailto:millerrfelix@gmail.com"
                    className="text-green-700 hover:underline"
                  >
                    millerrfelix@gmail.com
                  </a>
                </p>
                <p className="text-sm flex items-center gap-2">
                  <FaInstagram className="text-green-700" />
                  Instagram:{" "}
                  <a
                    href="https://instagram.com/millerfelix_"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-700 hover:underline"
                  >
                    @millerfelix_
                  </a>
                </p>
              </div>
            </div>

            <p className="text-gray-700 mt-4">
              Obrigado por usar o CashFlow! 🚀💸
            </p>
          </div>
        )}

        {/* Navegação */}
        <div className="flex justify-between items-center mt-6">
          <button
            className={`text-green-800 flex items-center gap-2 px-4 py-2 rounded-full font-semibold ${
              step === 0
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-green-100"
            }`}
            onClick={prevStep}
            disabled={step === 0}
          >
            <FaArrowLeft />
            Voltar
          </button>
          <p className="text-sm text-gray-600">Passo {step + 1} de 3</p>
          {step < 2 ? (
            <button
              className="text-green-800 flex items-center gap-2 px-4 py-2 rounded-full font-semibold hover:bg-green-100"
              onClick={nextStep}
            >
              Avançar <FaArrowRight />
            </button>
          ) : (
            <button
              className="bg-green-700 flex items-center gap-2 text-white px-4 py-2 rounded-full font-semibold hover:bg-green-800"
              onClick={onClose}
            >
              Fechar <FaTimes />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default HelpModal;
