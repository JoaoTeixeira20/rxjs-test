
# Form Engine v3


## Motivações

- Simplificar uso do form engine
- Diminuir a curva de aprendizagem
- Mais conhecimento sobre a estrutura
- Correção de bugs do core atual

## Pros:
- Schema simplificado
- Schema dinamico por usar Map ao inves de objeto
- Compatibilidade com versões mais atuais do node e do next
- Documentação arquitetural mais simplificada
- Time mais bem capacitado para resolver issues
- Algoritmo para converter schema legacy para o atual
- Melhor observabilidade entre react state e dom
- Por usar rxjs como core de eventos, permite ter uma maior abrangência na correção de bugs e documentação
- Redução do bundle de compilação
- Correção da forma como é construido a máscara, permitindo utilizar formatter para remove-la ao capturar o valor
- Simplificação do código do asFormField e useForm
- Melhora no desempenho

## Contras:
- Aumento de dependências
- Migração 
