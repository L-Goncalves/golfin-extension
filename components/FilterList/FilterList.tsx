import { useEffect, useState } from "react"

import "./FilterList.scss" // Estilos atualizados

import { Storage } from "@plasmohq/storage"

import { Input } from "~components/Input/Input"
import Pagination from "~components/Pagination/Pagination"

export const FilterList = ({
  type
}: {
  type: "domain" | "company" | "searches"
}) => {
  const [filters, setFilters] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const handleDeletion = async (filterToDelete: string) => {
    const updatedFilters = filters.filter((filter) => filter !== filterToDelete)
    setFilters(updatedFilters)

    const storage = new Storage()
    await storage.set(getStorageKey(), updatedFilters)
  }

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index) // Set the copied index
    setTimeout(() => setCopiedIndex(null), 2000) // Reset after 2 seconds
  }

  const getStorageKey = () => {
    if (type === "domain") return "domains"
    if (type === "company") return "companies"
    if (type === "searches") return "searches"
    return ""
  }

  useEffect(() => {
    const fetchFilters = async () => {
      const storage = new Storage()
      const filtersStored: string[] = (await storage.get(getStorageKey())) || []
      setFilters(filtersStored)
    }

    fetchFilters()
  }, [type])

  const filteredFilters = filters.filter((filter) =>
    filter.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredFilters.slice(indexOfFirstItem, indexOfLastItem)

  const totalPages = Math.ceil(filteredFilters.length / itemsPerPage)

  return (
    <>
      <div className="filter-header">
        <h2>
          {type === "domain"
            ? "Lista de Domínios"
            : type === "company"
              ? "Lista de Empresas"
              : "Lista de Pesquisas"}
        </h2>
        <p>
          Aqui você pode remover da filtragem, simplesmente passe o mouse sobre
          o item desejado e remova caso necessite.
        </p>
        {type === "searches" && (
          <div>
            <p>
              Dica: Ao deixar o mouse sobre o item da pesquisa você poderá ver a
              pesquisa completa.{" "}
            </p>

            <p>
              Dica: Clique no item para copiá-lo automaticamente para a área de
              transferência (CTRL + V).
            </p>
          </div>
        )}
      </div>

      <div className="filter-container">
        <Input
          label="Pesquisa"
          placeholder="Pesquise aqui o item que deseja"
          value={searchTerm}
          onChange={(value) => setSearchTerm(value)}
        />
        {currentItems.length === 0 ? (
          <>
            <p className="warning">
              Não existe itens nessa lista,{" "}
              {type == "searches" ? (
                <>
                  Você pode habilitar a opção de salvar as suas pesquisas para
                  começar a visualizar aqui.
                </>
              ) : (
                <>você pode começar adicionando na aba de ajustes.</>
              )}
            </p>
          </>
        ) : (
          <div className="list">
            {currentItems.map((filter, index) => (
              <li
                className={type === "searches" ? "copyable" : ""}
                key={`${filter}-${index}`}
                onClick={() => type === "searches" && handleCopy(filter, index)}
                title={filter}>
                {copiedIndex === index
                  ? "Pesquisa Copiada"
                  : filter.slice(0, 60)}
                <button
                  onClick={() => handleDeletion(filter)}
                  className="delete-btn">
                  X
                </button>
              </li>
            ))}
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </>
  )
}
