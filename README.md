# 🏥 CAPS - Sistema de Gestão para Atenção Psicossocial

![Angular](https://img.shields.io/badge/Angular-19-DD0031?style=for-the-badge&logo=angular)
![Cypress](https://img.shields.io/badge/Cypress-E2E-17202C?style=for-the-badge&logo=cypress)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript)

O **Projeto CAPS** é uma plataforma desenvolvida para otimizar a gestão administrativa e clínica de Centros de Atenção Psicossocial. O sistema foca em usabilidade, agilidade no registro de atendimentos e conformidade com documentos obrigatórios do SUS.

---

## ✨ Funcionalidades Principais

### 📋 Gestão de Pacientes
- **Listagem Inteligente:** Tabela dinâmica com cálculo automático de idade e visualização clara de endereços.
- **Ações Rápidas:** Botões de ação (Editar, Excluir, Gerar RAAS) representados por ícones com **Tooltips interativos** para uma interface mais limpa.
- **Responsividade:** Layout adaptável para facilitar o uso em diferentes dispositivos da unidade de saúde.

### 🧭 Navegação & Interface
- **Header Dinâmico:** Atalho rápido para o Dashboard através da Logo e menu lateral estilo "gaveta".
- **Área do Usuário:** Ícones intuitivos de Perfil e Logout integrados ao design moderno utilizando *Material Icons*.
- **Identidade Visual:** Paleta de cores baseada em tons de verde hospitalar (`#00796b`), transmitindo confiança e calma.

### 📄 Documentação Técnica
- Fluxo preparado para geração de **RAAS** (Registro de Ações Ambulatoriais de Saúde).
- Módulos de Anamnese Infantil, Evolução e Relatórios.

---

## 🛠️ Tecnologias Utilizadas

- **Core:** Angular 19.2.x Angular 19 - TypeScript - HTML5 - CSS3 - Flexbox / Grid -
- **Estilização:** CSS3 (Flexbox/Grid) + BEM Methodology
- **Ícones:** Google Material Icons
- **Testes:** Cypress (End-to-End)

---

ARQUITETURA DO PROJETO

src ├── app │ ├── components │ │ ├── header │ │ ├── sidebar │ │ └──
shared │ │ │ ├── pages │ │ ├── dashboard │ │ ├── pacientes │ │ ├──
anamnese │ │ └── relatorios │ │ │ ├── services │ ├── models │ └── guards
│ ├── assets └── environments


## 🚀 Como Rodar o Projeto

### Pré-requisitos
Antes de começar, você vai precisar ter instalado em sua máquina:
[Node.js](https://nodejs.org/en/) e o [Angular CLI](https://angular.io/cli).

### Instalação

BACKEND
1. Clone o repositório:
   ```bash
   git clone [https://codeberg.org/seuusuario_codeberg/caps-project.git]

2. Entre na pasta do projeto:
    ```bash
    cd caps-project

3. Instale as dependências:
    ```bash
    java install

4. Rodar o projeto:
    ```bash
    run project java
Deploy api spring boot

FRONTEND
1. Clone o repositório:
   ```bash
   git clone [https://codeberg.org/seuusuario_codeberg/caps-project-front.git]

2. Entre na pasta do projeto:
    ```bash
    cd caps-frontend

3. Instale as dependências:
    ```bash
    npm install

4. Rodar o projeto:
    ```bash
    ng serve
Abrir no navegador: http://localhost:4200

### TESTES AUTOMATIZADOS

Testes End-to-End (Cypress)

1. Abrir interface gráfica:
  ```bash
  npx cypress open

````

2. Rodar no terminal:

```bash
  npx cypress run

  ````
### SEGURANÇA E LGPD

Este sistema pode manipular dados sensíveis de pacientes. Portanto,
recomenda-se:

-   Controle de acesso
-   Registro de auditoria
-   Proteção de dados pessoais
-   Conformidade com a LGPD

------------------------------------------------------------------------

### ROADMAP

-   Autenticação com JWT
-   Controle de permissões por perfil
-   Dashboard com indicadores
-   Exportação de relatórios em PDF
-   Dark Mode

------------------------------------------------------------------------

AUTOR

Alexsander Araujo Desenvolvedor