import { useEffect, useState } from "react"

import "./FilterList.scss" // Estilos atualizados

import { Storage } from "@plasmohq/storage"

import { Input } from "~components/Input/Input"
import Pagination from "~components/Pagination/Pagination"
import { useTranslation } from "~hooks/useTranslation"

export const FilterList = ({
  type
}: {
  type: "domain" | "company" | "searches"
}) => {
  const { t } = useTranslation()
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
            ? t("tabjobs.tabs.domains")
            : type === "company"
              ? t("tabjobs.tabs.companies")
              : t("tabjobs.tabs.searches")}
        </h2>
        <p>
          {t("filterlist.general_tip")}
        </p>
        {type === "searches" && (
          <div>
            <p>
              {t("filterlist.searches_tip1")}
            </p>

            <p>
              {t("filterlist.searches_tip2")}
            </p>
          </div>
        )}
      </div>

      <div className="filter-container">
        <Input
          label={t("filterlist.search_label")}
          placeholder={t("filterlist.search_placeholder")}
          value={searchTerm}
          onChange={(value) => setSearchTerm(value)}
        />
        {currentItems.length === 0 ? (
          <>
            <p className="warning">
              {t("filterlist.no_items")}{" "}
              {type == "searches" ? (
                <>
                  {t("filterlist.no_searches_tip")}
                </>
              ) : (
                <>{t("filterlist.no_items_tip")}</>
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
                  ? t("filterlist.copied_message")
                  : filter.slice(0, 60)}
                <button
                  onClick={() => handleDeletion(filter)}
                  className="delete-btn"
                  title={t("filterlist.delete_button")}>
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
