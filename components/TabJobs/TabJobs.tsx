import { Checkbox } from "~components/Checkbox/Checkbox"

import "./TabJobs.scss"

import { useEffect, useState } from "react"
import { FaBuilding } from "react-icons/fa6"
import { TbWorldX } from "react-icons/tb"

import { Storage } from "@plasmohq/storage"

import { Button } from "~components/Button/Button"
import { FilterList } from "~components/FilterList/FilterList"
import { Input } from "~components/Input/Input"
import Tabs from "~components/Tabs/Tabs"
import {
  shouldAutoApply, shouldDisplayIcons,
  shouldFilterByCompany,
  shouldFilterByDomain,
  shouldRemoveAppliedJobs,
  shouldRemovePromotedJobs,
  shouldSaveJobSearch
} from "~content-scripts/storage"
import Dropdown from "~components/Dropdown/Dropdown"

const TabJobHeader = () => {
  return (
    <>
      <h2>Vagas</h2>
      <p>
        Olá!😁 Essa seção é dedicada a te ajudar a filtrar vagas na sua busca de
        Emprego! Considere esses como filtros extras e não um substituto para o
        LinkedIn!
        <br />
        <br />
        <span>
          Lembrando que aqui só remove visualmente, enquanto a extensão estiver
          ligada!
        </span>
      </p>
    </>
  )
}

const AdjustmentTab = () => {
  const [domain, setDomainValue] = useState("")
  const [company, setCompanyValue] = useState("")
  const [domains, setDomains] = useState<string[]>([]) // Ensure it's typed as an array
  const [companies, setCompanies] = useState<string[]>([]) // State for companies
  const [shouldShowIcons, setShowIcons] = useState<boolean>(false)
  const [shouldFilterCompany, setShouldFilterByCompany] =
    useState<boolean>(false)
  const [saveJobSearch, setSaveJobSearch] = useState<boolean>(false)
  const [shouldFilterDomains, setShouldFilterByDomain] =
    useState<boolean>(false)
  const [shouldRemoveApplied, setShouldRemoveApplied] = useState<boolean>(false)
  const [shouldRemovePromoted, setShouldRemovePromoted] = useState<boolean>(false)
  const [shouldAutoApplyJob, setShouldAutoApply] = useState<boolean>(false)
  const storage = new Storage();


  const handleFeedCheckbox = async (
    checked: boolean,
    key: string,
    stateFunc: any
  ) => {
    const storage = new Storage()
    stateFunc(checked)

    await storage.set(key, checked) // Save the checkbox state in storage
  }

  useEffect(() => {
    const fetchInitialState = async () => {
      const storedCompanies: any = (await storage.get("companies")) || [] // Fallback to an empty array
      const shouldFilterCompany = await shouldFilterByCompany()
      const saveJobSearch = await shouldSaveJobSearch()
      const storedDomains: any = (await storage.get("domains")) || []; // Fallback to an empty array
      const filterByDomain =  await shouldFilterByDomain()
      const removeApplied = await shouldRemoveAppliedJobs();
      const removePromoted = await shouldRemovePromotedJobs();
      const showIcons = await shouldDisplayIcons();
      setSaveJobSearch(saveJobSearch);
      setCompanies(storedCompanies);
      setDomains(storedDomains);
      setShowIcons(showIcons);
      setShouldFilterByCompany(shouldFilterCompany);
      setShouldFilterByDomain(filterByDomain);
      setShouldRemoveApplied(removeApplied);
      setShouldRemovePromoted(removePromoted);
    }

    fetchInitialState()
  }, [])

  const handleAddDomain = async () => {
    if (domain.length > 0) {
      const updatedDomains = [...domains, domain]
      setDomains(updatedDomains) // Update local state
      setDomainValue("") // Reset the input value

      // Save the updated list to storage
      await storage.set("domains", updatedDomains)
    }
  }

  const handleAddCompany = async () => {
    if (company.length > 0) {
      const updatedCompanies = [...companies, company]
      setCompanies(updatedCompanies) // Update local state
      setCompanyValue("") // Reset the input value

      // Save the updated list to storage
      await storage.set("companies", updatedCompanies)
    }
  }

  return (
    <div className="adjustments-tab">
      <h3>Opções para Vagas: </h3>
      <div className="tips">
        1. Para usar essas opções, acesse:
        <a
          href="https://www.linkedin.com/jobs/collections/"
          target="_blank"
          rel="noopener noreferrer">
          linkedin.com/jobs/collections
        </a>
        . Navegue e faça suas pesquisas dentro dessa página.
      </div>
      <Checkbox
        onChange={(checked) =>
          handleFeedCheckbox(checked, "shouldShowIcons", setShowIcons)
        }
        checked={shouldShowIcons}
        id={"show-icons"}
        label={"Exibir ícones dos sites e URL completa"}
        tooltip={"Exibe um ícone do site e o nome ao lado da vaga."}
      />

      <Checkbox
        onChange={(checked) =>
          handleFeedCheckbox(checked, "saveJobSearch", setSaveJobSearch)
        }
        checked={saveJobSearch}
        id={"save-job-search"}
        label={"Salvar pesquisas na lista"}
        tooltip={
          "Salva suas pesquisas enquanto você navega no LinkedIn, evitando a necessidade de buscar no histórico."
        }
      />

      <Checkbox
        onChange={(checked) =>
          handleFeedCheckbox(
            checked,
            "filterJobsByDomain",
            setShouldFilterByDomain
          )
        }
        checked={shouldFilterDomains}
        id={"filter-by-domain"}
        label={"Excluir vagas de domínios indesejados"}
        tooltip={
          "Filtra visualmente as vagas com base na sua 'Lista de Domínios'."
        }
      />

      <Checkbox
        onChange={(checked) =>
          handleFeedCheckbox(
            checked,
            "shouldFilterByCompany",
            setShouldFilterByCompany
          )
        }
        checked={shouldFilterCompany}
        id={"filter-by-company"}
        label={"Remover vagas por nome de empresas"}
        tooltip={
          "Filtra visualmente as vagas com base na sua 'Lista de Empresas'."
        }
      />

      <Checkbox
        onChange={(checked) =>
          handleFeedCheckbox(
            checked,
            "remove-applied-jobs",
            setShouldRemoveApplied
          )
        }
        checked={shouldRemoveApplied}
        id={"remove-applied-jobs"}
        label={
          "Remover vagas nas quais já me apliquei (exibido como 'Candidatou-se')"
        }
        tooltip={"Remove visualmente as vagas marcadas como 'Candidatou-se'."}
      />

      <Checkbox
        onChange={(checked) =>
          handleFeedCheckbox(
            checked,
            "remove-promoted-jobs",
            setShouldRemovePromoted
          )
        }
        checked={shouldRemovePromoted}
        id={"remove-promoted-jobs"}
        label={"Remover vagas com selo 'promovida'"}
        tooltip={"Remove visualmente as vagas com o selo 'promovida'."}
      />

      
      <Dropdown
        label="Limite de Tempo de Busca"
        options={[
          { value: "30m", label: "30 minutos" },
          { value: "1h", label: "1 hora" },
          { value: "5h", label: "5 horas" },
          { value: "12h", label: "12 horas" },
          { value: "24h", label: "24 horas" },
          { value: "36h", label: "36 horas" },
          { value: "48h", label: "48 horas" },
          { value: "4d", label: "4 dias" },
          { value: "7d", label: "7 dias" },
      ]} onChange={(val) => console.log(val)} />

      {/* <Checkbox
        onChange={(checked) => handleFeedCheckbox(checked, "auto-apply", setShouldAutoApply)}
        id={"auto-apply"}
        label={'Aplicar automaticamente para vagas com Candidatura Simplificada.'}
        tooltip={'Isso vai aplicar automaticamente para vagas com Candidatura Simplificada.'} checked={shouldAutoApplyJob}/> */}

      <div className="form-container">
        <Input
          onChange={(newValue) => setDomainValue(newValue)}
          label=" "
          placeholder=" Escreva aqui qual site (domínio) você não quer ver | Exemplo: Site.com"
          value={domain}
        />
        <Button onClick={handleAddDomain}>
          <>
            <TbWorldX width={50} className="icon" />
            Adicionar Domínio
          </>
        </Button>
      </div>

      <div className="form-container">
        <Input
          onChange={(val) => setCompanyValue(val)}
          label=" "
          placeholder="Escreva aqui qual empresa você não quer ver | Exemplo: Empresa"
          value={company}
        />
        <Button onClick={handleAddCompany}>
          <>
            <FaBuilding width={50} className="icon" />
            Adicionar Empresa
          </>
        </Button>
      </div>
    </div>
  )
}

export const TabJobs = () => {
  const tabData = [
    { id: "tab1", label: "Ajustes", content: <AdjustmentTab /> },
    {
      id: "tab2",
      label: "Domínios",
      content: <FilterList type={"domain"} />
    },
    {
      id: "tab3",
      label: "Empresas",
      content: <FilterList type={"company"} />
    },
    {
      id: "tab4",
      label: "Pesquisas",
      content: <FilterList type={"searches"} />
    }
  ]

  return (
    <div className="tabjobs">
      <Tabs tabs={tabData} />
    </div>
  )
}
