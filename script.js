// ============================================
// CADERNO DIGITAL - SCRIPT PRINCIPAL
// ============================================

let activities = [];
let currentActivityId = null;

// ============================================
// INICIALIZAÇÃO
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    loadActivities();
    renderActivitiesTabs();
    setDefaultDate();
});

// ============================================
// CARREGAR ATIVIDADES
// ============================================

function loadActivities() {
    // Tentar carregar do localStorage primeiro
    const savedActivities = localStorage.getItem('activities');
    
    if (savedActivities) {
        activities = JSON.parse(savedActivities);
    } else {
        // Carregar do arquivo de configuração padrão
        fetch('activities-config.json')
            .then(response => response.json())
            .then(data => {
                activities = data.activities;
                saveActivitiesToStorage();
            })
            .catch(error => {
                console.warn('Não foi possível carregar activities-config.json:', error);
                activities = [];
            });
    }
}

// ============================================
// SALVAR ATIVIDADES NO LOCALSTORAGE
// ============================================

function saveActivitiesToStorage() {
    localStorage.setItem('activities', JSON.stringify(activities));
}

// ============================================
// RENDERIZAR ABAS DE ATIVIDADES
// ============================================

function renderActivitiesTabs() {
    const tabsGrid = document.getElementById('tabs-grid');
    tabsGrid.innerHTML = '';

    if (activities.length === 0) {
        tabsGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #999;">
                <p style="font-size: 1.1rem; margin-bottom: 10px;">Nenhuma atividade adicionada ainda</p>
                <p style="font-size: 0.9rem;">Clique em "Nova Atividade" para começar!</p>
            </div>
        `;
        return;
    }

    activities.forEach((activity, index) => {
        const tab = createTabCard(activity);
        tabsGrid.appendChild(tab);
        
        // Adicionar animação escalonada
        tab.style.animation = `slideInLeft 0.4s ease-out ${index * 0.1}s both`;
    });
}

// ============================================
// CRIAR CARD DE ABA
// ============================================

function createTabCard(activity) {
    const card = document.createElement('div');
    card.className = 'tab-card';
    card.style.borderLeftColor = activity.color;
    
    // Formatar data
    const dateObj = new Date(activity.date);
    const formattedDate = dateObj.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    card.innerHTML = `
        <div class="tab-title">
            <span class="tab-color-indicator" style="background-color: ${activity.color};"></span>
            ${activity.title}
        </div>
        <p class="tab-description">${activity.description}</p>
        <div class="tab-meta">
            <span class="tab-subject">${activity.subject}</span>
            <span class="tab-date">${formattedDate}</span>
        </div>
    `;

    card.addEventListener('click', () => openActivity(activity.id));
    
    return card;
}

// ============================================
// ABRIR ATIVIDADE
// ============================================

function openActivity(activityId) {
    const activity = activities.find(a => a.id === activityId);
    
    if (!activity) {
        console.error('Atividade não encontrada:', activityId);
        return;
    }

    currentActivityId = activityId;

    // Atualizar informações
    document.getElementById('activity-title').textContent = activity.title;
    
    const dateObj = new Date(activity.date);
    const formattedDate = dateObj.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    
    document.getElementById('activity-meta').innerHTML = `
        <strong>${activity.subject}</strong> • ${formattedDate}
    `;

    // Carregar conteúdo
    loadActivityContent(activity.contentPath);

    // Alternar visualização
    document.getElementById('activities-view').classList.remove('active');
    document.getElementById('activity-view').classList.add('active');
}

// ============================================
// CARREGAR CONTEÚDO DA ATIVIDADE
// ============================================

function loadActivityContent(contentPath) {
    const contentContainer = document.getElementById('activity-content');
    
    // Verificar extensão do arquivo
    const fileExtension = contentPath.split('.').pop().toLowerCase();

    if (fileExtension === 'html') {
        // Para arquivos HTML, usar iframe
        contentContainer.innerHTML = `<iframe src="${contentPath}"></iframe>`;
    } else if (fileExtension === 'md') {
        // Para Markdown, carregar e converter
        fetch(contentPath)
            .then(response => response.text())
            .then(markdown => {
                const html = markdownToHtml(markdown);
                contentContainer.innerHTML = html;
            })
            .catch(error => {
                contentContainer.innerHTML = `<p style="color: red;">Erro ao carregar arquivo: ${error.message}</p>`;
            });
    } else {
        // Para outros tipos, tentar carregar como texto
        fetch(contentPath)
            .then(response => response.text())
            .then(content => {
                contentContainer.innerHTML = `<pre><code>${escapeHtml(content)}</code></pre>`;
            })
            .catch(error => {
                contentContainer.innerHTML = `<p style="color: red;">Erro ao carregar arquivo: ${error.message}</p>`;
            });
    }
}

// ============================================
// CONVERTER MARKDOWN PARA HTML (SIMPLES)
// ============================================

function markdownToHtml(markdown) {
    let html = markdown;

    // Títulos
    html = html.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.*?)$/gm, '<h1>$1</h1>');

    // Negrito
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Itálico
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Código inline
    html = html.replace(/`(.*?)`/g, '<code>$1</code>');

    // Blocos de código
    html = html.replace(/```(.*?)```/gs, '<pre><code>$1</code></pre>');

    // Listas não ordenadas
    html = html.replace(/^\* (.*?)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*?<\/li>)/s, '<ul>$1</ul>');

    // Parágrafos
    html = html.split('\n\n').map(para => {
        if (!para.match(/<[^>]+>/)) {
            return `<p>${para}</p>`;
        }
        return para;
    }).join('');

    return html;
}

// ============================================
// VOLTAR PARA ATIVIDADES
// ============================================

function backToActivities() {
    currentActivityId = null;
    document.getElementById('activity-view').classList.remove('active');
    document.getElementById('activities-view').classList.add('active');
}

// ============================================
// MODAL - ADICIONAR ATIVIDADE
// ============================================

function showAddActivityForm() {
    document.getElementById('add-activity-modal').classList.add('active');
}

function closeAddActivityForm() {
    document.getElementById('add-activity-modal').classList.remove('active');
    document.getElementById('add-activity-form').reset();
}

// Fechar modal ao clicar fora
document.addEventListener('click', (event) => {
    const modal = document.getElementById('add-activity-modal');
    if (event.target === modal) {
        closeAddActivityForm();
    }
});

// ============================================
// ADICIONAR NOVA ATIVIDADE
// ============================================

function addNewActivity(event) {
    event.preventDefault();

    const newActivity = {
        id: `activity-${Date.now()}`,
        title: document.getElementById('new-title').value,
        description: document.getElementById('new-description').value,
        subject: document.getElementById('new-subject').value,
        date: document.getElementById('new-date').value,
        contentPath: document.getElementById('new-content-path').value,
        color: document.getElementById('new-color').value
    };

    activities.push(newActivity);
    saveActivitiesToStorage();
    renderActivitiesTabs();
    closeAddActivityForm();

    // Mostrar feedback visual
    showNotification('Atividade adicionada com sucesso!');
}

// ============================================
// NOTIFICAÇÃO
// ============================================

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #27AE60 0%, #229954 100%);
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        z-index: 2000;
        animation: slideInRight 0.3s ease-out;
        font-weight: 600;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideInLeft 0.3s ease-out reverse';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ============================================
// UTILITÁRIOS
// ============================================

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

function setDefaultDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('new-date').value = today;
}

// ============================================
// ADICIONAR ESTILOS DE ANIMAÇÃO AO HEAD
// ============================================

const style = document.createElement('style');
style.textContent = `
    @keyframes slideInLeft {
        from {
            opacity: 0;
            transform: translateX(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(20px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
`;
document.head.appendChild(style);
