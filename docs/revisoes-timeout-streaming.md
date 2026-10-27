# Revisões interrompidas no limite do Cloud Run

## Causa confirmada

Treze gerações de revisão terminaram entre 299,8 e 300,1 segundos, enquanto o serviço estava configurado para encerrar requisições em 300 segundos. O cabeçalho HTTP 200 do streaming já havia sido enviado; por isso o status externo não comprovava a conclusão do material. Os logs internos registravam erro ao acessar `model` em um resultado ausente após o fechamento da conexão.

O timeout de requisição do Cloud Run foi ajustado para 900 segundos. Esse é o limite total da conexão; o limite de inatividade da IA continua separado e não foi aumentado. Configurações de modelos, segredos e tráfego etiquetado foram preservadas.

## Correção do servidor

- O fechamento prematuro da resposta agora aborta um sinal propagado ao provedor. Antes se chamava `return()` em um gerador, o que não interrompe uma chamada `next()` pendente.
- O serviço combina o cancelamento externo com seu timeout de inatividade, verifica o sinal antes de concluir e não cria cache parcial.
- O servidor não escreve eventos nem acessa um resultado inexistente após a desconexão. Cancelamentos são registrados com status interno 499, sem serem promovidos a geração concluída.
- Um provedor que termina sem resultado produz erro controlado, preservando o rascunho existente na tela.
- A identificação da requisição também é enviada no cabeçalho `X-Request-Id`.

## Operação

Para manter o limite em uma implantação futura:

```sh
gcloud run services update my-app-git --region=southamerica-east1 --timeout=900
```

A correção do servidor não altera dependências, o cliente nem recursos públicos. A imagem de entrega pode reutilizar a imagem de produção por digest e substituir somente o bundle do servidor compilado a partir deste código. Isso preserva o ambiente de execução, a interface e os recursos da revisão publicada. O bundle e o mapa são produzidos pelo mesmo comando de build do projeto.

## Validação

Regressões cobrem cancelamento HTTP real durante uma espera do provedor, propagação do sinal, ausência de cache parcial, conclusão ausente e duração total maior que a janela de inatividade enquanto trechos continuam chegando. Os testes de cancelamento falhavam antes da correção e passaram depois dela. Os testes anteriores de SSE comprimido, resposta JSON e mensagens de erro continuam aplicáveis.

Não são incluídos logs brutos, dados da estudante ou credenciais neste relatório.
