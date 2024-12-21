import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function BalanceVisibilityToggle() {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <button
      onClick={() => setIsVisible(!isVisible)}
      className="text-yellow-300 text-2xl"
    >
      {isVisible ? <FaEyeSlash /> : <FaEye />}
    </button>
  );
}

export default BalanceVisibilityToggle;
