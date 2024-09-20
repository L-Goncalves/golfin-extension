import "./Checkbox.scss";
import { useState } from "react";

export const Checkbox = ({ label, id, tooltip }) => {
  const [checked, setChecked] = useState(false);

  const handleCheckboxChange = () => {
    setChecked(!checked);
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
