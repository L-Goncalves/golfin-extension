import { useEffect, useState } from "react";
import "./FilterList.scss"; // Estilos atualizados
import { Storage } from "@plasmohq/storage";

export const FilterList = ({ type }: { type: "domain" | "company" | "searches" }) => {
  const [filters, setFilters] = useState<string[]>([]);

  const handleDeletion = async (filterToDelete: string) => {
    const updatedFilters = filters.filter((filter) => filter !== filterToDelete);
    setFilters(updatedFilters);

    const storage = new Storage();
    await storage.set(getStorageKey(), updatedFilters);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Determina a chave de armazenamento com base no tipo
  const getStorageKey = () => {
    if (type === "domain") return "domains";
    if (type === "company") return "companies";
    if (type === "searches") return "searches";
    return "";
  };

  useEffect(() => {
    const fetchFilters = async () => {
      const storage = new Storage();
      const filtersStored: string[] = (await storage.get(getStorageKey())) || [];
      setFilters(filtersStored);
    };

    fetchFilters(); // Carrega os filtros armazenados quando o tipo muda
  }, [type]);

  return (
    <>
      <h2>
        {type === "domain"
          ? "Lista de Domínios"
          : type === "company"
          ? "Lista de Empresas"
          : "Lista de Pesquisas"}
      </h2>
      <p>Aqui você pode remover da filtragem, simplesmente passe o mouse sobre o item desejado e remova caso necessite.</p>
      <div className="list">
        {filters.map((filter, index) => (
          <li className={type === "searches" && "copyable" } key={`${filter}-${index}`}  onClick={() => type === "searches" && handleCopy(filter)}>
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
