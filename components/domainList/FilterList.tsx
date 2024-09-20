import { useEffect, useState } from "react";
import "./filterList.scss"; // Updated stylesheet name
import { Storage } from "@plasmohq/storage";

export const FilterList = ({ type }: { type: "domain" | "company" }) => {
  const [filters, setFilters] = useState<string[]>([]);


  const handleDeletion = async (filterToDelete: string) => {
    const updatedFilters = filters.filter(filter => filter !== filterToDelete);
    setFilters(updatedFilters);

    const storage = new Storage();
    await storage.set(type === "domain" ? "domains" : "companies", updatedFilters);
  };

  useEffect(() => {
    const fetchFilters = async () => {
      const storage = new Storage();
      const filtersStored: string[] = (await storage.get(type === "domain" ? "domains" : "companies")) || [];
      setFilters(filtersStored);
    };

    fetchFilters(); 
  }, [type]);

  return (
    <>
      <h2>{type === "domain" ? "Lista de Domínios" : "Lista de Empresas"}</h2>
      <p>Aqui você pode remover da filtragem, simplesmente passe o mouse sobre o item desejado e remova caso necessite.</p>
      <div className="list">
        {filters.map((filter, index) => (
          <li key={`${filter}-${index}`}>
            {filter}
            <button onClick={() => handleDeletion(filter)} className="delete-btn">
              X
            </button>
          </li>
        ))}
      </div>
    </>
  );
};
