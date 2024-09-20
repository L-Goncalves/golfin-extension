import { Checkbox } from "~components/Checkbox/Checkbox"

import "./TabJobs.scss"

import Tabs from "~components/Tabs/Tabs"
import { Input } from "~components/Input/Input"
import { DomainList } from "~components/domainList/domainList"

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

const TabContent = () => {



  return (
    <div>
   
      Opções:
      <Checkbox
        id={"show-icons"}
        label={
          "Mostrar Icones dos Links Externos e para onde estão me levando!"
        }
        tooltip={"Será exibido um Icone do site assim como nome ao lado da vaga."}
      />
      <Checkbox
        id={"save-searches"}
        label={"Salvar pesquisas e queries do campo de busca"}
        tooltip={
          "Isso vai salvar as suas pesquisas enquanto você navega no LinkedIn, assim não vai precisar procurar no histórico."
        }
      />

      <Input label="Escreva aqui qual site (domínio) você não quer ver:" placeholder="exemplo: site.com"/>
    
    </div>
  )
}



export const TabJobs = () => {
  const tabData = [
    { id: "tab1", label: "Ajustes", content: <TabContent /> },
    {
      id: "tab2",
      label: "Lista de Domínios",
      content: <DomainList/>
    },
    {
      id: "tab3",
      label: "Lista de Queries ou Textos",
      content: <div>Content for Tab 3</div>
    }
  ]

  return (
    <div className="tabjobs">
      <Tabs tabs={tabData} />
    </div>
  )
}
