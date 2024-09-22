import { Checkbox } from "~components/Checkbox/Checkbox"
import "./TabJobs.scss"
import { useEffect, useState } from "react"
import { Button } from "~components/Button/Button"
import { FilterList } from "~components/FilterList/FilterList"
import { Input } from "~components/Input/Input"
import Tabs from "~components/Tabs/Tabs"
import { Storage } from "@plasmohq/storage"
import { shouldDisplayIcons, shouldFilterByCompany, shouldFilterByDomain, shouldSaveJobSearch } from "~contentScripts/storage"
import { FaBuilding } from "react-icons/fa6";
import { TbWorldX } from "react-icons/tb";



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
  const [domain, setDomainValue] = useState("");
  const [company, setCompanyValue] = useState("");
  const [domains, setDomains] = useState<string[]>([]); // Ensure it's typed as an array
  const [companies, setCompanies] = useState<string[]>([]); // State for companies
  const [shouldShowIcons, setShowIcons] = useState<boolean>(false)
  const [shouldFilterCompany, setShouldFilterByCompany] = useState<boolean>(false)
  const [saveJobSearch, setSaveJobSearch] = useState<boolean>(false)
  const [shouldFilterDomains, setShouldFilterByDomain] = useState<boolean>(false)
  const storage = new Storage();


  const handleFeedCheckbox = async (checked: boolean, key: string, stateFunc: any) => {
    const storage = new Storage();
    stateFunc(checked);

    await storage.set(key, checked) // Save the checkbox state in storage
  }

  useEffect(() => {
    const fetchInitialState = async () => {
      const storedCompanies: any = (await storage.get("companies")) || []; // Fallback to an empty array
      const shouldFilterCompany = await shouldFilterByCompany()
      const saveJobSearch = await shouldSaveJobSearch()
      const storedDomains: any = (await storage.get("domains")) || []; // Fallback to an empty array
      const filterByDomain =  await shouldFilterByDomain()
      const showIcons = await shouldDisplayIcons();
      setSaveJobSearch(saveJobSearch);
      setCompanies(storedCompanies);
      setDomains(storedDomains);
      setShowIcons(showIcons);
      setShouldFilterByCompany(shouldFilterCompany);
      setShouldFilterByDomain(filterByDomain);
    }

    fetchInitialState()
  }, [])



  const handleAddDomain = async () => {
    if(domain.length > 0){
      const updatedDomains = [...domains, domain];
      setDomains(updatedDomains); // Update local state
      setDomainValue(""); // Reset the input value
  
      // Save the updated list to storage
      await storage.set("domains", updatedDomains);
    }
   
  };

  const handleAddCompany = async () => {
    if(company.length > 0){
      const updatedCompanies = [...companies, company];
      setCompanies(updatedCompanies); // Update local state
      setCompanyValue(""); // Reset the input value
  
      // Save the updated list to storage
      await storage.set("companies", updatedCompanies);
    }
  
  };

  return (
    <div className="adjustments-tab">
      <h3>Opções: </h3>
      <Checkbox
        onChange={(checked) => handleFeedCheckbox(checked, "shouldShowIcons", setShowIcons)}
        checked={shouldShowIcons}
        id={"show-icons"}
        label={"Mostrar Icones dos Links Externos e para onde estão me levando!"}
        tooltip={"Será exibido um Icone do site assim como nome ao lado da vaga."}    />
      <Checkbox
        onChange={(checked) => handleFeedCheckbox(checked, "saveJobSearch", setSaveJobSearch)}
        checked={saveJobSearch}
        id={"save-job-searchs"}
        label={"Salvar pesquisas e queries do campo de busca"}
        tooltip={"Isso vai salvar as suas pesquisas enquanto você navega no LinkedIn, assim não vai precisar procurar no histórico."}   />
      <Checkbox
        onChange={(checked) => handleFeedCheckbox(checked, "filterJobsByDomain", setShouldFilterByDomain)}
        checked={shouldFilterDomains}
        id={"filter-by-domain"}
        label={"Filtrar vagas por domínios"}
        tooltip={'Isso vai filtrar as vagas visualmente baseado no que você tiver na "Lista de Domínios"'}      />
      
      <Checkbox
        onChange={(checked) => handleFeedCheckbox(checked, "shouldFilterByCompany", setShouldFilterByCompany)}
        id={"filter-by-names"}
        label={"Filtrar vagas por nomes de empresas"}
        tooltip={'Isso vai filtrar as vagas visualmente baseado no que você tiver na "Lista de Domínios"'} checked={shouldFilterCompany}      />

      <div className="form-container">
        <Input
          onChange={(newValue) => setDomainValue(newValue)}
          label=" "
          placeholder=" Escreva aqui qual site (domínio) você não quer ver | Exemplo: Site.com"
          value={domain}
        />
        <Button onClick={handleAddDomain} >
        <><TbWorldX  width={50} className="icon"/>
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
         <><FaBuilding width={50} className="icon"/>
         Adicionar Empresa
         </> 
        </Button>
      </div>
    </div>
  );
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
      content: <FilterList type={"searches"}/>
    }
  ];

  return (
    <div className="tabjobs">
      <Tabs tabs={tabData} />
    </div>
  );
}
