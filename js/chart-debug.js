/**
 * Sistema de Debug para Gráficos
 * Monitora quando os gráficos desaparecem
 */

function setupChartMonitoring() {
    console.log('🔍 Iniciando monitoramento de gráficos...');
    
    const chartIds = [
        'productivity-chart',
        'time-distribution-chart',
        'monthly-progress-chart',
        'task-categories-chart'
    ];
    
    let lastCheck = {};
    
    function checkCharts() {
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
            
            // Detectar mudanças
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
                if (prev.width !== status.width || prev.height !== status.height) {
                    console.warn(`🚨 Canvas ${id} mudou tamanho: ${prev.width}x${prev.height} → ${status.width}x${status.height}`);
                }
            }
            
            lastCheck[id] = status;
        });
    }
    
    // Verificar a cada 500ms
    setInterval(checkCharts, 500);
    
    // Verificação inicial
    setTimeout(checkCharts, 100);
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