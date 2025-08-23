import { Checkbox } from "~components/Checkbox/Checkbox"

import "./TabJobs.scss"

import { useEffect, useState, useMemo } from "react"
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
import { useTranslation } from "~hooks/useTranslation"

const TabJobHeader = () => {
  const { t } = useTranslation()
  return (
    <>
      <h2>{t("tabjobs.h2")}</h2>
      <p>
        {t("tabjobs.paragraph")}
        <br />
        <br />
        <span>
          {t("tabjobs.reminder")}
        </span>
      </p>
    </>
  )
}

const AdjustmentTab = () => {
  const { t } = useTranslation()
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

  const timeOptions = useMemo(() => [
    { value: "30m", label: t("time_options.30m") },
    { value: "1h", label: t("time_options.1h") },
    { value: "5h", label: t("time_options.5h") },
    { value: "12h", label: t("time_options.12h") },
    { value: "24h", label: t("time_options.24h") },
    { value: "36h", label: t("time_options.36h") },
    { value: "48h", label: t("time_options.48h") },
    { value: "4d", label: t("time_options.4d") },
    { value: "7d", label: t("time_options.7d") }
  ], [t])


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
      <h3>{t("tabjobs.adjustments.title")}</h3>
      <div className="tips">
        {t("tabjobs.adjustments.tips")}
        <a
          href="https://www.linkedin.com/jobs/collections/"
          target="_blank"
          rel="noopener noreferrer">
          linkedin.com/jobs/collections
        </a>
        {t("tabjobs.adjustments.navigate_tip")}
      </div>
      <Checkbox
        onChange={(checked) =>
          handleFeedCheckbox(checked, "shouldShowIcons", setShowIcons)
        }
        checked={shouldShowIcons}
        id={"show-icons"}
        label={t("tabjobs.adjustments.show_icons")}
        tooltip={t("tabjobs.adjustments.show_icons_tooltip")}
      />

      <Checkbox
        onChange={(checked) =>
          handleFeedCheckbox(checked, "saveJobSearch", setSaveJobSearch)
        }
        checked={saveJobSearch}
        id={"save-job-search"}
        label={t("tabjobs.adjustments.save_searches")}
        tooltip={t("tabjobs.adjustments.save_searches_tooltip")}
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
        label={t("tabjobs.adjustments.filter_domains")}
        tooltip={t("tabjobs.adjustments.filter_domains_tooltip")}
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
        label={t("tabjobs.adjustments.filter_companies")}
        tooltip={t("tabjobs.adjustments.filter_companies_tooltip")}
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
        label={t("tabjobs.adjustments.remove_applied")}
        tooltip={t("tabjobs.adjustments.remove_applied_tooltip")}
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
        label={t("tabjobs.adjustments.remove_promoted")}
        tooltip={t("tabjobs.adjustments.remove_promoted_tooltip")}
      />

      <Dropdown
        label={t("tabjobs.adjustments.time_limit_label")}
        options={timeOptions}
        onChange={(val) => console.log(val)}
      />


      {/* <Checkbox
        onChange={(checked) => handleFeedCheckbox(checked, "auto-apply", setShouldAutoApply)}
        id={"auto-apply"}
        label={'Aplicar automaticamente para vagas com Candidatura Simplificada.'}
        tooltip={'Isso vai aplicar automaticamente para vagas com Candidatura Simplificada.'} checked={shouldAutoApplyJob}/> */}

      <div className="form-container">
        <Input
          onChange={(newValue) => setDomainValue(newValue)}
          label=" "
          placeholder={t("tabjobs.adjustments.domain_placeholder")}
          value={domain}
        />
        <Button onClick={handleAddDomain}>
          <>
            <TbWorldX width={50} className="icon" />
            {t("tabjobs.adjustments.add_domain")}
          </>
        </Button>
      </div>

      <div className="form-container">
        <Input
          onChange={(val) => setCompanyValue(val)}
          label=" "
          placeholder={t("tabjobs.adjustments.company_placeholder")}
          value={company}
        />
        <Button onClick={handleAddCompany}>
          <>
            <FaBuilding width={50} className="icon" />
            {t("tabjobs.adjustments.add_company")}
          </>
        </Button>
      </div>
    </div>
  )
}

export const TabJobs = () => {
  const { t } = useTranslation()
  const tabData = [
    { id: "tab1", label: t("tabjobs.tabs.adjustments"), content: <AdjustmentTab /> },
    {
      id: "tab2",
      label: t("tabjobs.tabs.domains"),
      content: <FilterList type={"domain"} />
    },
    {
      id: "tab3",
      label: t("tabjobs.tabs.companies"),
      content: <FilterList type={"company"} />
    },
    {
      id: "tab4",
      label: t("tabjobs.tabs.searches"),
      content: <FilterList type={"searches"} />
    }
  ]

  return (
    <div className="tabjobs">
      <Tabs tabs={tabData} />
    </div>
  )
}
