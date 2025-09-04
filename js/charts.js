/**
 * Sistema de Gráficos Simplificado - Dashboard de Produtividade
 * Versão corrigida que evita problemas de inicialização
 */

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
            this.createProductivityChart();
            this.createTaskCompletionChart();
            this.createWeeklyProgressChart();
            this.createCategoryDistributionChart();
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
            }).length;
            sessions.push(daySessionsCount);
        });

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
            }).length;
            completed.push(completedCount);
        });

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
            Object.values(this.charts).forEach(chart => {
                if (chart && typeof chart.destroy === 'function') {
                    chart.destroy();
                }
            });
            
            this.charts = {};
            this.createAllCharts();
            
            console.log('📊 Gráficos atualizados com sucesso!');
        } catch (error) {
            console.error('Erro ao atualizar gráficos:', error);
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
            window.dashboard.charts = new ProductivityCharts(window.dashboard);
            
            // Integrar com sistema de refresh do dashboard
            const originalRefresh = window.dashboard.refreshDashboard;
            window.dashboard.refreshDashboard = function() {
                originalRefresh.call(this);
                if (this.charts) {
                    setTimeout(() => this.charts.updateAllCharts(), 500);
                }
            };
            
            console.log('🚀 Charts.js integrado com sucesso!');
        } catch (error) {
            console.error('❌ Erro ao inicializar gráficos:', error);
        }
    } else {
        // Tentar novamente em 500ms
        setTimeout(initializeChartsWhenReady, 500);
    }
}

// Inicializar quando DOM estiver pronto
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