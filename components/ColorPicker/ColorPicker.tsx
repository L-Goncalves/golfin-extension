import { useEffect, useState, useRef } from "react";
import { Storage } from "@plasmohq/storage";
import { sendToBackground } from "@plasmohq/messaging";
import "./ColorPicker.scss";

const storage = new Storage();

const ColorPicker: React.FC = () => {
  const [color, setColor] = useState("#000000"); // Default color
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null); // For debouncing

  useEffect(() => {
    const fetchColor = async () => {
      try {
        const response = await sendToBackground({
          name: "get-theme-color",
        });

        const { colors } = response;

        if (colors) {
          setColor(colors.brandColor);
        }
      } catch (error) {
        console.error("Failed to fetch color:", error);
      }
    };
    fetchColor();
  }, []);

  const handleColorChange = (newColor: string) => {
    setColor(newColor);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }


    debounceTimeout.current = setTimeout(async () => {
      try {
        await sendToBackground({
          name: "update-theme-color",
          body: { color: newColor },
        });
      } catch (error) {
        console.error("Failed to update color:", error);
      }
    }, 700);
  };

  return (
    <div className="color-picker">
      <div className="color-picker container">
        <input
          type="color"
          value={color}
          onChange={(event) => handleColorChange(event.target.value)}
        />
        <label>👈Selecione uma cor de tema para o seu LinkedIn!</label>
      </div>
    </div>
  );
};

export default ColorPicker;
