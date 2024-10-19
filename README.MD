### 🛠️ O PROBLEMA

Com a mudança para essa plataforma, os alunos perderam sua marcação de progresso na comunidade (a comunidade anterior não permitia o acesso ao histórico).

O caminho mais simples para resolver isso seria: ir marcando as aulas que já fez manualmente.

Mas nós somos programadores! Temos o poder de criar "robôs" 🤖 para fazer isso por nós, ao invés de ficar horas apertando "Concluir aula".

---

### 💡 A SOLUÇÃO

Criar um script de automação do browser que permita ao aluno marcar como concluídas as aulas de um curso e módulos automaticamente:

1. Aluno escolhe o curso + os módulos;

2. Script começa a marcar como concluído (com delay de 5 segundos por aula).

---

### Como usar a automação

1. Alterar dentro do arquivo config.js os parametros de email e senha na comunidade;

2. No terminal, execute npm install para instalar as dependências;

3. Em seguida, execute o comando node index.js;

4. Selecionar se será marcado o curso todo ou somente um módulo especifico dele;

5. Obtenha o link do curso e o título do módulo que você deseja marcar.

### OBS:
    O título do módulo deve corresponder EXATAMENTE ao que está exibido no site da comunidade, incluindo maiúsculas, minúsculas e espaçamento.
