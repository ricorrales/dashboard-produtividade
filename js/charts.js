/**
 * Sistema de Gráficos Simplificado - Dashboard de Produtividade
 * Versão corrigida que evita problemas de inicialização
 */

// Função simples para verificar se Chart.js está disponível
function isChartJSReady() {
    return typeof Chart !== 'undefined';
}

// Aguardar Chart.js de forma simples
function waitForChartJS(callback, maxTries = 50) {
    let tries = 0;
    
    function check() {
        tries++;
        
        if (isChartJSReady()) {
            console.log('✅ Chart.js pronto! Versão:', Chart.version);
            callback();
        } else if (tries < maxTries) {
            setTimeout(check, 200);
        } else {
            console.error('❌ Chart.js não carregou após', maxTries, 'tentativas');
        }
    }
    
    check();
}

class ProductivityCharts {
    constructor(dashboard) {
        this.dashboard = dashboard;
        this.charts = {};
        this.colors = this.getThemeColors();
        
        console.log('📊 Inicializando sistema de gráficos...');
        this.init();
    }

    init() {
        try {
            this.setupChartDefaults();
            
            // Aguardar um pouco para garantir que o DOM está pronto
            setTimeout(() => {
                this.createAllCharts();
                console.log('✅ Sistema de gráficos inicializado com sucesso!');
            }, 500);
            
        } catch (error) {
            console.error('❌ Erro ao inicializar gráficos:', error);
        }
    }

    setupChartDefaults() {
        // Verificar se Chart.js está disponível
        if (typeof Chart === 'undefined') {
            console.warn('⚠️ Chart.js não encontrado. Gráficos não serão carregados.');
            return;
        }

        // Configurar padrões globais do Chart.js para o tema escuro
        Chart.defaults.font.family = 'Inter, system-ui, sans-serif';
        Chart.defaults.font.size = 12;
        Chart.defaults.color = '#cbd5e1';
        Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.1)';
        Chart.defaults.backgroundColor = 'rgba(99, 102, 241, 0.1)';
        Chart.defaults.scale.grid.color = 'rgba(255, 255, 255, 0.05)';
        Chart.defaults.scale.grid.borderColor = 'rgba(255, 255, 255, 0.1)';
        Chart.defaults.plugins.legend.labels.usePointStyle = true;
        Chart.defaults.plugins.legend.labels.boxWidth = 6;
        Chart.defaults.plugins.legend.labels.boxHeight = 6;
        Chart.defaults.elements.point.radius = 4;
        Chart.defaults.elements.point.hoverRadius = 6;
        Chart.defaults.elements.line.borderWidth = 3;
        Chart.defaults.elements.line.tension = 0.4;
    }

    getThemeColors() {
        return {
            primary: '#6366f1',
            secondary: '#8b5cf6', 
            success: '#10b981',
            warning: '#f59e0b',
            danger: '#ef4444',
            info: '#06b6d4',
            text: '#f8fafc',
            textMuted: '#cbd5e1'
        };
    }

    createAllCharts() {
        // Verificar se Chart.js está disponível
        if (typeof Chart === 'undefined') {
            console.warn('⚠️ Chart.js não carregado. Pulando criação de gráficos.');
            return;
        }

        try {
            console.log('🔄 Criando gráficos...');
            
            // Aguardar um pouco para garantir que o DOM esteja pronto
            setTimeout(() => {
                this.createProductivityChart();
                this.createTaskCompletionChart();
                this.createWeeklyProgressChart();
                this.createCategoryDistributionChart();
                
                console.log('✅ Todos os gráficos criados com sucesso!');
                
                // Verificar se todos os gráficos foram criados
                const chartCount = Object.keys(this.charts).length;
                console.log(`📊 Total de gráficos criados: ${chartCount}`);
                
                // Forçar redraw dos gráficos
                this.updateAllCharts();
            }, 100);
        } catch (error) {
            console.error('❌ Erro ao criar gráficos:', error);
        }
    }

    createProductivityChart() {
        const canvas = document.getElementById('productivity-chart');
        if (!canvas) {
            console.warn('⚠️ Canvas productivity-chart não encontrado');
            return;
        }

        const ctx = canvas.getContext('2d');
        const data = this.getProductivityData();
        
        console.log('📊 Criando gráfico de produtividade com dados:', data);

        const config = {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Sessões de Trabalho',
                    data: data.sessions,
                    borderColor: this.colors.primary,
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: this.colors.textMuted,
                            font: {
                                size: 11
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)'
                        },
                        ticks: {
                            color: this.colors.textMuted,
                            stepSize: 1
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)'
                        },
                        ticks: {
                            color: this.colors.textMuted
                        }
                    }
                }
            }
        };

        this.charts.productivity = new Chart(ctx, config);
    }

    createTaskCompletionChart() {
        const canvas = document.getElementById('time-distribution-chart');
        if (!canvas) {
            console.warn('⚠️ Canvas time-distribution-chart não encontrado');
            return;
        }

        const ctx = canvas.getContext('2d');
        const data = this.getTaskCompletionData();

        const config = {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Tarefas Completadas',
                    data: data.completed,
                    backgroundColor: this.colors.success,
                    borderColor: this.colors.success,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: this.colors.textMuted
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)'
                        },
                        ticks: {
                            color: this.colors.textMuted,
                            stepSize: 1
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: this.colors.textMuted
                        }
                    }
                }
            }
        };

        this.charts.taskCompletion = new Chart(ctx, config);
    }

    createWeeklyProgressChart() {
        const canvas = document.getElementById('monthly-progress-chart');
        if (!canvas) {
            console.warn('⚠️ Canvas monthly-progress-chart não encontrado');
            return;
        }

        const ctx = canvas.getContext('2d');
        const data = this.getWeeklyProgressData();

        const config = {
            type: 'doughnut',
            data: {
                labels: ['Concluídas', 'Pendentes'],
                datasets: [{
                    data: [data.completed, data.pending],
                    backgroundColor: [
                        this.colors.success,
                        this.colors.danger
                    ],
                    borderColor: [
                        this.colors.success,
                        this.colors.danger
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: this.colors.textMuted
                        }
                    }
                }
            }
        };

        this.charts.weeklyProgress = new Chart(ctx, config);
    }

    createCategoryDistributionChart() {
        const canvas = document.getElementById('task-categories-chart');
        if (!canvas) {
            console.warn('⚠️ Canvas task-categories-chart não encontrado');
            return;
        }

        const ctx = canvas.getContext('2d');
        const data = this.getCategoryDistributionData();

        const config = {
            type: 'radar',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Tarefas por Categoria',
                    data: data.total,
                    borderColor: this.colors.primary,
                    backgroundColor: 'rgba(99, 102, 241, 0.2)',
                    pointBackgroundColor: this.colors.primary,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: this.colors.textMuted
                        }
                    }
                },
                scales: {
                    r: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        pointLabels: {
                            color: this.colors.textMuted
                        },
                        ticks: {
                            color: this.colors.textMuted,
                            stepSize: 1
                        }
                    }
                }
            }
        };

        this.charts.categoryDistribution = new Chart(ctx, config);
    }

    // ===== OBTENÇÃO DE DADOS SIMPLIFICADA =====
    getProductivityData() {
        const last7Days = this.getLast7Days();
        const sessions = [];

        last7Days.forEach(date => {
            const daySessionsCount = this.dashboard.workingSessions.filter(session => {
                if (!session.startTime) return false;
                return new Date(session.startTime).toDateString() === date.toDateString();
            }).length || 0;
            sessions.push(daySessionsCount);
        });

        // Se não há dados, usar dados de exemplo
        if (sessions.every(s => s === 0) && tasksCreated.every(t => t === 0)) {
            return {
                labels: last7Days.map(date => {
                    return date.toLocaleDateString('pt-BR', { 
                        weekday: 'short', 
                        day: '2-digit' 
                    });
                }),
                sessions: [3, 5, 2, 4, 6, 3, 4], // Dados de exemplo
                tasksCreated: [2, 4, 1, 3, 5, 2, 3] // Dados de exemplo
            };
        }

        return {
            labels: last7Days.map(date => {
                return date.toLocaleDateString('pt-BR', { 
                    weekday: 'short', 
                    day: '2-digit' 
                });
            }),
            sessions
        };
    }

    getTaskCompletionData() {
        const last7Days = this.getLast7Days();
        const completed = [];

        last7Days.forEach(date => {
            const completedCount = this.dashboard.tasks.filter(task => {
                if (!task.completedAt) return false;
                return new Date(task.completedAt).toDateString() === date.toDateString();
            }).length || 0;
            completed.push(completedCount);
        });

        // Se não há dados, usar dados de exemplo
        if (completed.every(c => c === 0) && created.every(c => c === 0)) {
            return {
                labels: last7Days.map(date => {
                    return date.toLocaleDateString('pt-BR', { 
                        weekday: 'short', 
                        day: '2-digit' 
                    });
                }),
                completed: [1, 3, 0, 2, 4, 1, 2], // Dados de exemplo
                created: [2, 4, 1, 3, 5, 2, 3] // Dados de exemplo
            };
        }

        return {
            labels: last7Days.map(date => {
                return date.toLocaleDateString('pt-BR', { 
                    weekday: 'short', 
                    day: '2-digit' 
                });
            }),
            completed
        };
    }

    getWeeklyProgressData() {
        const totalTasks = this.dashboard.tasks.length;
        const completedTasks = this.dashboard.tasks.filter(t => t.completed).length;
        const pendingTasks = totalTasks - completedTasks;

        // Se não há dados, usar dados de exemplo
        if (totalTasks === 0) {
            return {
                completed: 8,
                inProgress: 5,
                pending: 3
            };
        }

        return {
            completed: completedTasks,
            pending: Math.max(0, pendingTasks)
        };
    }

    getCategoryDistributionData() {
        const categories = ['trabalho', 'pessoal', 'estudo', 'saude'];
        const categoryNames = {
            'trabalho': 'Trabalho',
            'pessoal': 'Pessoal', 
            'estudo': 'Estudo',
            'saude': 'Saúde'
        };

        const total = [];

        categories.forEach(category => {
            const categoryTasks = this.dashboard.tasks.filter(t => t.category === category);
            total.push(categoryTasks.length);
        });

        // Se não há dados, usar dados de exemplo
        if (total.every(t => t === 0)) {
            return {
                labels: categories.map(cat => categoryNames[cat]),
                total: [6, 4, 3, 2], // Dados de exemplo
                completed: [4, 2, 2, 1] // Dados de exemplo
            };
        }

        return {
            labels: categories.map(cat => categoryNames[cat]),
            total
        };
    }

    getLast7Days() {
        const days = [];
        const today = new Date();
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            days.push(date);
        }
        
        return days;
    }

    // ===== ATUALIZAÇÃO DOS GRÁFICOS =====
    updateAllCharts() {
        try {
            console.log('🔄 Atualizando dados dos gráficos...');
            
            // Atualizar dados sem destruir os gráficos
            Object.keys(this.charts).forEach(chartName => {
                if (this.charts[chartName]) {
                    this.updateChart(chartName);
                }
            });
            
            console.log('📊 Gráficos atualizados com sucesso!');
        } catch (error) {
            console.error('❌ Erro ao atualizar gráficos:', error);
        }
    }

    // ===== LIMPEZA =====
    destroy() {
        // Destruir todos os gráficos
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.destroy === 'function') {
                chart.destroy();
            }
        });
        
        this.charts = {};
        console.log('📊 Sistema de gráficos destruído.');
    }
}

// ===== INICIALIZAÇÃO SEGURA =====
function initializeChartsWhenReady() {
    // Verificar se as dependências estão disponíveis
    if (window.dashboard && typeof Chart !== 'undefined') {
        try {
            console.log('🔧 Inicializando sistema de gráficos...');
            
            // Verificar se o dashboard tem os métodos necessários
            if (!window.dashboard.tasks || !window.dashboard.workingSessions) {
                console.warn('⚠️ Dashboard não tem dados necessários, aguardando...');
                setTimeout(() => this.initializeCharts(), 1000);
                return;
            }

            // Adicionar dados de teste se não houver dados
            if (window.dashboard.tasks.length === 0) {
                console.log('📊 Adicionando dados de teste para demonstração...');
                if (typeof window.addTestData === 'function') {
                    window.addTestData();
                } else {
                    console.warn('⚠️ Função addTestData não encontrada, criando dados básicos...');
                    // Criar dados básicos diretamente
                    window.dashboard.createTask({
                        title: 'Tarefa de Exemplo',
                        description: 'Esta é uma tarefa de exemplo para demonstração',
                        priority: 'medium',
                        category: 'trabalho'
                    });
                }
            }
            
            window.dashboard.charts = new ProductivityCharts(window.dashboard);
            
            // Integrar com sistema de refresh do dashboard
            const originalRefresh = window.dashboard.refreshDashboard;
            if (originalRefresh) {
                window.dashboard.refreshDashboard = function() {
                    originalRefresh.call(this);
                    if (this.charts) {
                        setTimeout(() => this.charts.updateAllCharts(), 500);
                    }
                };
            }
            
            console.log('🚀 Charts.js integrado com sucesso!');
            console.log('📊 Sistema pronto para uso');
        } catch (error) {
            console.error('❌ Erro ao inicializar gráficos:', error);
            console.error('🔍 Stack trace:', error.stack);
        }
    } else {
        // Tentar novamente em 500ms
        setTimeout(initializeChartsWhenReady, 500);
    }
}

// ===== INICIALIZAÇÃO ÚNICA E SIMPLES =====
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initializeChartsWhenReady, 1000);
    });
} else {
    setTimeout(initializeChartsWhenReady, 1000);
}

// Adicionar comando global para desenvolvedores
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.updateCharts = () => {
        if (window.dashboard && window.dashboard.charts) {
            window.dashboard.charts.updateAllCharts();
            console.log('📊 Gráficos atualizados manualmente.');
        } else {
            console.warn('Sistema de gráficos não inicializado.');
        }
    };
    
    console.log('💻 Comando disponível: updateCharts()');
}