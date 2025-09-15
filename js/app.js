/**
 * Dashboard de Produtividade - Aplicação Principal
 * Sistema completo de gerenciamento de tarefas e produtividade
 * Versão corrigida e otimizada
 */

class ProductivityDashboard {
    constructor() {
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

    // ===== INICIALIZAÇÃO =====
    init() {
        this.loadFromStorage();
        this.setupEventListeners();
        this.updateClock();
        this.updateMetrics();
        this.renderTasks();
        this.updateWorkTimer();
        this.createWorkTimerControls();

        // Iniciar relógio
        setInterval(() => this.updateClock(), 1000);

        console.log('📊 Dashboard de Produtividade iniciado!');
    }

    setupEventListeners() {
        // Filtros de tarefas
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.filterTasks(e.target.dataset.filter);
            });
        });

        // Modal de nova tarefa
        const addTaskBtn = document.querySelector('.btn-add-task');
        if (addTaskBtn) {
            addTaskBtn.addEventListener('click', () => {
                this.openTaskModal();
            });
        }

        // Fechar modal
        const closeModalBtn = document.querySelector('.btn-close-modal');
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => {
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

        // Botão de refresh
        const refreshBtn = document.querySelector('.btn-refresh');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.refreshDashboard();
            });
        }

        // Teclas de atalho
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });
    }

    // ===== RELÓGIO EM TEMPO REAL =====
    updateClock() {
        const now = new Date();
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };

        const dateString = now.toLocaleDateString('pt-BR', options);
        const timeString = now.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });

        const dateElement = document.getElementById('current-date');
        if (dateElement) {
            dateElement.innerHTML = `${dateString} - ${timeString}`;
        }
    }

    // ===== SISTEMA DE TAREFAS =====
    createTask() {
        const titleInput = document.getElementById('task-title-input');
        const descriptionInput = document.getElementById('task-description-input');
        const priorityInput = document.getElementById('task-priority-input');
        const categoryInput = document.getElementById('task-category-input');
        const deadlineInput = document.getElementById('task-deadline-input');

        if (!titleInput) {
            this.showFeedback('Formulário não encontrado.', 'error');
            return;
        }

        const task = {
            id: this.generateId(),
            title: titleInput.value.trim(),
            description: descriptionInput?.value.trim() || '',
            priority: priorityInput?.value || 'medium',
            category: categoryInput?.value || 'trabalho',
            deadline: deadlineInput?.value || '',
            completed: false,
            createdAt: new Date().toISOString(),
            completedAt: null
        };

        if (!task.title) {
            this.showFeedback('Por favor, insira um título para a tarefa.', 'error');
            titleInput.focus();
            return;
        }

        this.tasks.unshift(task);
        this.saveToStorage();
        this.renderTasks();
        this.updateMetrics();
        this.closeTaskModal();

        this.showFeedback('Tarefa criada com sucesso!', 'success');
        setTimeout(() => this.animateNewTask(task.id), 100);
    }

    toggleTaskCompletion(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return;

        task.completed = !task.completed;
        task.completedAt = task.completed ? new Date().toISOString() : null;

        this.saveToStorage();
        this.renderTasks();
        this.updateMetrics();

        if (task.completed) {
            this.showFeedback('Tarefa concluída! 🎉', 'success');
            setTimeout(() => this.animateTaskCompletion(taskId), 100);
        } else {
            this.showFeedback('Tarefa desmarcada.', 'info');
        }
    }

    deleteTask(taskId) {
        if (!confirm('Tem certeza que deseja excluir esta tarefa?')) return;

        this.tasks = this.tasks.filter(t => t.id !== taskId);
        this.saveToStorage();
        this.renderTasks();
        this.updateMetrics();

        this.showFeedback('Tarefa excluída.', 'warning');
    }

    editTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return;

        // Preencher formulário com dados da tarefa
        const inputs = {
            'task-title-input': task.title,
            'task-description-input': task.description || '',
            'task-priority-input': task.priority,
            'task-category-input': task.category,
            'task-deadline-input': task.deadline || ''
        };

        Object.entries(inputs).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.value = value;
            }
        });

        // Marcar como modo de edição
        const modal = document.getElementById('task-modal');
        if (modal) {
            modal.dataset.editingTaskId = taskId;
            modal.querySelector('h3').textContent = 'Editar Tarefa';
        }

        // Abrir modal
        this.openTaskModal();
    }

    filterTasks(filter) {
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

            if (show) {
                element.classList.add('fade-in');
            }
        });
    }

    renderTasks() {
        const tasksList = document.getElementById('tasks-list');
        if (!tasksList) return;

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
            const element = document.querySelector(`[data-task-id="${task.id}"]`);
            if (!element) return;

            // Checkbox
            const checkbox = element.querySelector('.task-checkbox');
            if (checkbox) {
                checkbox.addEventListener('click', () => {
                    this.toggleTaskCompletion(task.id);
                });
            }

            // Botão de editar
            const editBtn = element.querySelector('.btn-task-edit');
            if (editBtn) {
                editBtn.addEventListener('click', () => {
                    this.editTask(task.id);
                });
            }

            // Botão de excluir
            const deleteBtn = element.querySelector('.btn-task-delete');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', () => {
                    this.deleteTask(task.id);
                });
            }
        });
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
                    <button class="btn-task-edit tooltip" data-tooltip="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-task-delete tooltip" data-tooltip="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }

    // ===== CONTADOR DE TEMPO DE TRABALHO =====
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
        document.getElementById('start-work-btn')?.addEventListener('click', () => {
            this.startWorkSession();
        });

        document.getElementById('stop-work-btn')?.addEventListener('click', () => {
            this.stopWorkSession();
        });

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

        this.showFeedback('Sessão de trabalho iniciada! ⏰', 'info');

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

        // Calcular duração antes de resetar currentSession
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

        this.showFeedback(`Sessão finalizada! ${sessionMinutes} minutos registrados. 📊`, 'success');
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
                element.classList.add('data-loaded');
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

        // Simplified calculation - in real app would check consecutive days
        return hasTasksToday ? Math.max(this.metrics.streakDays || 1, 1) : 0;
    }

    // ===== SALVAMENTO EM LOCALSTORAGE =====
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

    clearStorage() {
        if (!confirm('Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.')) return;

        localStorage.removeItem('productivityDashboard');
        this.tasks = [];
        this.workingSessions = [];
        this.currentSession = null;
        this.metrics = {
            tasksCompleted: 0,
            productiveHours: 0,
            goalsAchieved: 0,
            streakDays: 0
        };

        if (this.workTimerInterval) {
            clearInterval(this.workTimerInterval);
            this.workTimerInterval = null;
        }

        this.renderTasks();
        this.updateMetrics();
        this.updateWorkTimer();
        this.updateTimerButtons();
        this.showFeedback('Dados limpos com sucesso!', 'info');
    }

    // ===== ANIMAÇÕES DE FEEDBACK VISUAL =====
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

    animateNewTask(taskId) {
        const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
        if (taskElement) {
            taskElement.classList.add('bounce-in');
        }
    }

    animateTaskCompletion(taskId) {
        const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
        if (taskElement) {
            taskElement.classList.add('success-check');

            // Efeito de confetti
            this.createConfetti(taskElement);
        }
    }

    createConfetti(element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        for (let i = 0; i < 10; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                left: ${centerX}px;
                top: ${centerY}px;
                width: 8px;
                height: 8px;
                background: hsl(${Math.random() * 360}, 70%, 60%);
                border-radius: 50%;
                pointer-events: none;
                z-index: 10000;
            `;

            document.body.appendChild(confetti);

            // Animação do confetti
            const animation = confetti.animate([
                {
                    transform: 'translate(0, 0) rotate(0deg)',
                    opacity: 1
                },
                {
                    transform: `translate(${(Math.random() - 0.5) * 200}px, ${Math.random() * 100 + 50}px) rotate(${Math.random() * 360}deg)`,
                    opacity: 0
                }
            ], {
                duration: 1000,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            });

            animation.addEventListener('finish', () => confetti.remove());
        }
    }

    showLoadingAnimation() {
        const sections = ['.metrics-section', '.charts-section', '.tasks-section'];

        sections.forEach((selector, index) => {
            const section = document.querySelector(selector);
            if (section) {
                // Aplicar apenas uma animação suave sem alterar opacidade
                section.style.transform = 'translateY(20px)';
                section.style.transition = 'transform 0.6s ease-out, opacity 0.6s ease-out';
                
                setTimeout(() => {
                    section.style.transform = 'translateY(0)';
                    section.style.opacity = '1';
                }, index * 150);
            }
        });
    }

    // ===== MODAL DE TAREFAS =====
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

            // Reset do modo de edição
            if (modal.dataset.editingTaskId) {
                delete modal.dataset.editingTaskId;
                modal.querySelector('h3').textContent = 'Nova Tarefa';
            }
        }
    }

    // ===== REFRESH DO DASHBOARD =====
    refreshDashboard() {
        const refreshBtn = document.querySelector('.btn-refresh');
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
        }, 1500);
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

        // Ctrl/Cmd + R: Refresh
        if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
            e.preventDefault();
            this.refreshDashboard();
        }

        // Ctrl/Cmd + Shift + C: Limpar dados
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
            e.preventDefault();
            this.clearStorage();
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

    getFeedbackIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    // ===== MÉTODOS DE EXPORTAÇÃO E IMPORTAÇÃO =====
    exportData() {
        const data = {
            tasks: this.tasks,
            workingSessions: this.workingSessions,
            metrics: this.metrics,
            exportedAt: new Date().toISOString(),
            version: '1.0'
        };

        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `dashboard-produtividade-${new Date().toISOString().split('T')[0]}.json`;
        link.click();

        this.showFeedback('Dados exportados com sucesso!', 'success');
    }

    importData(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);

                // Validar estrutura básica
                if (data.tasks && Array.isArray(data.tasks)) {
                    if (confirm('Importar dados irá sobrescrever os dados atuais. Continuar?')) {
                        this.tasks = data.tasks;
                        this.workingSessions = data.workingSessions || [];
                        this.metrics = data.metrics || this.metrics;

                        this.saveToStorage();
                        this.renderTasks();
                        this.updateMetrics();

                        this.showFeedback('Dados importados com sucesso!', 'success');
                    }
                } else {
                    this.showFeedback('Arquivo inválido. Verifique o formato.', 'error');
                }
            } catch (error) {
                console.error('Erro ao importar:', error);
                this.showFeedback('Erro ao processar arquivo.', 'error');
            }
        };

        reader.readAsText(file);
    }

    // ===== ESTATÍSTICAS AVANÇADAS =====
    getDetailedStats() {
        const stats = {
            totalTasks: this.tasks.length,
            completedTasks: this.tasks.filter(t => t.completed).length,
            pendingTasks: this.tasks.filter(t => !t.completed).length,
            highPriorityTasks: this.tasks.filter(t => t.priority === 'high').length,
            totalWorkingSessions: this.workingSessions.length,
            totalWorkingTimeMs: this.workingSessions.reduce((total, session) => total + (session.duration || 0), 0),
            averageSessionLength: 0,
            longestSession: 0,
            shortestSession: 0,
            categoriesStats: {},
            dailyAverages: this.calculateDailyAverages()
        };

        // Calcular médias de sessão
        if (stats.totalWorkingSessions > 0) {
            stats.averageSessionLength = Math.round(stats.totalWorkingTimeMs / stats.totalWorkingSessions / 60000); // em minutos
            stats.longestSession = Math.max(...this.workingSessions.map(s => s.duration || 0)) / 60000; // em minutos
            stats.shortestSession = Math.min(...this.workingSessions.map(s => s.duration || 0)) / 60000; // em minutos
        }

        // Estatísticas por categoria
        const categories = ['trabalho', 'pessoal', 'estudo', 'saude'];
        categories.forEach(category => {
            const categoryTasks = this.tasks.filter(t => t.category === category);
            stats.categoriesStats[category] = {
                total: categoryTasks.length,
                completed: categoryTasks.filter(t => t.completed).length,
                completionRate: categoryTasks.length > 0 ? Math.round((categoryTasks.filter(t => t.completed).length / categoryTasks.length) * 100) : 0
            };
        });

        return stats;
    }

    calculateDailyAverages() {
        if (this.tasks.length === 0) return { tasksPerDay: 0, workingHoursPerDay: 0 };

        // Calcular número de dias únicos com atividade
        const daysWithTasks = new Set();
        this.tasks.forEach(task => {
            if (task.createdAt) {
                daysWithTasks.add(new Date(task.createdAt).toDateString());
            }
        });

        const daysWithSessions = new Set();
        this.workingSessions.forEach(session => {
            if (session.startTime) {
                daysWithSessions.add(new Date(session.startTime).toDateString());
            }
        });

        const totalActiveDays = Math.max(daysWithTasks.size, daysWithSessions.size, 1);

        return {
            tasksPerDay: Math.round((this.tasks.length / totalActiveDays) * 10) / 10,
            workingHoursPerDay: Math.round((this.workingSessions.reduce((total, session) => total + (session.duration || 0), 0) / 3600000 / totalActiveDays) * 10) / 10
        };
    }

    // ===== MÉTODOS DE FILTRO AVANÇADO =====
    searchTasks(query) {
        if (!query.trim()) {
            // Mostrar todas as tarefas se busca vazia
            this.filterTasks('all');
            return;
        }

        const searchTerm = query.toLowerCase().trim();
        const taskElements = document.querySelectorAll('.task-item');

        taskElements.forEach(element => {
            const taskId = element.dataset.taskId;
            const task = this.tasks.find(t => t.id === taskId);

            if (!task) return;

            const matchesSearch =
                task.title.toLowerCase().includes(searchTerm) ||
                (task.description && task.description.toLowerCase().includes(searchTerm)) ||
                this.getCategoryText(task.category).toLowerCase().includes(searchTerm) ||
                this.getPriorityText(task.priority).toLowerCase().includes(searchTerm);

            element.style.display = matchesSearch ? 'flex' : 'none';
        });
    }

    sortTasks(criteria) {
        let sortedTasks = [...this.tasks];

        switch (criteria) {
            case 'title':
                sortedTasks.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'created':
                sortedTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case 'priority':
                const priorityOrder = { high: 3, medium: 2, low: 1 };
                sortedTasks.sort((a, b) => (priorityOrder[b.priority] || 2) - (priorityOrder[a.priority] || 2));
                break;
            case 'deadline':
                sortedTasks.sort((a, b) => {
                    if (!a.deadline && !b.deadline) return 0;
                    if (!a.deadline) return 1;
                    if (!b.deadline) return -1;
                    return new Date(a.deadline) - new Date(b.deadline);
                });
                break;
            case 'completed':
                sortedTasks.sort((a, b) => a.completed === b.completed ? 0 : a.completed ? 1 : -1);
                break;
            default:
                // Manter ordem original
                break;
        }

        this.tasks = sortedTasks;
        this.renderTasks();
        this.saveToStorage();
    }

    // ===== NOTIFICAÇÕES E LEMBRETES =====
    checkTaskDeadlines() {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const urgentTasks = this.tasks.filter(task => {
            if (!task.deadline || task.completed) return false;

            const deadline = new Date(task.deadline);
            return deadline <= tomorrow;
        });

        if (urgentTasks.length > 0) {
            const message = urgentTasks.length === 1
                ? `Atenção: "${urgentTasks[0].title}" vence em breve!`
                : `Atenção: ${urgentTasks.length} tarefas vencem em breve!`;

            this.showFeedback(message, 'warning');
        }
    }

    // ===== MODO ESCURO/CLARO =====
    toggleTheme() {
        const body = document.body;
        const isDark = body.classList.contains('dark-theme');

        if (isDark) {
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
        } else {
            body.classList.add('dark-theme');
            body.classList.remove('light-theme');
        }

        // Salvar preferência
        localStorage.setItem('dashboardTheme', isDark ? 'light' : 'dark');
        this.showFeedback(`Tema ${isDark ? 'claro' : 'escuro'} ativado!`, 'info');
    }

    loadThemePreference() {
        const savedTheme = localStorage.getItem('dashboardTheme');
        if (savedTheme) {
            document.body.classList.add(savedTheme + '-theme');
        }
    }

    // ===== PRODUTIVIDADE E INSIGHTS =====
    getProductivityInsights() {
        const stats = this.getDetailedStats();
        const insights = [];

        // Insight sobre taxa de conclusão
        const completionRate = stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0;
        if (completionRate >= 80) {
            insights.push('🎉 Excelente! Você tem uma alta taxa de conclusão de tarefas.');
        } else if (completionRate >= 60) {
            insights.push('👍 Boa taxa de conclusão! Continue assim.');
        } else if (completionRate < 40) {
            insights.push('💡 Considere revisar suas metas - talvez esteja assumindo muitas tarefas.');
        }

        // Insight sobre horas trabalhadas
        if (stats.dailyAverages.workingHoursPerDay > 6) {
            insights.push('⚠️ Você está trabalhando muitas horas. Lembre-se de fazer pausas!');
        } else if (stats.dailyAverages.workingHoursPerDay < 2) {
            insights.push('📈 Considere aumentar seu tempo de foco para maior produtividade.');
        }

        // Insight sobre categorias
        const workCategory = stats.categoriesStats.trabalho;
        const personalCategory = stats.categoriesStats.pessoal;

        if (workCategory.total > personalCategory.total * 3) {
            insights.push('⚖️ Considere balancear melhor tarefas pessoais e profissionais.');
        }

        return insights;
    }

    showProductivityReport() {
        const stats = this.getDetailedStats();
        const insights = this.getProductivityInsights();

        // Criar modal de relatório
        const reportModal = document.createElement('div');
        reportModal.className = 'modal-overlay active';
        reportModal.innerHTML = `
                    <div class="modal-content report-modal">
                        <div class="modal-header">
                            <h3>📊 Relatório de Produtividade</h3>
                            <button class="btn-close-modal" onclick="this.closest('.modal-overlay').remove()">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        <div class="report-content">
                            <div class="stats-grid">
                                <div class="stat-item">
                                    <h4>Total de Tarefas</h4>
                                    <span class="stat-value">${stats.totalTasks}</span>
                                </div>
                                <div class="stat-item">
                                    <h4>Taxa de Conclusão</h4>
                                    <span class="stat-value">${Math.round((stats.completedTasks / Math.max(stats.totalTasks, 1)) * 100)}%</span>
                                </div>
                                <div class="stat-item">
                                    <h4>Sessões de Trabalho</h4>
                                    <span class="stat-value">${stats.totalWorkingSessions}</span>
                                </div>
                                <div class="stat-item">
                                    <h4>Tempo Total Trabalhado</h4>
                                    <span class="stat-value">${Math.round(stats.totalWorkingTimeMs / 3600000 * 10) / 10}h</span>
                                </div>
                            </div>
                            
                            <div class="insights-section">
                                <h4>💡 Insights</h4>
                                ${insights.map(insight => `<p class="insight-item">${insight}</p>`).join('')}
                            </div>
                            
                            <div class="actions-section">
                                <button onclick="window.dashboard.exportData()" class="btn-export">
                                    <i class="fas fa-download"></i> Exportar Dados
                                </button>
                            </div>
                        </div>
                    </div>
                `;

        // Estilos inline para o modal de relatório
        reportModal.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(10, 10, 15, 0.95);
                    backdrop-filter: blur(10px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 2000;
                    padding: 20px;
                `;

        document.body.appendChild(reportModal);

        // Fechar ao clicar fora
        reportModal.addEventListener('click', (e) => {
            if (e.target === reportModal) {
                reportModal.remove();
            }
        });
    }

    // ===== CLEANUP E DESTRUIÇÃO =====
    destroy() {
        // Limpar intervals
        if (this.workTimerInterval) {
            clearInterval(this.workTimerInterval);
        }

        // Remover event listeners globais
        document.removeEventListener('keydown', this.handleKeyboardShortcuts);

        // Salvar dados finais
        this.saveToStorage();

        console.log('📊 Dashboard destruído e dados salvos.');
    }
}

// ===== INICIALIZAÇÃO GLOBAL =====
document.addEventListener('DOMContentLoaded', () => {
    // Verificar suporte a recursos necessários
    if (!window.localStorage) {
        alert('Seu navegador não suporta localStorage. Algumas funcionalidades podem não funcionar.');
        return;
    }

    // Inicializar dashboard
    window.dashboard = new ProductivityDashboard();

    // Mostrar animação após tudo carregado
    setTimeout(() => {
        window.dashboard.showLoadingAnimation();
    }, 300);

    // Verificar deadlines a cada 30 minutos
    setInterval(() => {
        window.dashboard.checkTaskDeadlines();
    }, 30 * 60 * 1000);

    // Adicionar comando de teste global (apenas para desenvolvimento)
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
    console.log('📋 Comandos disponíveis:');
    console.log('  - window.dashboard.exportData() // Exportar dados');
    console.log('  - window.dashboard.showProductivityReport() // Mostrar relatório');
    console.log('  - window.dashboard.clearStorage() // Limpar dados');
});

// ===== CLEANUP AO FECHAR =====
window.addEventListener('beforeunload', () => {
    if (window.dashboard) {
        window.dashboard.destroy();
    }
});

// ===== EXPORTAR PARA GLOBAL =====
window.ProductivityDashboard = ProductivityDashboard;