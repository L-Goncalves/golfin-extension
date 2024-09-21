import { useEffect, useState } from "react";
import "./KeywordEditor.scss"; // Assuming you'll style it with a SCSS file
import { Button } from "~components/Button/Button";
import { Storage } from "@plasmohq/storage";

export const KeywordEditor = () => {
  const [keywords, setKeywords] = useState("");
  const [isEditing, setIsEditing] = useState(false);



  useEffect(() => {
    const fetchKeywords = async () => {
      const storage = new Storage();
      const keywords: any = (await storage.get('keywords')) || []; // Fallback to an empty array if no domains found
      setKeywords(keywords);
    };

    fetchKeywords();

  }, [isEditing == false]); 

  
  const handleAddKeywords = async () => {
  
  
    setIsEditing(!isEditing);
    const storage = new Storage();
    if(keywords.trim().length > 0){
      const keywordsArr = keywords.split(",")
      .map((keyword) => keyword.trim())
      .filter((keyword) => keyword !== "");

      if(isEditing){
          await storage.set("keywords", keywordsArr)
      }
    }
 
   
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setKeywords(e.target.value);
  };

  return (
    <div className="keyword-editor">
      
        <div className="textarea-container">
          <textarea
            id="keywords"
            rows={4}
            cols={50}
            value={keywords}
            onChange={handleInputChange}
            placeholder="Escreva suas palavras-chaves aqui. ( SEPARADO POR VÍRGULA )
            Exemplo: Cadeirada, Fora do ar, Patinhos"
            disabled={!isEditing}
          />
        </div>
      
      <div className="button-container">
        <Button onClick={handleAddKeywords}>
          {isEditing ? "Concluir Edição" : "Editar"}
        </Button>
       
      </div>
    </div>
  );
};
