import OpenAI from "openai";


export async function fetchOpenAIResponse(curriculum, question){
    let apiKey;
    const yearsOfExperience = 2
    const cityILive = 'Taboão da Serra'
    const stateILive = 'São Paulo'
    const country = 'Brazil'

    const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
    const prompt = `Com base no seguinte currículo, a resposta deve ser gere uma resposta adequada para a pergunta,
    se estiver perguntando questão númerica responda um número inteiro
    e não pode ser maior que o tempo de experiência desse curriculo pois não devemos mentir.


    se não estiver presente em nosso currículo, não responda com informação falsa.

    Se a pergunta for de quanto tempo de experiência com algo, apenas diga o número inteiro na resposta, sem passar da experiência máxima de ${yearsOfExperience} anos.

    E o matching de palavras-chaves deve ser estrito, isso significa que por exemplo:
    Java não é Javascript então não devemos responder como se fosse a mesma coisa.
    Se não souber responder apenas responda: Null para perguntas de String e para perguntas que perguntam quantidade de tempo se não souber responder apenas responda com 0.

    Localização mencionada: ${cityILive} ou ${stateILive} como estado e/ou país: ${country}
    ou estados de países ou até mesmo bairros também pode ser usada para todo tipo de pergunta assim como Cidadania.

    Então se for perguntado por exemplo: Que cidade ou país ou localização reside atualmente? Devemos responder com qualquer localidade mencionada no currículo que foi passado, no verbo correto, se somos brasileiros por exemplo, devemos mencionar Brasil, se tiver algum estado do país no currículo devemos mencionar o estado como prioridade
    \nTambém se a pergunta incluir alguma  se for localização responda a localização.
    \nTambém responda no idioma da pergunta, sem erros do idioma.



    Se for expectativa salarial responda apenas números inteiros:\n\n
    
    Perguntas do tipo: Porque você quer trabalhar aqui? devem ser respondidas de forma criativa e de forma breve menos que 70 caracteres.
    \n
    Currículo:\n${curriculum}\n\n
    Pergunta: ${question}
    

    Resposta:`;

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "user", content: prompt }
            ]
        });

        return completion.choices[0].message.content.trim();
    } catch (error) {
        console.error('Erro ao gerar resposta:', error);
        return null;
    }
}