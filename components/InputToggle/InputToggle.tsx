import "./InputToggle.scss";
import { useState } from "react";

interface IProps {
  label: string;
  value: boolean;
  onChange: (newValue: boolean) => void;
}

export const InputToggle = (props: IProps) => {
  const { label, value, onChange } = props;

  const handleToggle = () => {
    console.log("handling toggle");
    const newValue = !value; // Use the incoming value prop
    onChange(newValue);
  };

  return (
    <div className="input-toggle-container">
      <label htmlFor="extension-toggle">{label}:</label>
      <div className="toggle-switch">
        <input
          id="extension-toggle"
          type="checkbox"
          checked={value}
        />
        
        <span onClick={handleToggle} className="slider"></span>
        
      </div>
    </div>
  );
};
