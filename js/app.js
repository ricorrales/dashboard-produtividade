/**
 * Dashboard de Produtividade - Versão Corrigida
 * Principais correções:
 * 1. Remoção de funções onclick do HTML
 * 2. Verificações robustas de DOM
 * 3. Inicialização simplificada
 * 4. Tratamento de erros melhorado
 */

class ProductivityDashboard {
    constructor() {
        console.log('🚀 Iniciando Dashboard de Produtividade...');
        
        this.tasks = [];
        this.workingSessions = [];
        this.currentSession = null;
        this.workTimerInterval = null;
        this.metrics = {
            tasksCompleted: 0,
            productiveHours: 0,
            goalsAchieved: 0,
            streakDays: 0
        };

        this.init();
    }

    // ===== INICIALIZAÇÃO ROBUSTA =====
    init() {
        try {
            console.log('📋 Carregando dados salvos...');
            this.loadFromStorage();
            
            console.log('🎯 Configurando event listeners...');
            this.setupEventListeners();
            
            console.log('⏰ Iniciando relógio...');
            this.updateClock();
            setInterval(() => this.updateClock(), 1000);
            
            console.log('📊 Calculando métricas...');
            this.updateMetrics();
            
            console.log('📝 Renderizando tarefas...');
            this.renderTasks();
            
            console.log('⏱️ Configurando timer...');
            this.updateWorkTimer();
            this.createWorkTimerControls();
            
            console.log('✅ Dashboard inicializado com sucesso!');
            this.showFeedback('Dashboard carregado com sucesso!', 'success');
        } catch (error) {
            console.error('❌ Erro na inicialização:', error);
            this.showFeedback('Erro ao carregar dashboard. Verifique o console.', 'error');
        }
    }

    // ===== EVENT LISTENERS SEGUROS =====
    setupEventListeners() {
        try {
            // Botão de refresh - CORRIGIDO: usando getElementById em vez de onclick
            const refreshBtn = document.getElementById('btn-refresh');
            if (refreshBtn) {
                refreshBtn.addEventListener('click', () => {
                    this.refreshDashboard();
                });
                console.log('✅ Botão refresh configurado');
            } else {
                console.warn('⚠️ Botão refresh não encontrado');
            }

            // Botão de nova tarefa - CORRIGIDO
            const addTaskBtn = document.getElementById('btn-add-task');
            if (addTaskBtn) {
                addTaskBtn.addEventListener('click', () => {
                    this.openTaskModal();
                });
                console.log('✅ Botão nova tarefa configurado');
            } else {
                console.warn('⚠️ Botão nova tarefa não encontrado');
            }

            // Botão fechar modal - CORRIGIDO
            const closeModalBtn = document.getElementById('btn-close-modal');
            if (closeModalBtn) {
                closeModalBtn.addEventListener('click', () => {
                    this.closeTaskModal();
                });
                console.log('✅ Botão fechar modal configurado');
            }

            // Botão cancelar modal
            const cancelBtn = document.getElementById('btn-cancel');
            if (cancelBtn) {
                cancelBtn.addEventListener('click', () => {
                    this.closeTaskModal();
                });
            }

            // Fechar modal ao clicar no overlay
            const modalOverlay = document.getElementById('task-modal');
            if (modalOverlay) {
                modalOverlay.addEventListener('click', (e) => {
                    if (e.target === modalOverlay) {
                        this.closeTaskModal();
                    }
                });
            }

            // Formulário de tarefa
            const taskForm = document.getElementById('task-form');
            if (taskForm) {
                taskForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.createTask();
                });
            }

            // Filtros de tarefas - VERIFICAÇÃO SEGURA
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    this.filterTasks(e.target.dataset.filter);
                });
            });

            // Teclas de atalho
            document.addEventListener('keydown', (e) => {
                this.handleKeyboardShortcuts(e);
            });

            console.log('📝 Event listeners configurados com sucesso');
        } catch (error) {
            console.error('❌ Erro ao configurar event listeners:', error);
        }
    }

    // ===== RELÓGIO EM TEMPO REAL =====
    updateClock() {
        const dateElement = document.getElementById('current-date');
        if (!dateElement) return;

        try {
            const now = new Date();
            const options = {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            };
            
            const dateString = now.toLocaleDateString('pt-BR', options);
            dateElement.textContent = dateString;
        } catch (error) {
            console.error('Erro ao atualizar relógio:', error);
            dateElement.textContent = 'Erro no relógio';
        }
    }

    // ===== SISTEMA DE TAREFAS ROBUSTO =====
    createTask() {
        try {
            const titleInput = document.getElementById('task-title-input');
            const descriptionInput = document.getElementById('task-description-input');
            const priorityInput = document.getElementById('task-priority-input');
            const categoryInput = document.getElementById('task-category-input');
            const deadlineInput = document.getElementById('task-deadline-input');

            if (!titleInput) {
                this.showFeedback('Formulário não encontrado.', 'error');
                return;
            }

            const title = titleInput.value.trim();
            if (!title) {
                this.showFeedback('Por favor, insira um título para a tarefa.', 'error');
                titleInput.focus();
                return;
            }

            const task = {
                id: this.generateId(),
                title: title,
                description: descriptionInput?.value.trim() || '',
                priority: priorityInput?.value || 'medium',
                category: categoryInput?.value || 'trabalho',
                deadline: deadlineInput?.value || '',
                completed: false,
                createdAt: new Date().toISOString(),
                completedAt: null
            };

            this.tasks.unshift(task);
            this.saveToStorage();
            this.renderTasks();
            this.updateMetrics();
            this.closeTaskModal();

            this.showFeedback('Tarefa criada com sucesso!', 'success');
            console.log('✅ Nova tarefa criada:', task.title);
        } catch (error) {
            console.error('❌ Erro ao criar tarefa:', error);
            this.showFeedback('Erro ao criar tarefa.', 'error');
        }
    }

    toggleTaskCompletion(taskId) {
        try {
            const task = this.tasks.find(t => t.id === taskId);
            if (!task) return;

            task.completed = !task.completed;
            task.completedAt = task.completed ? new Date().toISOString() : null;

            this.saveToStorage();
            this.renderTasks();
            this.updateMetrics();

            if (task.completed) {
                this.showFeedback('Tarefa concluída!', 'success');
            } else {
                this.showFeedback('Tarefa desmarcada.', 'info');
            }
        } catch (error) {
            console.error('❌ Erro ao alterar status da tarefa:', error);
        }
    }

    deleteTask(taskId) {
        try {
            if (!confirm('Tem certeza que deseja excluir esta tarefa?')) return;

            this.tasks = this.tasks.filter(t => t.id !== taskId);
            this.saveToStorage();
            this.renderTasks();
            this.updateMetrics();

            this.showFeedback('Tarefa excluída.', 'warning');
        } catch (error) {
            console.error('❌ Erro ao excluir tarefa:', error);
        }
    }

    renderTasks() {
        const tasksList = document.getElementById('tasks-list');
        if (!tasksList) {
            console.warn('⚠️ Container de tarefas não encontrado');
            return;
        }

        try {
            if (this.tasks.length === 0) {
                tasksList.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-tasks"></i>
                        <p>Nenhuma tarefa ainda. Clique em "Nova Tarefa" para começar!</p>
                    </div>
                `;
                return;
            }

            tasksList.innerHTML = this.tasks.map(task => this.createTaskHTML(task)).join('');

            // Adicionar event listeners para cada tarefa
            this.tasks.forEach(task => {
                this.setupTaskEventListeners(task.id);
            });

            console.log(`📝 ${this.tasks.length} tarefas renderizadas`);
        } catch (error) {
            console.error('❌ Erro ao renderizar tarefas:', error);
            tasksList.innerHTML = '<p>Erro ao carregar tarefas</p>';
        }
    }

    setupTaskEventListeners(taskId) {
        const element = document.querySelector(`[data-task-id="${taskId}"]`);
        if (!element) return;

        try {
            // Checkbox
            const checkbox = element.querySelector('.task-checkbox');
            if (checkbox) {
                checkbox.addEventListener('click', () => {
                    this.toggleTaskCompletion(taskId);
                });
            }

            // Botão de excluir
            const deleteBtn = element.querySelector('.btn-task-delete');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', () => {
                    this.deleteTask(taskId);
                });
            }
        } catch (error) {
            console.error('❌ Erro ao configurar listeners da tarefa:', error);
        }
    }

    createTaskHTML(task) {
        const timeAgo = this.getTimeAgo(task.createdAt);
        const deadlineText = task.deadline ?
            `Vence: ${new Date(task.deadline).toLocaleDateString('pt-BR')}` :
            timeAgo;

        return `
            <div class="task-item ${task.completed ? 'completed' : 'pending'}" data-task-id="${task.id}">
                <div class="task-checkbox ${task.completed ? 'checked' : ''}">
                    ${task.completed ? '<i class="fas fa-check"></i>' : '<i class="far fa-circle"></i>'}
                </div>
                <div class="task-content">
                    <h4 class="task-title">${this.escapeHtml(task.title)}</h4>
                    ${task.description ? `<p class="task-description">${this.escapeHtml(task.description)}</p>` : ''}
                    <div class="task-meta">
                        <span class="task-priority ${task.priority}">${this.getPriorityText(task.priority)}</span>
                        <span class="task-category">${this.getCategoryText(task.category)}</span>
                        <span class="task-time">${deadlineText}</span>
                    </div>
                </div>
                <div class="task-actions">
                    <button class="btn-task-delete tooltip" data-tooltip="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }

    filterTasks(filter) {
        try {
            // Atualizar botões ativos
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });

            const activeBtn = document.querySelector(`[data-filter="${filter}"]`);
            if (activeBtn) {
                activeBtn.classList.add('active');
            }

            // Filtrar tarefas
            const taskElements = document.querySelectorAll('.task-item');
            taskElements.forEach(element => {
                const taskId = element.dataset.taskId;
                const task = this.tasks.find(t => t.id === taskId);

                if (!task) return;

                let show = true;
                switch (filter) {
                    case 'pending':
                        show = !task.completed;
                        break;
                    case 'completed':
                        show = task.completed;
                        break;
                    case 'urgent':
                        show = task.priority === 'high';
                        break;
                    default:
                        show = true;
                }

                element.style.display = show ? 'flex' : 'none';
            });
        } catch (error) {
            console.error('Erro ao filtrar tarefas:', error);
        }
    }

    // ===== TIMER DE TRABALHO =====
    createWorkTimerControls() {
        // Verificar se já existe
        if (document.getElementById('work-timer')) return;

        const timerContainer = document.createElement('div');
        timerContainer.className = 'work-timer-container';
        timerContainer.innerHTML = `
            <div class="work-timer-display">
                <i class="fas fa-clock"></i>
                <span id="work-timer">00:00:00</span>
            </div>
            <div class="work-timer-controls">
                <button id="start-work-btn" class="btn-work-control start">
                    <i class="fas fa-play"></i>
                </button>
                <button id="stop-work-btn" class="btn-work-control stop" disabled>
                    <i class="fas fa-stop"></i>
                </button>
            </div>
        `;

        // Estilos inline para garantir funcionalidade
        timerContainer.style.cssText = `
            display: flex;
            align-items: center;
            gap: 1rem;
            background: rgba(26, 26, 46, 0.25);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 0.75rem;
            padding: 0.75rem 1rem;
        `;

        // Adicionar ao header
        const headerActions = document.querySelector('.header-actions');
        if (headerActions) {
            headerActions.appendChild(timerContainer);
        }

        // Event listeners
        const startBtn = document.getElementById('start-work-btn');
        const stopBtn = document.getElementById('stop-work-btn');
        
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                this.startWorkSession();
            });
        }

        if (stopBtn) {
            stopBtn.addEventListener('click', () => {
                this.stopWorkSession();
            });
        }

        this.updateTimerButtons();
    }

    startWorkSession() {
        if (this.currentSession) {
            this.showFeedback('Já existe uma sessão em andamento.', 'warning');
            return;
        }

        this.currentSession = {
            id: this.generateId(),
            startTime: new Date(),
            endTime: null,
            duration: 0
        };

        this.showFeedback('Sessão de trabalho iniciada!', 'info');

        // Atualizar timer a cada segundo
        this.workTimerInterval = setInterval(() => {
            this.updateWorkTimer();
        }, 1000);

        this.updateTimerButtons();
    }

    stopWorkSession() {
        if (!this.currentSession) {
            this.showFeedback('Nenhuma sessão ativa para parar.', 'warning');
            return;
        }

        // Calcular duração
        this.currentSession.endTime = new Date();
        this.currentSession.duration = this.currentSession.endTime - this.currentSession.startTime;
        const sessionMinutes = Math.round(this.currentSession.duration / 60000);

        // Salvar sessão no histórico
        this.workingSessions.push({ ...this.currentSession });

        // Reset session
        this.currentSession = null;

        // Limpar interval
        if (this.workTimerInterval) {
            clearInterval(this.workTimerInterval);
            this.workTimerInterval = null;
        }

        this.updateWorkTimer();
        this.updateMetrics();
        this.saveToStorage();
        this.updateTimerButtons();

        this.showFeedback(`Sessão finalizada! ${sessionMinutes} minutos registrados.`, 'success');
    }

    updateWorkTimer() {
        const timerElement = document.getElementById('work-timer');
        if (!timerElement) return;

        if (this.currentSession) {
            const elapsed = new Date() - this.currentSession.startTime;
            const hours = Math.floor(elapsed / 3600000);
            const minutes = Math.floor((elapsed % 3600000) / 60000);
            const seconds = Math.floor((elapsed % 60000) / 1000);

            timerElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            timerElement.style.color = '#10b981'; // Verde quando ativo
        } else {
            timerElement.textContent = '00:00:00';
            timerElement.style.color = '#cbd5e1'; // Cinza quando parado
        }
    }

    updateTimerButtons() {
        const startBtn = document.getElementById('start-work-btn');
        const stopBtn = document.getElementById('stop-work-btn');

        if (startBtn && stopBtn) {
            if (this.currentSession) {
                startBtn.disabled = true;
                stopBtn.disabled = false;
                startBtn.style.opacity = '0.5';
                stopBtn.style.opacity = '1';
            } else {
                startBtn.disabled = false;
                stopBtn.disabled = true;
                startBtn.style.opacity = '1';
                stopBtn.style.opacity = '0.5';
            }
        }
    }

    // ===== CÁLCULO DE MÉTRICAS =====
    updateMetrics() {
        try {
            // Tarefas completadas hoje
            const today = new Date().toDateString();
            const completedToday = this.tasks.filter(task =>
                task.completed &&
                task.completedAt &&
                new Date(task.completedAt).toDateString() === today
            ).length;

            // Tempo produtivo total (em horas)
            const totalMs = this.workingSessions.reduce((total, session) => {
                return total + (session.duration || 0);
            }, 0);
            const productiveHours = Math.round(totalMs / 3600000 * 10) / 10;

            // Porcentagem de metas atingidas
            const totalTasks = this.tasks.length;
            const completedTasks = this.tasks.filter(t => t.completed).length;
            const goalsPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

            // Sequência de dias
            const streakDays = this.calculateStreak();

            // Atualizar métricas
            this.metrics = {
                tasksCompleted: completedToday,
                productiveHours,
                goalsAchieved: goalsPercentage,
                streakDays
            };

            // Atualizar DOM
            this.updateMetricsDisplay();
        } catch (error) {
            console.error('Erro ao calcular métricas:', error);
        }
    }

    updateMetricsDisplay() {
        const elements = {
            'tasks-completed': this.metrics.tasksCompleted,
            'productive-hours': `${this.metrics.productiveHours}h`,
            'goals-achieved': `${this.metrics.goalsAchieved}%`,
            'streak-days': `${this.metrics.streakDays} dias`
        };

        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        });
    }

    calculateStreak() {
        if (this.tasks.length === 0) return 0;

        const today = new Date();
        const hasTasksToday = this.tasks.some(task =>
            task.completed &&
            task.completedAt &&
            new Date(task.completedAt).toDateString() === today.toDateString()
        );

        return hasTasksToday ? Math.max(this.metrics.streakDays || 1, 1) : 0;
    }

    // ===== MODAIS =====
    openTaskModal() {
        const modal = document.getElementById('task-modal');
        if (modal) {
            modal.classList.add('active');
            const titleInput = document.getElementById('task-title-input');
            if (titleInput) {
                titleInput.focus();
            }
        }
    }

    closeTaskModal() {
        const modal = document.getElementById('task-modal');
        if (modal) {
            modal.classList.remove('active');

            // Reset do formulário
            const form = document.getElementById('task-form');
            if (form) {
                form.reset();
            }
        }
    }

    // ===== REFRESH DO DASHBOARD =====
    refreshDashboard() {
        const refreshBtn = document.getElementById('btn-refresh');
        if (refreshBtn) {
            refreshBtn.classList.add('loading');
            refreshBtn.disabled = true;
        }

        // Simular carregamento
        setTimeout(() => {
            this.updateMetrics();
            this.renderTasks();
            this.updateClock();
            this.updateWorkTimer();

            if (refreshBtn) {
                refreshBtn.classList.remove('loading');
                refreshBtn.disabled = false;
            }
            this.showFeedback('Dashboard atualizado!', 'success');
        }, 1000);
    }

    // ===== ATALHOS DE TECLADO =====
    handleKeyboardShortcuts(e) {
        // Prevenir atalhos quando em campos de input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }

        // Ctrl/Cmd + N: Nova tarefa
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            this.openTaskModal();
        }

        // Escape: Fechar modal
        if (e.key === 'Escape') {
            this.closeTaskModal();
        }

        // Espaço: Start/Stop timer
        if (e.code === 'Space' && !e.target.closest('.modal-overlay')) {
            e.preventDefault();
            if (this.currentSession) {
                this.stopWorkSession();
            } else {
                this.startWorkSession();
            }
        }
    }

    // ===== PERSISTÊNCIA =====
    saveToStorage() {
        const data = {
            tasks: this.tasks,
            workingSessions: this.workingSessions,
            metrics: this.metrics,
            lastSaved: new Date().toISOString()
        };

        try {
            localStorage.setItem('productivityDashboard', JSON.stringify(data));
        } catch (error) {
            console.error('Erro ao salvar dados:', error);
            this.showFeedback('Erro ao salvar dados localmente.', 'error');
        }
    }

    loadFromStorage() {
        try {
            const data = localStorage.getItem('productivityDashboard');
            if (!data) return;

            const parsed = JSON.parse(data);

            this.tasks = Array.isArray(parsed.tasks) ? parsed.tasks : [];
            this.workingSessions = Array.isArray(parsed.workingSessions) ? parsed.workingSessions : [];
            this.metrics = parsed.metrics || this.metrics;

            console.log('📁 Dados carregados do localStorage');
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            this.showFeedback('Erro ao carregar dados salvos.', 'warning');
        }
    }

    // ===== FEEDBACK VISUAL =====
    showFeedback(message, type = 'info') {
        // Criar elemento de feedback
        const feedbackEl = document.createElement('div');
        feedbackEl.className = `notification-toast notification-${type}`;
        feedbackEl.innerHTML = `
            <i class="fas fa-${this.getFeedbackIcon(type)}"></i>
            <span>${message}</span>
        `;

        // Estilos inline para garantir funcionamento
        Object.assign(feedbackEl.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: this.getFeedbackColor(type),
            color: 'white',
            padding: '12px 16px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            zIndex: '10000',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            fontSize: '14px',
            fontWeight: '500',
            maxWidth: '300px'
        });

        document.body.appendChild(feedbackEl);

        // Animação de entrada
        requestAnimationFrame(() => {
            feedbackEl.style.transform = 'translateX(0)';
        });

        // Remover após 4 segundos
        setTimeout(() => {
            feedbackEl.style.transform = 'translateX(100%)';
            setTimeout(() => feedbackEl.remove(), 300);
        }, 4000);
    }

    getFeedbackColor(type) {
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#6366f1'
        };
        return colors[type] || colors.info;
    }

    getFeedbackIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    // ===== UTILITÁRIOS =====
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    getTimeAgo(dateString) {
        if (!dateString) return 'Data inválida';

        const now = new Date();
        const date = new Date(dateString);
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffDays > 0) return `${diffDays} dia${diffDays > 1 ? 's' : ''} atrás`;
        if (diffHours > 0) return `${diffHours}h atrás`;
        if (diffMins > 0) return `${diffMins}min atrás`;
        return 'Agora mesmo';
    }

    getPriorityText(priority) {
        const priorities = {
            low: 'Baixa',
            medium: 'Média',
            high: 'Alta'
        };
        return priorities[priority] || 'Média';
    }

    getCategoryText(category) {
        const categories = {
            trabalho: 'Trabalho',
            pessoal: 'Pessoal',
            estudo: 'Estudo',
            saude: 'Saúde'
        };
        return categories[category] || 'Geral';
    }

    // ===== LIMPEZA =====
    destroy() {
        // Limpar intervals
        if (this.workTimerInterval) {
            clearInterval(this.workTimerInterval);
        }

        // Salvar dados finais
        this.saveToStorage();

        console.log('📊 Dashboard destruído e dados salvos.');
    }
}

// ===== INICIALIZAÇÃO GLOBAL =====
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Verificar suporte a recursos necessários
        if (!window.localStorage) {
            alert('Seu navegador não suporta localStorage. Algumas funcionalidades podem não funcionar.');
            return;
        }

        // Inicializar dashboard
        window.dashboard = new ProductivityDashboard();

        // Adicionar funções globais para compatibilidade (CORRIGIDO)
        window.refreshDashboard = () => window.dashboard?.refreshDashboard();
        window.openTaskModal = () => window.dashboard?.openTaskModal();
        window.closeTaskModal = () => window.dashboard?.closeTaskModal();

        // Comando de teste para desenvolvimento
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            window.addTestData = () => {
                const testTasks = [
                    {
                        title: 'Revisar código do projeto',
                        description: 'Fazer code review das últimas alterações',
                        priority: 'high',
                        category: 'trabalho'
                    },
                    {
                        title: 'Exercitar-se',
                        description: '30 minutos de caminhada',
                        priority: 'medium',
                        category: 'saude'
                    },
                    {
                        title: 'Estudar JavaScript',
                        description: 'Completar curso online',
                        priority: 'low',
                        category: 'estudo'
                    }
                ];

                testTasks.forEach(taskData => {
                    const task = {
                        id: window.dashboard.generateId(),
                        ...taskData,
                        completed: Math.random() > 0.5,
                        createdAt: new Date().toISOString(),
                        completedAt: null,
                        deadline: ''
                    };

                    if (task.completed) {
                        task.completedAt = new Date().toISOString();
                    }

                    window.dashboard.tasks.push(task);
                });

                window.dashboard.saveToStorage();
                window.dashboard.renderTasks();
                window.dashboard.updateMetrics();
                window.dashboard.showFeedback('Dados de teste adicionados!', 'success');
            };

            console.log('💻 Modo desenvolvimento ativo. Use addTestData() para adicionar dados de teste.');
        }

        console.log('🚀 Dashboard de Produtividade carregado com sucesso!');
    } catch (error) {
        console.error('❌ Erro crítico na inicialização:', error);
        alert('Erro ao carregar o dashboard. Verifique o console do navegador (F12).');
    }
});

// ===== CLEANUP AO FECHAR =====
window.addEventListener('beforeunload', () => {
    if (window.dashboard) {
        window.dashboard.destroy();
    }
});