// Default data structure
const defaultData = {
    personal: {
        name: 'Илья',
        position: 'Fullstack Developer',
        heroSubtitle: 'Создаю веб-приложения и десктопные решения с фокусом на качество кода',
        aboutText1: 'Разработчик с широким стеком технологий — от веб-приложений до десктопных решений и мобильной разработки.',
        aboutText2: 'Работаю с современными фреймворками и языками программирования. Умею создавать как frontend, так и backend части приложений. Специализируюсь на React, десктопной разработке (Tauri, Electron, WPF) и мобильных приложениях на Android.'
    },
    stats: {
        projectsCount: 5,
        experienceYears: 7,
        stat3Label: '% Качества',
        stat3Value: 100
    },
    skills: [
        { category: 'Frontend & Frameworks', name: 'React', icon: '⚛️', progress: 100 },
        { category: 'Desktop Development', name: 'Tauri', icon: '🦀', progress: 100 },
        { category: 'Desktop Development', name: 'Electron', icon: '⚡', progress: 100 },
        { category: 'Desktop Development', name: 'WPF', icon: '🪟', progress: 100 },
        { category: 'Mobile Development', name: 'Android Studio', icon: '🤖', progress: 100 },
        { category: 'Mobile Development', name: 'Compose', icon: '🎨', progress: 100 },
        { category: 'Mobile Development', name: 'Kotlin', icon: '🔷', progress: 100 },
        { category: 'Languages', name: 'Python', icon: '🐍', progress: 100 },
        { category: 'Languages', name: 'C#', icon: '💜', progress: 100 },
        { category: 'Languages', name: 'C++', icon: '⚙️', progress: 100 },
        { category: 'Languages', name: 'Rust', icon: '🦀', progress: 100 },
        { category: 'Databases', name: 'MySQL', icon: '🗄️', progress: 100 },
        { category: 'Databases', name: 'PostgreSQL', icon: '🐘', progress: 100 }
    ],
    projects: [
        {
            name: 'Веб-приложения',
            description: 'Разработка современных веб-приложений с использованием React и современного стека',
            url: 'https://github.com/skanie',
            tags: ['React', 'JavaScript', 'Web'],
            gradient: '1'
        },
        {
            name: 'Десктопные приложения',
            description: 'Кроссплатформенные приложения на Tauri, Electron и WPF для различных задач',
            url: 'https://github.com/skanie',
            tags: ['Tauri', 'Rust', 'WPF'],
            gradient: '2'
        },
        {
            name: 'Мобильная разработка',
            description: 'Android-приложения с современным UI на Jetpack Compose и Kotlin',
            url: 'https://github.com/skanie',
            tags: ['Android', 'Kotlin', 'Compose'],
            gradient: '3'
        }
    ],
    contacts: {
        email: 'jabenkoila@gmail.com',
        github: 'https://github.com/skanie',
        telegram: '@ilyazhabenko',
        linkedin: ''
    },
    colors: {
        accent1: '#b38585',
        accent2: '#9d6b6b',
        accent3: '#d4a5a5'
    }
};

// Load data from localStorage or use defaults
let portfolioData = JSON.parse(localStorage.getItem('portfolioData')) || defaultData;

// Current editing state
let currentSkillIndex = null;
let currentProjectIndex = null;

// Initialize the admin panel
function init() {
    loadFormData();
    renderSkills();
    renderProjects();
    attachEventListeners();
}

// Load data into form fields
function loadFormData() {
    // Personal info
    document.getElementById('name').value = portfolioData.personal.name;
    document.getElementById('position').value = portfolioData.personal.position;
    document.getElementById('heroSubtitle').value = portfolioData.personal.heroSubtitle;
    document.getElementById('aboutText1').value = portfolioData.personal.aboutText1;
    document.getElementById('aboutText2').value = portfolioData.personal.aboutText2;

    // Stats
    document.getElementById('projectsCount').value = portfolioData.stats.projectsCount;
    document.getElementById('experienceYears').value = portfolioData.stats.experienceYears;
    document.getElementById('stat3Label').value = portfolioData.stats.stat3Label;
    document.getElementById('stat3Value').value = portfolioData.stats.stat3Value;

    // Contacts
    document.getElementById('contactEmail').value = portfolioData.contacts.email;
    document.getElementById('contactGithub').value = portfolioData.contacts.github;
    document.getElementById('contactTelegram').value = portfolioData.contacts.telegram;
    document.getElementById('contactLinkedin').value = portfolioData.contacts.linkedin;

    // Colors
    document.getElementById('colorAccent1').value = portfolioData.colors.accent1;
    document.getElementById('colorAccent2').value = portfolioData.colors.accent2;
    document.getElementById('colorAccent3').value = portfolioData.colors.accent3;
}

// Render skills list
function renderSkills() {
    const container = document.getElementById('skillsContainer');
    
    if (portfolioData.skills.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>Навыков пока нет. Добавьте первый!</p></div>';
        return;
    }

    const groupedSkills = portfolioData.skills.reduce((acc, skill, index) => {
        if (!acc[skill.category]) {
            acc[skill.category] = [];
        }
        acc[skill.category].push({ ...skill, index });
        return acc;
    }, {});

    container.innerHTML = Object.entries(groupedSkills).map(([category, skills]) => `
        <div class="skill-category-group">
            <h4 style="color: var(--accent); margin-bottom: 0.75rem;">${category}</h4>
            ${skills.map(skill => `
                <div class="skill-item" data-index="${skill.index}">
                    <div class="skill-info">
                        <span class="skill-icon">${skill.icon}</span>
                        <div class="skill-details">
                            <h4>${skill.name}</h4>
                            <p>${category}</p>
                        </div>
                    </div>
                    <div class="skill-progress-display">${skill.progress}%</div>
                </div>
            `).join('')}
        </div>
    `).join('');

    // Attach click handlers
    document.querySelectorAll('.skill-item').forEach(item => {
        item.addEventListener('click', () => {
            currentSkillIndex = parseInt(item.dataset.index);
            openSkillModal();
        });
    });
}

// Render projects list
function renderProjects() {
    const container = document.getElementById('projectsContainer');
    
    if (portfolioData.projects.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>Проектов пока нет. Добавьте первый!</p></div>';
        return;
    }

    container.innerHTML = portfolioData.projects.map((project, index) => `
        <div class="project-item" data-index="${index}">
            <div class="project-info-display">
                <h3>${project.name}</h3>
                <p>${project.description}</p>
                <div class="project-tags-display">
                    ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
                </div>
            </div>
        </div>
    `).join('');

    // Attach click handlers
    document.querySelectorAll('.project-item').forEach(item => {
        item.addEventListener('click', () => {
            currentProjectIndex = parseInt(item.dataset.index);
            openProjectModal();
        });
    });
}

// Open skill modal
function openSkillModal() {
    const modal = document.getElementById('skillModal');
    
    if (currentSkillIndex !== null) {
        const skill = portfolioData.skills[currentSkillIndex];
        document.getElementById('skillCategory').value = skill.category;
        document.getElementById('skillName').value = skill.name;
        document.getElementById('skillIcon').value = skill.icon;
        document.getElementById('skillProgress').value = skill.progress;
        document.getElementById('deleteSkillBtn').style.display = 'block';
    } else {
        document.getElementById('skillCategory').value = '';
        document.getElementById('skillName').value = '';
        document.getElementById('skillIcon').value = '';
        document.getElementById('skillProgress').value = 100;
        document.getElementById('deleteSkillBtn').style.display = 'none';
    }
    
    modal.classList.add('active');
}

// Open project modal
function openProjectModal() {
    const modal = document.getElementById('projectModal');
    
    if (currentProjectIndex !== null) {
        const project = portfolioData.projects[currentProjectIndex];
        document.getElementById('projectName').value = project.name;
        document.getElementById('projectDescription').value = project.description;
        document.getElementById('projectUrl').value = project.url;
        document.getElementById('projectTags').value = project.tags.join(', ');
        document.getElementById('projectGradient').value = project.gradient;
        document.getElementById('deleteProjectBtn').style.display = 'block';
    } else {
        document.getElementById('projectName').value = '';
        document.getElementById('projectDescription').value = '';
        document.getElementById('projectUrl').value = '';
        document.getElementById('projectTags').value = '';
        document.getElementById('projectGradient').value = '1';
        document.getElementById('deleteProjectBtn').style.display = 'none';
    }
    
    modal.classList.add('active');
}

// Close modals
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
    currentSkillIndex = null;
    currentProjectIndex = null;
}

// Save skill
function saveSkill() {
    const skill = {
        category: document.getElementById('skillCategory').value.trim(),
        name: document.getElementById('skillName').value.trim(),
        icon: document.getElementById('skillIcon').value.trim(),
        progress: parseInt(document.getElementById('skillProgress').value)
    };

    if (!skill.category || !skill.name || !skill.icon) {
        showNotification('Заполните все поля!', 'error');
        return;
    }

    if (currentSkillIndex !== null) {
        portfolioData.skills[currentSkillIndex] = skill;
    } else {
        portfolioData.skills.push(skill);
    }

    renderSkills();
    closeModal('skillModal');
    showNotification('Навык сохранён!');
}

// Delete skill
function deleteSkill() {
    if (currentSkillIndex !== null && confirm('Удалить этот навык?')) {
        portfolioData.skills.splice(currentSkillIndex, 1);
        renderSkills();
        closeModal('skillModal');
        showNotification('Навык удалён!');
    }
}

// Save project
function saveProject() {
    const project = {
        name: document.getElementById('projectName').value.trim(),
        description: document.getElementById('projectDescription').value.trim(),
        url: document.getElementById('projectUrl').value.trim(),
        tags: document.getElementById('projectTags').value.split(',').map(t => t.trim()).filter(t => t),
        gradient: document.getElementById('projectGradient').value
    };

    if (!project.name || !project.description || !project.url) {
        showNotification('Заполните все обязательные поля!', 'error');
        return;
    }

    if (currentProjectIndex !== null) {
        portfolioData.projects[currentProjectIndex] = project;
    } else {
        portfolioData.projects.push(project);
    }

    renderProjects();
    closeModal('projectModal');
    showNotification('Проект сохранён!');
}

// Delete project
function deleteProject() {
    if (currentProjectIndex !== null && confirm('Удалить этот проект?')) {
        portfolioData.projects.splice(currentProjectIndex, 1);
        renderProjects();
        closeModal('projectModal');
        showNotification('Проект удалён!');
    }
}

// Save all data
function saveAllData() {
    // Update data from form fields
    portfolioData.personal.name = document.getElementById('name').value.trim();
    portfolioData.personal.position = document.getElementById('position').value.trim();
    portfolioData.personal.heroSubtitle = document.getElementById('heroSubtitle').value.trim();
    portfolioData.personal.aboutText1 = document.getElementById('aboutText1').value.trim();
    portfolioData.personal.aboutText2 = document.getElementById('aboutText2').value.trim();

    portfolioData.stats.projectsCount = parseInt(document.getElementById('projectsCount').value) || 0;
    portfolioData.stats.experienceYears = parseInt(document.getElementById('experienceYears').value) || 0;
    portfolioData.stats.stat3Label = document.getElementById('stat3Label').value.trim();
    portfolioData.stats.stat3Value = parseInt(document.getElementById('stat3Value').value) || 0;

    portfolioData.contacts.email = document.getElementById('contactEmail').value.trim();
    portfolioData.contacts.github = document.getElementById('contactGithub').value.trim();
    portfolioData.contacts.telegram = document.getElementById('contactTelegram').value.trim();
    portfolioData.contacts.linkedin = document.getElementById('contactLinkedin').value.trim();

    portfolioData.colors.accent1 = document.getElementById('colorAccent1').value;
    portfolioData.colors.accent2 = document.getElementById('colorAccent2').value;
    portfolioData.colors.accent3 = document.getElementById('colorAccent3').value;

    // Save to localStorage
    localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
    
    showNotification('✓ Все изменения сохранены!');
}

// Reset to defaults
function resetToDefaults() {
    if (confirm('Вы уверены? Все данные будут сброшены к дефолтным значениям!')) {
        portfolioData = JSON.parse(JSON.stringify(defaultData));
        localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
        loadFormData();
        renderSkills();
        renderProjects();
        showNotification('Данные сброшены к дефолту!');
    }
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Attach event listeners
function attachEventListeners() {
    // Save button
    document.getElementById('saveBtn').addEventListener('click', saveAllData);

    // Reset button
    document.getElementById('resetBtn').addEventListener('click', resetToDefaults);

    // Add skill button
    document.getElementById('addSkillBtn').addEventListener('click', () => {
        currentSkillIndex = null;
        openSkillModal();
    });

    // Add project button
    document.getElementById('addProjectBtn').addEventListener('click', () => {
        currentProjectIndex = null;
        openProjectModal();
    });

    // Skill modal buttons
    document.getElementById('saveSkillBtn').addEventListener('click', saveSkill);
    document.getElementById('deleteSkillBtn').addEventListener('click', deleteSkill);
    document.getElementById('cancelSkillBtn').addEventListener('click', () => closeModal('skillModal'));

    // Project modal buttons
    document.getElementById('saveProjectBtn').addEventListener('click', saveProject);
    document.getElementById('deleteProjectBtn').addEventListener('click', deleteProject);
    document.getElementById('cancelProjectBtn').addEventListener('click', () => closeModal('projectModal'));

    // Close modals on X button
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            closeModal(modal.id);
        });
    });

    // Close modal on backdrop click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', init);

// Export data for main site
window.getPortfolioData = () => portfolioData;