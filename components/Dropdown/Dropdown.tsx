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
  const [timestampSeconds, setTimestampSeconds] = useState(0);
  const handleButtonClick = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionChange = async (newOptionValue: string) => {
    setSelectedOption(options.find(option => option.value === newOptionValue));
    onChange(newOptionValue);
    setIsOpen(false); // Close dropdown after selection

    try {
      storage.set('selectedDropdownOption', newOptionValue);
      
      // Convert dropdown value to seconds for f_TPR parameter
      const timeMap: { [key: string]: number } = {
        "30m": 1800,
        "1h": 3600,
        "5h": 18000,
        "12h": 43200,
        "24h": 86400,
        "36h": 129600,
        "48h": 172800,
        "4d": 345600,
        "7d": 604800
      };
      
      const seconds = timeMap[newOptionValue];
      if (seconds) {
        await sendToBackground({
          name: "update-dropdown-timestamp",
          body: { seconds },
        });
      }
    } catch (error) {
      console.error("Failed to update dropdown option:", error);
    }
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

        if(url && (url.includes("/jobs/collections") || url.includes("/jobs/search"))) {
          // Check if f_TPR parameter exists
          if(url.includes("f_TPR=")) {
            console.log("MUST REPLACE PARAMS")
            const fTPRMatch = url.match(/f_TPR=r([^&]+)/);
            const fTPRValue = fTPRMatch ? fTPRMatch[1] : null;

            if (fTPRValue) {
              const seconds = parseInt(fTPRValue, 10);
              setTimestampSeconds(seconds)
              
              // Find matching option based on seconds
              const timeMap: { [key: string]: number } = {
                "30m": 1800,
                "1h": 3600,
                "5h": 18000,
                "12h": 43200,
                "24h": 86400,
                "36h": 129600,
                "48h": 172800,
                "4d": 345600,
                "7d": 604800
              };
              
              const matchingOption = Object.entries(timeMap).find(([_, secs]) => secs === seconds);
              if (matchingOption) {
                const [value] = matchingOption;
                const option = options.find(opt => opt.value === value);
                if (option) {
                  setSelectedOption(option);
                }
              }
            }
          } else {
            console.log("MUST ADD PARAMS")
          }
        }
      } catch (error) {
        console.error("Failed to fetch URL:", error);
      }
    };

    fetchUrl();
    fetchSelectedOption();
  }, [options]);

  // Update selected option when options change (language switch)
  useEffect(() => {
    if (selectedOption && options.length > 0) {
      const updatedOption = options.find(option => option.value === selectedOption.value);
      if (updatedOption) {
        setSelectedOption(updatedOption);
      }
    }
  }, [options]);



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

