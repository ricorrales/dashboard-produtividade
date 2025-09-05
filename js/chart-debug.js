/**
 * Sistema de Debug para Gráficos
 * Monitora quando os gráficos desaparecem
 */

function setupChartMonitoring() {
    console.log('🔍 Iniciando monitoramento de gráficos e métricas...');
    
    const chartIds = [
        'productivity-chart',
        'time-distribution-chart',
        'monthly-progress-chart',
        'task-categories-chart'
    ];
    
    const metricIds = [
        'tasks-completed',
        'productive-hours', 
        'goals-achieved',
        'streak-days'
    ];
    
    let lastCheck = {};
    
    function checkElements() {
        // Debug inicial para verificar se elementos existem
        if (!lastCheck.initialCheck) {
            console.log('🔍 Verificação inicial dos elementos:');
            chartIds.forEach(id => {
                const canvas = document.getElementById(id);
                console.log(`📊 Canvas ${id}:`, !!canvas, canvas ? `${canvas.offsetWidth}x${canvas.offsetHeight}` : 'não encontrado');
            });
            metricIds.forEach(id => {
                const element = document.getElementById(id);
                const parentCard = element ? element.closest('.metric-card') : null;
                console.log(`📈 Métrica ${id}:`, !!element, element ? `"${element.textContent.trim()}"` : 'não encontrado');
                console.log(`📦 Container métrica ${id}:`, !!parentCard, parentCard ? 'encontrado' : 'não encontrado');
            });
            
            // Verificar se a grid de métricas existe
            const metricsGrid = document.querySelector('.metrics-grid');
            console.log('📊 Grid de métricas:', !!metricsGrid, metricsGrid ? `${metricsGrid.children.length} cards` : 'não encontrada');
            
            lastCheck.initialCheck = true;
        }
        
        // Verificar gráficos
        chartIds.forEach(id => {
            const canvas = document.getElementById(id);
            const exists = !!canvas;
            const visible = canvas && canvas.offsetWidth > 0 && canvas.offsetHeight > 0;
            const hasChart = canvas && canvas.chart !== undefined;
            
            const status = {
                exists,
                visible,
                hasChart,
                width: canvas ? canvas.offsetWidth : 0,
                height: canvas ? canvas.offsetHeight : 0
            };
            
            // Detectar mudanças significativas
            if (lastCheck[id]) {
                const prev = lastCheck[id];
                if (prev.exists !== exists) {
                    console.warn(`🚨 Canvas ${id} mudou existência: ${prev.exists} → ${exists}`);
                }
                if (prev.visible !== visible) {
                    console.warn(`🚨 Canvas ${id} mudou visibilidade: ${prev.visible} → ${visible}`);
                }
                if (prev.hasChart !== hasChart) {
                    console.warn(`🚨 Canvas ${id} mudou gráfico: ${prev.hasChart} → ${hasChart}`);
                }
                
                // Só alertar sobre mudanças de tamanho significativas (>10px ou zero)
                const widthDiff = Math.abs(prev.width - status.width);
                const heightDiff = Math.abs(prev.height - status.height);
                if ((widthDiff > 10 || heightDiff > 10) || (status.width === 0 || status.height === 0)) {
                    console.warn(`🚨 Canvas ${id} mudou tamanho: ${prev.width}x${prev.height} → ${status.width}x${status.height}`);
                }
            }
            
            lastCheck[id] = status;
        });
        
        // Verificar métricas
        metricIds.forEach(id => {
            const element = document.getElementById(id);
            const exists = !!element;
            const visible = element && element.offsetWidth > 0 && element.offsetHeight > 0;
            const hasContent = element && element.textContent && element.textContent.trim() !== '';
            const content = element ? element.textContent.trim() : '';
            
            const status = {
                exists,
                visible,
                hasContent,
                content
            };
            
            // Detectar mudanças nas métricas
            if (lastCheck[`metric-${id}`]) {
                const prev = lastCheck[`metric-${id}`];
                if (prev.exists !== exists) {
                    console.warn(`📊 Métrica ${id} mudou existência: ${prev.exists} → ${exists}`);
                }
                if (prev.visible !== visible) {
                    console.warn(`📊 Métrica ${id} mudou visibilidade: ${prev.visible} → ${visible}`);
                }
                if (prev.hasContent !== hasContent) {
                    console.warn(`📊 Métrica ${id} mudou conteúdo: ${prev.hasContent} → ${hasContent}`);
                }
                if (prev.content !== content && content !== '') {
                    console.log(`📈 Métrica ${id} atualizada: "${prev.content}" → "${content}"`);
                }
            }
            
            lastCheck[`metric-${id}`] = status;
        });
    }
    
    // Verificar a cada 500ms
    setInterval(checkElements, 500);
    
    // Verificação inicial
    setTimeout(checkElements, 100);
}

// Auto-iniciar em desenvolvimento
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(setupChartMonitoring, 2000);
        });
    } else {
        setTimeout(setupChartMonitoring, 2000);
    }
}