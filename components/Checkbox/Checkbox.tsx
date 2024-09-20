import "./Checkbox.scss";
import { useState } from "react";

export const Checkbox = ({ label, id, tooltip, onChange, checked }) => {
  

  const handleCheckboxChange = () => {
    const newCheckedState = !checked;

    if (onChange) {
      onChange(newCheckedState); // Call the onChange prop with the new state
    }
  };

  return (
    <div className="checkbox">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={handleCheckboxChange}
      />
      <div className="label-wrapper">
        <label htmlFor={id} className={checked ? "checked" : ""}>
          {label}
        </label>
        {tooltip && <span className="tooltip">{tooltip}</span>}
      </div>
    </div>
  );
};
