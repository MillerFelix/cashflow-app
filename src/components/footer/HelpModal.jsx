import React, { useState, useEffect } from "react";
import Button from "../../components/common/Button";
import MoneyInput from "../../components/common/MoneyInput";
import {
  FaChartPie,
  FaExchangeAlt,
  FaCreditCard,
  FaBullseye,
  FaUser,
  FaTimes,
  FaArrowRight,
  FaArrowLeft,
  FaCheck,
  FaCode,
  FaLinkedin,
  FaGithub,
  FaWallet,
  FaLightbulb,
  FaInfoCircle,
  FaExclamationCircle,
} from "react-icons/fa";

function HelpModal({ isOpen, onClose, isOnboarding = false, onSaveBalance }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [initialBalance, setInitialBalance] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setError("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const allSteps = [
    {
      id: "welcome",
      title: "Bem-vindo ao CashFlow",
      icon: <FaWallet className="text-5xl text-green-600" />,
      color: "bg-green-50",
      content: (
        <div className="space-y-3 text-center">
          <p className="text-gray-600">
            Sua jornada para a liberdade financeira começa agora. Vamos fazer um
            tour rápido pelo sistema.
          </p>
          <div className="bg-blue-50 border border-blue-100 p-3 rounded-xl text-xs text-blue-700 font-medium">
            <FaInfoCircle className="inline mr-1" /> Você pode rever este
            tutorial clicando no botão de ajuda (?) flutuante.
          </div>
        </div>
      ),
    },
    {
      id: "dashboard",
      title: "Dashboard Inteligente",
      icon: <FaChartPie className="text-5xl text-blue-500" />,
      color: "bg-blue-50",
      content: (
        <div className="text-left text-sm text-gray-600 space-y-2">
          <p>Sua central de comando:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Saldo Atual:</strong> Dinheiro disponível hoje.
            </li>
            <li>
              <strong>Previsão:</strong> Quanto sobrará no fim do mês.
            </li>
            <li>
              <strong>Ritmo:</strong> Avisa se você está gastando rápido demais.
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: "transactions",
      title: "Transações",
      icon: <FaExchangeAlt className="text-5xl text-purple-500" />,
      color: "bg-purple-50",
      content: (
        <div className="text-left text-sm text-gray-600 space-y-2">
          <p>Registre tudo o que entra e sai:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Use categorias corretas para gráficos precisos.</li>
            <li>
              <strong>Recorrência:</strong> Cadastre gastos fixos para lançarem
              sozinhos.
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: "cards",
      title: "Cartões de Crédito",
      icon: <FaCreditCard className="text-5xl text-orange-500" />,
      color: "bg-orange-50",
      content: (
        <div className="text-left text-sm text-gray-600 space-y-2">
          <p>Gerencie limites e faturas:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Acompanhe o limite utilizado.</li>
            <li>
              O app avisa o <strong>Melhor Dia de Compra</strong>.
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: "goals",
      title: "Metas & Objetivos",
      icon: <FaBullseye className="text-5xl text-red-500" />,
      color: "bg-red-50",
      content: (
        <div className="text-left text-sm text-gray-600">
          <p className="mb-2">
            <strong>Orçamentos:</strong> Defina limites para não estourar.
          </p>
          <p>
            <strong>Sonhos:</strong> Crie objetivos de poupança e acompanhe o
            progresso.
          </p>
        </div>
      ),
    },
    {
      id: "balance-setup",
      isBalanceStep: true,
      title: "Ponto de Partida",
      icon: <FaWallet className="text-5xl text-green-600" />,
      color: "bg-green-100",
      content: null,
    },
    {
      id: "developer",
      isDeveloper: true,
      title: "Sobre o Desenvolvedor",
      icon: <FaCode className="text-4xl text-gray-800" />,
      color: "bg-gray-200",
      content: null,
    },
  ];

  const steps = isOnboarding
    ? allSteps
    : allSteps.filter((step) => !step.isBalanceStep);
  const totalSteps = steps.length;
  const activeStepData = steps[currentStep];

  const getNumericValue = (val) => {
    if (!val) return 0;
    if (typeof val === "number") return val;
    // Remove tudo que não é dígito e divide por 100 (para considerar centavos)
    const clean = val.toString().replace(/\D/g, "");
    return parseInt(clean, 10) / 100 || 0;
  };

  const handleNext = () => {
    if (activeStepData.isBalanceStep && isOnboarding) {
      const numericVal = getNumericValue(initialBalance);
      if (numericVal <= 0) {
        setError("Por favor, insira um valor maior que zero para continuar.");
        return;
      }
      setError("");
    }

    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      setError("");
    }
  };

  const handleFinish = () => {
    if (isOnboarding) {
      const numericVal = getNumericValue(initialBalance);
      if (numericVal <= 0) {
        const balanceIndex = steps.findIndex((s) => s.isBalanceStep);
        if (balanceIndex !== -1) setCurrentStep(balanceIndex);
        setError("O saldo inicial é obrigatório.");
        return;
      }
      onSaveBalance(initialBalance);
    } else {
      onClose();
    }
  };

  const renderStepContent = () => {
    if (activeStepData.isBalanceStep) {
      return (
        <div className="flex flex-col items-center text-center animate-fadeIn w-full">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
            <FaWallet className="text-4xl text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Defina seu Saldo Inicial
          </h2>
          <p className="text-gray-500 mb-6 text-sm max-w-xs mx-auto leading-relaxed">
            Para o CashFlow funcionar, precisamos saber quanto você tem hoje.
            Some o saldo de todas as suas contas bancárias e carteira.
          </p>
          <div className="w-full max-w-xs mx-auto">
            <MoneyInput
              value={initialBalance}
              onChange={(val) => {
                setInitialBalance(val);
                if (error) setError("");
              }}
              placeholder="R$ 0,00"
            />
            {error && (
              <p className="text-red-500 text-xs font-bold mt-2 flex items-center justify-center gap-1 animate-pulse">
                <FaExclamationCircle /> {error}
              </p>
            )}
          </div>
        </div>
      );
    }

    if (activeStepData.isDeveloper) {
      return (
        <div className="flex flex-col items-center text-center animate-fadeIn w-full">
          <div className="mb-5 relative">
            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-green-500 shadow-lg mx-auto bg-gray-200">
              {/* CORREÇÃO: referrerPolicy para desbloquear imagem do GitHub */}
              <img
                src="https://github.com/millerfelix.png"
                alt="Miller Felix"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://ui-avatars.com/api/?name=Miller+Felix&background=0D8ABC&color=fff";
                }}
              />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Miller Felix
          </h2>
          <p className="text-green-600 font-bold text-xs uppercase tracking-widest mb-6">
            Fullstack Developer
          </p>
          <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 text-sm text-gray-600 italic mb-6 w-full shadow-sm">
            "Criei o CashFlow com o objetivo de simplificar a gestão financeira
            pessoal. Espero que esta ferramenta ajude você a realizar seus
            sonhos!"
          </div>
          <div className="flex justify-center gap-8 w-full">
            <a
              href="https://www.linkedin.com/in/millerfelix"
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center text-blue-600 hover:text-blue-800 transition-colors gap-1 group"
            >
              <div className="p-3 bg-blue-50 rounded-full group-hover:bg-blue-100 transition-colors">
                <FaLinkedin className="text-2xl" />
              </div>
              <span className="text-xs font-bold">LinkedIn</span>
            </a>
            <a
              href="https://github.com/millerfelix"
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center text-gray-800 hover:text-black transition-colors gap-1 group"
            >
              <div className="p-3 bg-gray-100 rounded-full group-hover:bg-gray-200 transition-colors">
                <FaGithub className="text-2xl" />
              </div>
              <span className="text-xs font-bold">GitHub</span>
            </a>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center text-center animate-fadeIn w-full">
        <div
          className={`w-28 h-28 ${activeStepData.color} rounded-full flex items-center justify-center mb-6 shadow-sm mx-auto transition-colors duration-300`}
        >
          {activeStepData.icon}
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {activeStepData.title}
        </h2>
        <div className="w-full max-w-sm mx-auto">{activeStepData.content}</div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col min-h-[500px] max-h-[90vh] relative animate-scaleIn">
        {!isOnboarding && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-all z-10"
          >
            <FaTimes size={20} />
          </button>
        )}

        <div className="h-1.5 w-full bg-gray-100">
          <div
            className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-300 ease-out"
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          ></div>
        </div>

        <div className="p-8 flex-grow flex items-center justify-center">
          {renderStepContent()}
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-100 flex flex-col gap-4">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentStep === 0}
              className={`px-4 py-3 rounded-xl font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-100 transition-all shadow-sm ${currentStep === 0 ? "opacity-0 pointer-events-none" : "opacity-100"}`}
            >
              <FaArrowLeft />
            </button>

            <Button
              type="button"
              onClick={handleNext}
              className={`flex-1 py-3 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 
              ${error ? "bg-red-500 hover:bg-red-600" : "bg-gray-900 hover:bg-black shadow-gray-300"}`}
            >
              {currentStep === totalSteps - 1 ? (
                isOnboarding ? (
                  <>
                    Salvar e Iniciar <FaCheck />
                  </>
                ) : (
                  "Fechar Tutorial"
                )
              ) : (
                <>
                  Próximo <FaArrowRight />
                </>
              )}
            </Button>
          </div>

          <div className="flex justify-center gap-2">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentStep ? "w-6 bg-green-500" : "w-1.5 bg-gray-300"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HelpModal;
