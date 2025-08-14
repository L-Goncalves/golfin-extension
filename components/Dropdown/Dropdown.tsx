import React, { useState, useEffect, useRef } from "react";
import "./Dropdown.scss"
import { Storage } from "@plasmohq/storage";
import { sendToBackground, type MessagesMetadata } from "@plasmohq/messaging";

const storage = new Storage();

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

  const handleOptionChange = async (newOptionValue: string) => {
    setSelectedOption(options.find(option => option.value === newOptionValue));
    onChange(newOptionValue);

    // try {
    //   storage.set('selectedDropdownOption', newOptionValue);
    //   await sendToBackground({
    //     name: "update-dropdown-timestamp",
    //     body: { timestamp: newOptionValue },
    //   });
    // } catch (error) {
    //   console.error("Failed to update dropdown option:", error);
    // }
  };
  
  useEffect(() => {
    const fetchSelectedOption = async () => {
      try {
        const selectedOptionValue = await storage.get('selectedDropdownOption');
        const selectedOption = options.find(option => option.value === selectedOptionValue);
        if (selectedOption) {
          setSelectedOption(selectedOption);
        }
      } catch (error) {
        console.error("Failed to fetch selected dropdown option:", error);
      }
    };

    const fetchUrl = async () => {

      try {

        const { url } = await sendToBackground({
          name: "get-current-url",
        });

        console.log("FETCHED URL", url)

        if(url.includes("/jobs") && !url.includes("f_TPR=")) {
          console.log("MUST ADD PARAMS")
        } 

        
        if(url.includes("/jobs") && url.includes("f_TPR=")) {
          console.log("MUST REPLACE PARAMS")

        const fTPRMatch = url.match(/f_TPR=([^&]+)/);
        const fTPRValue = fTPRMatch ? fTPRMatch[1].replace(/r/g, '') : null;


            if (fTPRValue) {
                const seconds = parseInt(fTPRValue, 10);
                const hours = seconds / 3600;
                console.log("Seconds:", seconds);
                console.log("Hours:", hours.toFixed(2));
            }
        }


      } catch (error) {
        console.error("Failed to fetch theme color:", error);
      }
    };

    fetchUrl();
    fetchSelectedOption();
  }, [options, selectedOption]);



  return (
    <div className="dropdown">
      <label className="dropdown-label">{label}</label>
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
              onClick={() => handleOptionChange(option.value)}
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

