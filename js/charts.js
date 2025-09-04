/**
 * Dashboard de Produtividade - Sistema de Gráficos
 * Integração com Chart.js para visualizações avançadas
 * Responsivo e otimizado para o tema escuro
 */

class ProductivityCharts {
    constructor(dashboard) {
        this.dashboard = dashboard;
        this.charts = {};
        this.colors = this.getThemeColors();
        this.chartDefaults = this.getChartDefaults();
        
        this.init();
    }

    // ===== INICIALIZAÇÃO =====
    init() {
        this.setupChartDefaults();
        this.createAllCharts();
        this.setupResizeHandler();
        
        console.log('📊 Sistema de gráficos inicializado!');
    }

    setupChartDefaults() {
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
            gradients: {
                primary: ['#6366f1', '#8b5cf6'],
                secondary: ['#06b6d4', '#3b82f6'],
                success: ['#10b981', '#059669'],
                warning: ['#f59e0b', '#d97706'],
                danger: ['#ef4444', '#dc2626']
            },
            glass: 'rgba(26, 26, 46, 0.25)',
            border: 'rgba(255, 255, 255, 0.1)',
            text: '#f8fafc',
            textMuted: '#cbd5e1'
        };
    }

    getChartDefaults() {
        return {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        color: this.colors.textMuted,
                        font: {
                            size: 11,
                            weight: '500'
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    titleColor: this.colors.text,
                    bodyColor: this.colors.textMuted,
                    borderColor: this.colors.border,
                    borderWidth: 1,
                    cornerRadius: 8,
                    padding: 12,
                    displayColors: true,
                    boxWidth: 8,
                    boxHeight: 8
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.03)',
                        borderColor: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: this.colors.textMuted,
                        font: {
                            size: 10,
                            weight: '500'
                        }
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.03)',
                        borderColor: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: this.colors.textMuted,
                        font: {
                            size: 10,
                            weight: '500'
                        }
                    }
                }
            },
            elements: {
                point: {
                    backgroundColor: this.colors.primary,
                    borderColor: '#fff',
                    borderWidth: 2,
                    hoverBackgroundColor: this.colors.secondary,
                    hoverBorderWidth: 3
                }
            }
        };
    }

    // ===== CRIAÇÃO DOS GRÁFICOS =====
    createAllCharts() {
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
            this.dashboard?.showFeedback('Erro ao carregar gráficos.', 'error');
        }
    }

    // ===== 1. GRÁFICO DE PRODUTIVIDADE SEMANAL (Commits/Sessões) =====
    createProductivityChart() {
        const canvas = document.getElementById('productivity-chart');
        if (!canvas) {
            console.warn('⚠️ Canvas productivity-chart não encontrado');
            return;
        }

        // Destruir gráfico existente se houver
        if (this.charts.productivity) {
            this.charts.productivity.destroy();
        }

        const ctx = canvas.getContext('2d');
        const data = this.getProductivityData();
        
        console.log('📊 Criando gráfico de produtividade com dados:', data);

        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, 'rgba(99, 102, 241, 0.3)');
        gradient.addColorStop(1, 'rgba(99, 102, 241, 0.05)');

        const config = {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Sessões de Trabalho',
                    data: data.sessions,
                    borderColor: this.colors.primary,
                    backgroundColor: gradient,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: this.colors.primary,
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7
                }, {
                    label: 'Tarefas Criadas',
                    data: data.tasksCreated,
                    borderColor: this.colors.secondary,
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    fill: false,
                    tension: 0.4,
                    pointBackgroundColor: this.colors.secondary,
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    borderDash: [5, 5]
                }]
            },
            options: {
                ...this.chartDefaults,
                plugins: {
                    ...this.chartDefaults.plugins,
                    title: {
                        display: false
                    },
                    tooltip: {
                        ...this.chartDefaults.plugins.tooltip,
                        callbacks: {
                            title: (context) => {
                                return context[0].label;
                            },
                            label: (context) => {
                                const label = context.dataset.label;
                                const value = context.parsed.y;
                                const suffix = label.includes('Sessões') ? ' sessões' : ' tarefas';
                                return `${label}: ${value}${suffix}`;
                            }
                        }
                    }
                },
                scales: {
                    ...this.chartDefaults.scales,
                    y: {
                        ...this.chartDefaults.scales.y,
                        beginAtZero: true,
                        ticks: {
                            ...this.chartDefaults.scales.y.ticks,
                            stepSize: 1,
                            callback: function(value) {
                                return Number.isInteger(value) ? value : '';
                            }
                        }
                    }
                }
            }
        };

        this.charts.productivity = new Chart(ctx, config);
    }

    // ===== 2. GRÁFICO DE TAREFAS COMPLETADAS POR DIA =====
    createTaskCompletionChart() {
        const canvas = document.getElementById('time-distribution-chart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const data = this.getTaskCompletionData();

        // Criar gradiente para barras
        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, this.colors.success);
        gradient.addColorStop(1, 'rgba(16, 185, 129, 0.3)');

        const config = {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Tarefas Completadas',
                    data: data.completed,
                    backgroundColor: gradient,
                    borderColor: this.colors.success,
                    borderWidth: 2,
                    borderRadius: 6,
                    borderSkipped: false,
                    hoverBackgroundColor: this.colors.success,
                    hoverBorderWidth: 3
                }, {
                    label: 'Tarefas Criadas',
                    data: data.created,
                    backgroundColor: 'rgba(139, 92, 246, 0.3)',
                    borderColor: this.colors.secondary,
                    borderWidth: 2,
                    borderRadius: 6,
                    borderSkipped: false,
                    hoverBackgroundColor: 'rgba(139, 92, 246, 0.5)',
                    hoverBorderWidth: 3
                }]
            },
            options: {
                ...this.chartDefaults,
                plugins: {
                    ...this.chartDefaults.plugins,
                    tooltip: {
                        ...this.chartDefaults.plugins.tooltip,
                        callbacks: {
                            title: (context) => {
                                return context[0].label;
                            },
                            label: (context) => {
                                return `${context.dataset.label}: ${context.parsed.y} tarefas`;
                            }
                        }
                    }
                },
                scales: {
                    ...this.chartDefaults.scales,
                    x: {
                        ...this.chartDefaults.scales.x,
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        ...this.chartDefaults.scales.y,
                        beginAtZero: true,
                        ticks: {
                            ...this.chartDefaults.scales.y.ticks,
                            stepSize: 1,
                            callback: function(value) {
                                return Number.isInteger(value) ? value : '';
                            }
                        }
                    }
                }
            }
        };

        this.charts.taskCompletion = new Chart(ctx, config);
    }

    // ===== 3. GRÁFICO DE PROGRESSO DAS METAS SEMANAIS =====
    createWeeklyProgressChart() {
        const canvas = document.getElementById('monthly-progress-chart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const data = this.getWeeklyProgressData();

        const config = {
            type: 'doughnut',
            data: {
                labels: ['Concluídas', 'Em Progresso', 'Pendentes'],
                datasets: [{
                    data: [data.completed, data.inProgress, data.pending],
                    backgroundColor: [
                        this.colors.success,
                        this.colors.warning, 
                        this.colors.danger
                    ],
                    borderColor: [
                        this.colors.success,
                        this.colors.warning,
                        this.colors.danger
                    ],
                    borderWidth: 3,
                    hoverOffset: 8,
                    cutout: '60%'
                }]
            },
            options: {
                ...this.chartDefaults,
                plugins: {
                    ...this.chartDefaults.plugins,
                    legend: {
                        ...this.chartDefaults.plugins.legend,
                        position: 'right',
                        labels: {
                            ...this.chartDefaults.plugins.legend.labels,
                            generateLabels: function(chart) {
                                const data = chart.data;
                                if (data.labels.length && data.datasets.length) {
                                    const dataset = data.datasets[0];
                                    const total = dataset.data.reduce((a, b) => a + b, 0);
                                    
                                    return data.labels.map((label, i) => {
                                        const value = dataset.data[i];
                                        const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                                        
                                        return {
                                            text: `${label}: ${value} (${percentage}%)`,
                                            fillStyle: dataset.backgroundColor[i],
                                            strokeStyle: dataset.borderColor[i],
                                            lineWidth: dataset.borderWidth,
                                            hidden: isNaN(dataset.data[i]),
                                            index: i
                                        };
                                    });
                                }
                                return [];
                            }
                        }
                    },
                    tooltip: {
                        ...this.chartDefaults.plugins.tooltip,
                        callbacks: {
                            label: (context) => {
                                const label = context.label;
                                const value = context.parsed;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                                return `${label}: ${value} tarefas (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        };

        this.charts.weeklyProgress = new Chart(ctx, config);
    }

    // ===== 4. GRÁFICO DE DISTRIBUIÇÃO POR CATEGORIAS =====
    createCategoryDistributionChart() {
        const canvas = document.getElementById('task-categories-chart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const data = this.getCategoryDistributionData();

        const config = {
            type: 'radar',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Tarefas Totais',
                    data: data.total,
                    borderColor: this.colors.primary,
                    backgroundColor: 'rgba(99, 102, 241, 0.2)',
                    pointBackgroundColor: this.colors.primary,
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    fill: true
                }, {
                    label: 'Tarefas Concluídas',
                    data: data.completed,
                    borderColor: this.colors.success,
                    backgroundColor: 'rgba(16, 185, 129, 0.15)',
                    pointBackgroundColor: this.colors.success,
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    fill: true
                }]
            },
            options: {
                ...this.chartDefaults,
                scales: {
                    r: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        pointLabels: {
                            color: this.colors.textMuted,
                            font: {
                                size: 11,
                                weight: '500'
                            }
                        },
                        ticks: {
                            color: this.colors.textMuted,
                            backdropColor: 'transparent',
                            font: {
                                size: 9
                            },
                            stepSize: 1,
                            callback: function(value) {
                                return Number.isInteger(value) ? value : '';
                            }
                        }
                    }
                },
                plugins: {
                    ...this.chartDefaults.plugins,
                    tooltip: {
                        ...this.chartDefaults.plugins.tooltip,
                        callbacks: {
                            label: (context) => {
                                return `${context.dataset.label}: ${context.parsed.r} tarefas`;
                            }
                        }
                    }
                }
            }
        };

        this.charts.categoryDistribution = new Chart(ctx, config);
    }

    // ===== OBTENÇÃO DE DADOS =====
    getProductivityData() {
        const last7Days = this.getLast7Days();
        const sessions = [];
        const tasksCreated = [];

        last7Days.forEach(date => {
            // Sessões de trabalho por dia
            const daySessionsCount = this.dashboard.workingSessions?.filter(session => {
                if (!session.startTime) return false;
                return new Date(session.startTime).toDateString() === date.toDateString();
            }).length || 0;
            sessions.push(daySessionsCount);

            // Tarefas criadas por dia
            const dayTasksCount = this.dashboard.tasks?.filter(task => {
                if (!task.createdAt) return false;
                return new Date(task.createdAt).toDateString() === date.toDateString();
            }).length || 0;
            tasksCreated.push(dayTasksCount);
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
            sessions,
            tasksCreated
        };
    }

    getTaskCompletionData() {
        const last7Days = this.getLast7Days();
        const completed = [];
        const created = [];

        last7Days.forEach(date => {
            // Tarefas completadas por dia
            const completedCount = this.dashboard.tasks?.filter(task => {
                if (!task.completedAt) return false;
                return new Date(task.completedAt).toDateString() === date.toDateString();
            }).length || 0;
            completed.push(completedCount);

            // Tarefas criadas por dia
            const createdCount = this.dashboard.tasks?.filter(task => {
                if (!task.createdAt) return false;
                return new Date(task.createdAt).toDateString() === date.toDateString();
            }).length || 0;
            created.push(createdCount);
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
            completed,
            created
        };
    }

    getWeeklyProgressData() {
        const totalTasks = this.dashboard.tasks?.length || 0;
        const completedTasks = this.dashboard.tasks?.filter(t => t.completed).length || 0;
        
        // Tarefas em progresso (com deadline próximo mas não completadas)
        const now = new Date();
        const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        
        const inProgressTasks = this.dashboard.tasks?.filter(task => {
            if (task.completed || !task.deadline) return false;
            const deadline = new Date(task.deadline);
            return deadline <= nextWeek && deadline >= now;
        }).length || 0;

        const pendingTasks = totalTasks - completedTasks - inProgressTasks;

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
            inProgress: Math.max(0, inProgressTasks),
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
        const completed = [];

        categories.forEach(category => {
            const categoryTasks = this.dashboard.tasks?.filter(t => t.category === category) || [];
            const categoryCompleted = categoryTasks.filter(t => t.completed);
            
            total.push(categoryTasks.length);
            completed.push(categoryCompleted.length);
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
            total,
            completed
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

    updateChart(chartName) {
        if (!this.charts[chartName]) return;

        try {
            let newData;
            
            switch (chartName) {
                case 'productivity':
                    newData = this.getProductivityData();
                    this.charts.productivity.data.labels = newData.labels;
                    this.charts.productivity.data.datasets[0].data = newData.sessions;
                    this.charts.productivity.data.datasets[1].data = newData.tasksCreated;
                    break;
                    
                case 'taskCompletion':
                    newData = this.getTaskCompletionData();
                    this.charts.taskCompletion.data.labels = newData.labels;
                    this.charts.taskCompletion.data.datasets[0].data = newData.completed;
                    this.charts.taskCompletion.data.datasets[1].data = newData.created;
                    break;
                    
                case 'weeklyProgress':
                    newData = this.getWeeklyProgressData();
                    this.charts.weeklyProgress.data.datasets[0].data = [
                        newData.completed, 
                        newData.inProgress, 
                        newData.pending
                    ];
                    break;
                    
                case 'categoryDistribution':
                    newData = this.getCategoryDistributionData();
                    this.charts.categoryDistribution.data.datasets[0].data = newData.total;
                    this.charts.categoryDistribution.data.datasets[1].data = newData.completed;
                    break;
            }
            
            this.charts[chartName].update('active');
        } catch (error) {
            console.error(`Erro ao atualizar gráfico ${chartName}:`, error);
        }
    }

    // ===== DEBUG E VERIFICAÇÃO =====
    debugCharts() {
        console.log('🔍 Debug dos gráficos:');
        console.log('📊 Total de gráficos:', Object.keys(this.charts).length);
        console.log('📋 Gráficos disponíveis:', Object.keys(this.charts));
        
        Object.keys(this.charts).forEach(chartName => {
            const chart = this.charts[chartName];
            if (chart) {
                console.log(`✅ ${chartName}:`, chart);
            } else {
                console.log(`❌ ${chartName}: não encontrado`);
            }
        });
    }

    // ===== RESPONSIVIDADE =====
    setupResizeHandler() {
        let resizeTimeout;
        
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 250);
        });
    }

    handleResize() {
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.resize === 'function') {
                chart.resize();
            }
        });
    }

    // ===== CONFIGURAÇÕES RESPONSIVAS =====
    getResponsiveConfig(chartType = 'default') {
        const isMobile = window.innerWidth < 768;
        const isTablet = window.innerWidth < 1024;
        
        const responsiveConfig = {
            maintainAspectRatio: false,
            responsive: true,
            plugins: {
                legend: {
                    display: !isMobile || chartType === 'doughnut',
                    position: isMobile ? 'bottom' : 'bottom',
                    labels: {
                        padding: isMobile ? 10 : 20,
                        font: {
                            size: isMobile ? 10 : 11
                        },
                        boxWidth: isMobile ? 12 : 16
                    }
                },
                tooltip: {
                    enabled: true,
                    titleFont: {
                        size: isMobile ? 11 : 12
                    },
                    bodyFont: {
                        size: isMobile ? 10 : 11
                    },
                    padding: isMobile ? 8 : 12
                }
            }
        };

        if (chartType === 'radar') {
            responsiveConfig.scales = {
                r: {
                    pointLabels: {
                        font: {
                            size: isMobile ? 9 : 11
                        }
                    },
                    ticks: {
                        font: {
                            size: isMobile ? 8 : 9
                        }
                    }
                }
            };
        }

        return responsiveConfig;
    }

    // ===== ANIMAÇÕES PERSONALIZADAS =====
    createChartAnimation(chartInstance, animationType = 'fadeIn') {
        if (!chartInstance || !chartInstance.canvas) return;

        const canvas = chartInstance.canvas;
        const container = canvas.parentElement;

        // Adicionar classe de animação
        container.classList.add(`chart-${animationType}`);
        
        // Remover após a animação
        setTimeout(() => {
            container.classList.remove(`chart-${animationType}`);
        }, 800);
    }

    // ===== TEMAS E CORES DINÂMICAS =====
    updateChartTheme(newTheme = 'dark') {
        this.colors = this.getThemeColors();
        
        // Atualizar padrões globais
        Chart.defaults.color = newTheme === 'dark' ? '#cbd5e1' : '#64748b';
        Chart.defaults.borderColor = newTheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        Chart.defaults.scale.grid.color = newTheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
        
        // Recriar todos os gráficos com novo tema
        this.updateAllCharts();
    }

    // ===== EXPORTAÇÃO DE GRÁFICOS =====
    exportChart(chartName, format = 'png') {
        if (!this.charts[chartName]) {
            console.error(`Gráfico ${chartName} não encontrado`);
            return;
        }

        try {
            const canvas = this.charts[chartName].canvas;
            const url = canvas.toDataURL(`image/${format}`);
            
            const link = document.createElement('a');
            link.download = `${chartName}_${new Date().toISOString().split('T')[0]}.${format}`;
            link.href = url;
            link.click();
            
            this.dashboard?.showFeedback(`Gráfico ${chartName} exportado!`, 'success');
        } catch (error) {
            console.error('Erro ao exportar gráfico:', error);
            this.dashboard?.showFeedback('Erro ao exportar gráfico.', 'error');
        }
    }

    exportAllCharts() {
        Object.keys(this.charts).forEach(chartName => {
            setTimeout(() => this.exportChart(chartName), 100);
        });
    }

    // ===== ANÁLISE DE DADOS =====
    getChartInsights() {
        const insights = [];
        
        try {
            // Análise de produtividade
            const productivityData = this.getProductivityData();
            const avgSessions = productivityData.sessions.reduce((a, b) => a + b, 0) / 7;
            
            if (avgSessions > 3) {
                insights.push('🔥 Excelente consistência nas sessões de trabalho!');
            } else if (avgSessions < 1) {
                insights.push('💡 Considere aumentar a frequência das sessões de trabalho.');
            }

            // Análise de conclusão
            const completionData = this.getTaskCompletionData();
            const totalCompleted = completionData.completed.reduce((a, b) => a + b, 0);
            const totalCreated = completionData.created.reduce((a, b) => a + b, 0);
            
            if (totalCompleted >= totalCreated * 0.8) {
                insights.push('⭐ Ótima taxa de conclusão de tarefas esta semana!');
            }

            // Análise de categorias
            const categoryData = this.getCategoryDistributionData();
            const workIndex = categoryData.labels.indexOf('Trabalho');
            
            if (workIndex !== -1 && categoryData.total[workIndex] > categoryData.total.reduce((a, b) => a + b, 0) * 0.7) {
                insights.push('⚖️ Considere balancear melhor as categorias de tarefas.');
            }

        } catch (error) {
            console.error('Erro ao gerar insights:', error);
        }

        return insights;
    }

    // ===== LIMPEZA E DESTRUIÇÃO =====
    destroy() {
        // Destruir todos os gráficos
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.destroy === 'function') {
                chart.destroy();
            }
        });
        
        this.charts = {};
        
        // Remover event listeners
        window.removeEventListener('resize', this.handleResize);
        
        console.log('📊 Sistema de gráficos destruído.');
    }
}

// ===== INICIALIZAÇÃO E INTEGRAÇÃO =====
// Adicionar ao escopo global para acesso fácil
window.ProductivityCharts = ProductivityCharts;

// ===== INICIALIZADOR ROBUSTO PARA GRÁFICOS =====
class DashboardInitializer {
    constructor() {
        this.maxRetries = 5;
        this.retryDelay = 1000;
        this.currentRetry = 0;
        this.init();
    }

    init() {
        this.waitForDependencies();
    }

    waitForDependencies() {
        if (window.dashboard && typeof Chart !== 'undefined') {
            this.initializeCharts();
        } else if (this.currentRetry < this.maxRetries) {
            this.currentRetry++;
            console.warn(`⏳ Tentativa ${this.currentRetry}/${this.maxRetries} - Aguardando dependências...`);
            setTimeout(() => this.waitForDependencies(), this.retryDelay);
        } else {
            console.error('❌ Falha ao inicializar gráficos após múltiplas tentativas');
        }
    }

    initializeCharts() {
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
            
            // Integrar com sistema de métricas
            const originalUpdateMetrics = window.dashboard.updateMetrics;
            window.dashboard.updateMetrics = function() {
                originalUpdateMetrics.call(this);
                if (this.charts) {
                    setTimeout(() => {
                        this.charts.updateChart('weeklyProgress');
                        this.charts.updateChart('categoryDistribution');
                    }, 100);
                }
            };
            
            // Integrar com sistema de tarefas
            const originalRenderTasks = window.dashboard.renderTasks;
            window.dashboard.renderTasks = function() {
                originalRenderTasks.call(this);
                if (this.charts) {
                    setTimeout(() => {
                        this.charts.updateChart('taskCompletion');
                        this.charts.updateChart('productivity');
                    }, 100);
                }
            };
            
            console.log('🚀 Charts.js integrado com sucesso!');
        } catch (error) {
            console.error('❌ Erro ao inicializar gráficos:', error);
        }
    }
}

// Inicializar quando DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new DashboardInitializer();
    });
} else {
    new DashboardInitializer();
}

// Adicionar comando global para desenvolvedores
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.exportAllCharts = () => {
        if (window.dashboard && window.dashboard.charts) {
            window.dashboard.charts.exportAllCharts();
        } else {
            console.warn('Sistema de gráficos não inicializado.');
        }
    };
    
    window.updateCharts = () => {
        if (window.dashboard && window.dashboard.charts) {
            window.dashboard.charts.updateAllCharts();
            console.log('📊 Gráficos atualizados manualmente.');
        } else {
            console.warn('Sistema de gráficos não inicializado.');
        }
    };
    
    console.log('💻 Comandos de desenvolvimento disponíveis:');
    console.log('  - exportAllCharts() // Exportar todos os gráficos');
    console.log('  - updateCharts() // Atualizar todos os gráficos');
    console.log('  - debugCharts() // Debug dos gráficos');
    
    // Adicionar comando global de debug
    window.debugCharts = () => {
        if (window.dashboard && window.dashboard.charts) {
            window.dashboard.charts.debugCharts();
        } else {
            console.warn('Sistema de gráficos não inicializado.');
        }
    };
}