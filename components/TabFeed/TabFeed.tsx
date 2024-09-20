import { Checkbox } from "~components/Checkbox/Checkbox"

import "./TabFeed.scss"

export const TabFeed = () => {
  return (
    <div className="tabfeed">
      <h2>Feed</h2>

      <p>
        Olá!😁 Essa seção é dedicada a melhorar o seu Feed! Aqui você pode
        filtrar o que você quer ver, ou não ver absolutamente nada para momentos
        de foco!
      </p>
      <div>
        Opções:
        <Checkbox
          id={"remove-all-postings"}
          label={"Remover todas as postagens "}
          tooltip={"Otimo pra você que é viciado no LinkedIn🤣"}
        />
        <Checkbox
          id={"remove-posting-by-words"}
          label={"Remover Postagens com palavras-chaves "}
          tooltip={"Vai limpar o seu feed para que você não se distraia🧠"}
        />
        <div className="textarea-container">
          <textarea
            id="comments"
            rows={4}
            cols={50}
            placeholder="Escreva suas palavras-chaves aqui. ( SEPARADO POR VÍRGULA )"></textarea>
        </div>
      </div>
    </div>
  )
}
