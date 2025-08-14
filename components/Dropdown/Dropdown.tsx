import React, { useState } from "react";
import "./Dropdown.scss"
const Dropdown: React.FC<{
  label: string;
  options: {
    value: string;
    label: string;
  }[];
  onChange: (value: string) => void;
}> = ({ label, options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(options[0]);

  const handleButtonClick = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option: { value: string; label: string }) => {
    setSelectedOption(option);
    setIsOpen(false);
    onChange(option.value);
  };

  return (
    <div className="dropdown">
      <label className="dropdown-label">{label}</label>
      <br/>
      <button
        className="dropdown-button"
        type="button"
        onClick={handleButtonClick}
      >
        {selectedOption.label}
      </button>
      {isOpen && (
        <ul className="dropdown-options">
          {options.map((option) => (
            <li
              className="dropdown-option"
              key={option.value}
              onClick={() => handleOptionClick(option)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;

