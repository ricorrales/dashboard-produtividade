/**
 * Dashboard de Produtividade - Sistema de Gráficos Simplificado
 * Versão corrigida para evitar conflitos de inicialização
 */

// Aguardar Chart.js carregar
function waitForChartJS(callback) {
    let attempts = 0;
    const maxAttempts = 50;
    
    function check() {
        attempts++;
        if (typeof Chart !== 'undefined') {
            console.log('✅ Chart.js pronto! Versão:', Chart.version);
            callback();
        } else if (attempts < maxAttempts) {
            setTimeout(check, 200);
        } else {
            console.error('❌ Chart.js não carregou após', maxAttempts, 'tentativas');
        }
    }
    
    check();
}

// Classe principal dos gráficos
class ProductivityCharts {
    constructor(dashboard) {
        this.dashboard = dashboard;
        this.charts = {};
        this.colors = {
            primary: '#6366f1',
            secondary: '#8b5cf6',
            success: '#10b981',
            warning: '#f59e0b',
            danger: '#ef4444'
        };
        
        this.init();
    }

    init() {
        console.log('🔄 Criando gráficos...');
        this.createAllCharts();
        this.setupResizeHandler();
        console.log('📊 Sistema de gráficos inicializado!');
    }

    createAllCharts() {
        try {
            this.createProductivityChart();
            this.createTaskCompletionChart();
            this.createWeeklyProgressChart();
            this.createCategoryDistributionChart();
            
            console.log('✅ Todos os gráficos criados com sucesso!');
            console.log('📊 Total de gráficos criados:', Object.keys(this.charts).length);
        } catch (error) {
            console.error('❌ Erro ao criar gráficos:', error);
        }
    }

    createProductivityChart() {
        const ctx = document.getElementById('productivity-chart');
        if (!ctx) return;

        console.log('📊 Criando gráfico de produtividade com dados:', this.getProductivityData());

        this.charts.productivity = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.getLast7Days(),
                datasets: [{
                    label: 'Tarefas Completadas',
                    data: this.getProductivityData(),
                    borderColor: this.colors.primary,
                    backgroundColor: this.colors.primary + '20',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { labels: { color: '#f8fafc' } }
                },
                scales: {
                    x: { ticks: { color: '#f8fafc' } },
                    y: { ticks: { color: '#f8fafc' } }
                }
            }
        });
    }

    createTaskCompletionChart() {
        const ctx = document.getElementById('time-distribution-chart');
        if (!ctx) return;

        this.charts.taskCompletion = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Trabalho', 'Pessoal', 'Estudo', 'Saúde'],
                datasets: [{
                    label: 'Tarefas por Categoria',
                    data: this.getTaskCompletionData(),
                    backgroundColor: [
                        this.colors.primary,
                        this.colors.secondary,
                        this.colors.success,
                        this.colors.warning
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { labels: { color: '#f8fafc' } }
                },
                scales: {
                    x: { ticks: { color: '#f8fafc' } },
                    y: { ticks: { color: '#f8fafc' } }
                }
            }
        });
    }

    createWeeklyProgressChart() {
        const ctx = document.getElementById('monthly-progress-chart');
        if (!ctx) return;

        this.charts.weeklyProgress = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Concluídas', 'Pendentes'],
                datasets: [{
                    data: this.getWeeklyProgressData(),
                    backgroundColor: [this.colors.success, this.colors.danger]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { labels: { color: '#f8fafc' } }
                }
            }
        });
    }

    createCategoryDistributionChart() {
        const ctx = document.getElementById('task-categories-chart');
        if (!ctx) return;

        this.charts.categoryDistribution = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Trabalho', 'Pessoal', 'Estudo', 'Saúde'],
                datasets: [{
                    label: 'Distribuição por Categoria',
                    data: this.getCategoryDistributionData(),
                    borderColor: this.colors.primary,
                    backgroundColor: this.colors.primary + '30'
                }]
            },
            options: {
                responsive: true,
                scales: {
                    r: {
                        ticks: { color: '#f8fafc' },
                        grid: { color: '#374151' },
                        pointLabels: { color: '#f8fafc' }
                    }
                },
                plugins: {
                    legend: { labels: { color: '#f8fafc' } }
                }
            }
        });
    }

    // Métodos de dados
    getLast7Days() {
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            days.push(date.toLocaleDateString('pt-BR', { weekday: 'short' }));
        }
        return days;
    }

    getProductivityData() {
        // Dados de exemplo - em produção viria do dashboard
        return [5, 8, 6, 12, 9, 7, 10];
    }

    getTaskCompletionData() {
        const categories = ['trabalho', 'pessoal', 'estudo', 'saude'];
        return categories.map(cat => 
            this.dashboard.tasks.filter(task => 
                task.category === cat && task.completed
            ).length
        );
    }

    getWeeklyProgressData() {
        const completed = this.dashboard.tasks.filter(task => task.completed).length;
        const pending = this.dashboard.tasks.length - completed;
        return [completed, pending];
    }

    getCategoryDistributionData() {
        return this.getTaskCompletionData();
    }

    updateAllCharts() {
        console.log('🔄 Atualizando dados dos gráficos...');
        Object.keys(this.charts).forEach(chartKey => {
            this.updateChart(chartKey);
        });
        console.log('📊 Gráficos atualizados com sucesso!');
    }

    updateChart(chartKey) {
        const chart = this.charts[chartKey];
        if (!chart) return;

        // Atualizar dados específicos por tipo de gráfico
        switch(chartKey) {
            case 'productivity':
                chart.data.datasets[0].data = this.getProductivityData();
                break;
            case 'taskCompletion':
                chart.data.datasets[0].data = this.getTaskCompletionData();
                break;
            case 'weeklyProgress':
                chart.data.datasets[0].data = this.getWeeklyProgressData();
                break;
            case 'categoryDistribution':
                chart.data.datasets[0].data = this.getCategoryDistributionData();
                break;
        }
        
        chart.update();
    }

    setupResizeHandler() {
        window.addEventListener('resize', () => {
            Object.values(this.charts).forEach(chart => {
                if (chart && typeof chart.resize === 'function') {
                    chart.resize();
                }
            });
        });
    }
}

// Disponibilizar no escopo global para diagnósticos e uso externo
window.ProductivityCharts = window.ProductivityCharts || ProductivityCharts;

// Função única de inicialização
function initializeCharts() {
    // Verificar se já foi inicializado
    if (window.dashboard && window.dashboard.charts) {
        console.log('⚠️ Gráficos já inicializados');
        return;
    }

    // Verificar dependências
    if (!window.dashboard) {
        console.log('⏳ Aguardando dashboard...');
        setTimeout(initializeCharts, 500);
        return;
    }

    if (typeof Chart === 'undefined') {
        console.log('⏳ Aguardando Chart.js...');
        waitForChartJS(initializeCharts);
        return;
    }

    try {
        console.log('🚀 Inicializando sistema de gráficos único...');
        
        // Adicionar dados de teste se necessário
        if (window.dashboard.tasks.length === 0 && typeof window.addTestData === 'function') {
            console.log('📊 Adicionando dados de teste...');
            window.addTestData();
        }
        
        // Inicializar gráficos
        window.dashboard.charts = new ProductivityCharts(window.dashboard);
        console.log('✅ Sistema de gráficos inicializado com sucesso!');
        
    } catch (error) {
        console.error('❌ Erro ao inicializar gráficos:', error);
    }
}

// Inicialização quando DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initializeCharts, 1500);
    });
} else {
    setTimeout(initializeCharts, 1500);
}

// Comandos de desenvolvimento
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.updateCharts = () => {
        if (window.dashboard?.charts) {
            window.dashboard.charts.updateAllCharts();
        } else {
            console.warn('Sistema de gráficos não inicializado.');
        }
    };
    
    window.debugCharts = () => {
        console.log('🔍 Debug dos gráficos:');
        console.log('📊 Dashboard:', !!window.dashboard);
        console.log('📈 Chart.js:', typeof Chart);
        console.log('📋 Gráficos:', window.dashboard?.charts ? Object.keys(window.dashboard.charts.charts) : 'N/A');
        console.log('📊 Tarefas:', window.dashboard?.tasks?.length || 0);
    };
}