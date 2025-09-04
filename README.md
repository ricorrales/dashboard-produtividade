# 🚀 Dashboard de Produtividade

Dashboard pessoal de produtividade com métricas, gráficos interativos e sistema de gerenciamento de tarefas.

## ✨ Características

- 📊 **Métricas em Tempo Real**: Acompanhe sua produtividade diária
- 📈 **Gráficos Interativos**: 4 tipos de visualizações com Chart.js
- ✅ **Sistema de Tarefas**: CRUD completo com prioridades e categorias
- ⏱️ **Timer de Trabalho**: Controle de sessões produtivas
- 🎨 **Interface Moderna**: Tema escuro com glassmorphism
- 📱 **Design Responsivo**: Mobile-first para todos os dispositivos
- 🎭 **Animações CSS**: Transições suaves e efeitos visuais
- 💾 **Persistência Local**: Dados salvos automaticamente

## 🛠️ Tecnologias

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Gráficos**: Chart.js 4.4.0
- **Ícones**: Font Awesome 6.4.0
- **Fontes**: Google Fonts (Inter)
- **Design**: Glassmorphism, CSS Grid, Flexbox

## 🚀 Instalação e Uso

### Pré-requisitos
- Navegador moderno (Chrome, Firefox, Safari, Edge)
- Conexão com internet (para CDNs)

### Setup Local
```bash
# Clone o repositório
git clone https://github.com/ricorrales/dashboard-produtividade.git

# Navegue para o diretório
cd dashboard-produtividade

# Abra no navegador
start index.html  # Windows
open index.html   # macOS
xdg-open index.html  # Linux
```

### Uso Online
Acesse diretamente: [GitHub Pages](https://ricorrales.github.io/dashboard-produtividade/)

## 📊 Funcionalidades

### Dashboard Principal
- **Métricas de Hoje**: Tarefas completadas, horas produtivas, metas atingidas
- **Relógio em Tempo Real**: Data e hora atualizadas automaticamente
- **Botão de Atualização**: Refresh manual dos dados

### Sistema de Gráficos
1. **Produtividade Semanal**: Linha temporal de performance
2. **Tarefas Completadas**: Distribuição por período
3. **Progresso Semanal**: Doughnut chart de metas
4. **Distribuição por Categoria**: Radar chart de tipos de tarefas

### Gerenciamento de Tarefas
- **CRUD Completo**: Criar, ler, atualizar, deletar
- **Prioridades**: Baixa (verde), Média (amarelo), Alta (vermelha)
- **Categorias**: Trabalho, Pessoal, Estudo, Saúde
- **Filtros**: Todas, Pendentes, Concluídas, Urgentes
- **Deadlines**: Controle de prazos e notificações

### Timer de Trabalho
- **Sessões Produtivas**: Start/Stop com histórico
- **Métricas**: Tempo total, sessões diárias
- **Integração**: Atualização automática de métricas

## 🎨 Design System

### Cores
- **Primária**: #6366f1 (Indigo)
- **Secundária**: #8b5cf6 (Violet)
- **Sucesso**: #10b981 (Emerald)
- **Aviso**: #f59e0b (Amber)
- **Perigo**: #ef4444 (Red)

### Glassmorphism
- **Backdrop Filter**: blur(20px)
- **Transparências**: rgba com opacidade controlada
- **Bordas**: 1px com cores semi-transparentes

### Animações
- **Entrada**: fadeInUp com delays escalonados
- **Hover**: transform scale e translateY
- **Transições**: 0.3s ease-in-out
- **Efeitos**: Shimmer para botões interativos

## 🔧 Comandos de Desenvolvimento

### Console do Navegador (F12)
```javascript
// Adicionar dados de teste
addTestData()

// Atualizar gráficos
updateCharts()

// Exportar todos os gráficos
exportAllCharts()

// Ver relatório de produtividade
window.dashboard.showProductivityReport()

// Exportar dados
window.dashboard.exportData()

// Limpar dados
window.dashboard.clearStorage()
```

### Verificar Status
```javascript
// Dependências
console.log('Chart.js:', typeof Chart)
console.log('Dashboard:', typeof window.dashboard)
console.log('Charts:', typeof window.dashboard?.charts)

// Métricas
console.log('Métricas:', window.dashboard.metrics)
console.log('Tarefas:', window.dashboard.tasks)
```

## 📁 Estrutura do Projeto

```
dashboard-produtividade/
├── index.html              # Página principal
├── css/
│   └── style.css          # Estilos e animações
├── js/
│   ├── app.js             # Lógica principal do dashboard
│   └── charts.js          # Sistema de gráficos Chart.js
├── data/
│   └── tasks.json         # Dados de exemplo e estrutura
├── assets/                 # Recursos estáticos
├── test.html              # Página de teste para debug
└── README.md              # Esta documentação
```

## 🚀 Roadmap

### ✅ Implementado
- [x] Dashboard principal funcional
- [x] Sistema de gráficos integrado
- [x] CRUD de tarefas completo
- [x] Timer de trabalho
- [x] Animações CSS avançadas
- [x] Design responsivo
- [x] Persistência local

### 🔄 Em Desenvolvimento
- [ ] Lazy loading para gráficos
- [ ] Melhorias de acessibilidade
- [ ] Refatoração de arquitetura

### 📋 Planejado
- [ ] PWA (Progressive Web App)
- [ ] Sincronização em nuvem
- [ ] Notificações push
- [ ] Temas personalizáveis
- [ ] Exportação avançada
- [ ] Integração com APIs externas

## 🐛 Troubleshooting

### Problemas Comuns

#### Gráficos não carregam
```javascript
// Verificar dependências
console.log('Chart.js:', typeof Chart)
console.log('Dashboard:', typeof window.dashboard)

// Forçar atualização
updateCharts()
```

#### Dados não persistem
- Verificar se localStorage está habilitado
- Limpar cache do navegador
- Usar `addTestData()` para dados de exemplo

#### Animações não funcionam
- Verificar se CSS está carregado
- Recarregar página
- Verificar console para erros

## 🤝 Contribuição

1. **Fork** o projeto
2. **Crie** uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. **Abra** um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

**Ricardo** - [@ricorrales](https://github.com/ricorrales)

## 🙏 Agradecimentos

- [Chart.js](https://www.chartjs.org/) - Biblioteca de gráficos
- [Font Awesome](https://fontawesome.com/) - Ícones
- [Google Fonts](https://fonts.google.com/) - Tipografia
- Comunidade open source

---

⭐ **Se este projeto te ajudou, considere dar uma estrela!**