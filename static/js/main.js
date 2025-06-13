// Simulação de banco de dados com localStorage
const db = {
    users: JSON.parse(localStorage.getItem('users')) || {
        'admin': { password: 'admin123', role: 'admin' },
        'funcionario': { password: 'func123', role: 'employee' }
    },
    points: JSON.parse(localStorage.getItem('points')) || {},
    justifications: JSON.parse(localStorage.getItem('justifications')) || {},
    activityLogs: JSON.parse(localStorage.getItem('activityLogs')) || []
};

function saveDB() {
    localStorage.setItem('users', JSON.stringify(db.users));
    localStorage.setItem('points', JSON.stringify(db.points));
    localStorage.setItem('justifications', JSON.stringify(db.justifications));
    localStorage.setItem('activityLogs', JSON.stringify(db.activityLogs));
}

// Elementos DOM
const welcomeSection = document.getElementById('welcome-section');
const loginSection = document.getElementById('login-section');
const employeeDashboard = document.getElementById('employee-dashboard');
const adminDashboard = document.getElementById('admin-dashboard');
const profile = document.getElementById('profile');
const notifications = document.getElementById('notifications');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const goToLoginBtn = document.getElementById('go-to-login-btn');
const infoBtn = document.getElementById('info-btn');
const clockInBtn = document.getElementById('clock-in-btn');
const justifyAbsenceBtn = document.getElementById('justify-absence-btn');
const justifyModal = document.getElementById('justify-modal');
const justifyText = document.getElementById('justify-text');
const submitJustifyBtn = document.getElementById('submit-justify-btn');
const cancelJustifyBtn = document.getElementById('cancel-justify-btn');
const addEmployeeBtn = document.getElementById('add-employee-btn');
const editEmployeeBtn = document.getElementById('edit-employee-btn');
const employeeSelect = document.getElementById('employee-select');
const editEmployeeSelect = document.getElementById('edit-employee-select');
const employeePoints = document.getElementById('employee-points');
const adminPoints = document.getElementById('admin-points');
const employeeJustifications = document.getElementById('employee-justifications');
const adminJustifications = document.getElementById('admin-justifications');
const adminActivityLogs = document.getElementById('admin-activity-logs');
const employeeCount = document.getElementById('employee-count');
const workedHours = document.getElementById('worked-hours');
const adminWorkedHours = document.getElementById('admin-worked-hours');
const notification = document.getElementById('notification');
const userInfo = document.getElementById('user-info');
const requestVacationBtn = document.getElementById('request-vacation-btn');
const adminExportReportBtn = document.getElementById('admin-export-report-btn');
const notificationList = document.getElementById('notification-list');
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const navMenu = document.getElementById('nav-menu');
const statsChart = document.getElementById('stats-chart').getContext('2d');
const adminStatsChart = document.getElementById('admin-stats-chart').getContext('2d');

let currentUser = null;
let statsChartInstance = null;
let adminStatsChartInstance = null;

function logActivity(user, action) {
    const timestamp = new Date().toLocaleString();
    db.activityLogs.push({ user, action, timestamp });
    saveDB();
}

function showNotification(message) {
    notification.textContent = message;
    notification.classList.remove('hidden');
    setTimeout(() => notification.classList.add('hidden'), 5000);
}

function calculateWorkedHours(points) {
    let totalMinutes = 0;
    for (let i = 0; i < points.length - 1; i += 2) {
        const entry = new Date(points[i].time);
        const exit = new Date(points[i + 1]?.time);
        if (exit) totalMinutes += (exit - entry) / (1000 * 60);
    }
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);
    return `${hours}h ${minutes}m`;
}

function updateEmployeeChart() {
    if (statsChartInstance) statsChartInstance.destroy();
    const points = db.points[currentUser] || [];
    const presenceRate = points.length > 0 ? (points.length / 20) * 100 : 0;
    statsChartInstance = new Chart(statsChart, {
        type: 'bar',
        data: {
            labels: ['Presença', 'Justificativas', 'Horas'],
            datasets: [{
                label: 'Estatísticas Pessoais',
                data: [presenceRate, (db.justifications[currentUser] || []).length, parseInt(calculateWorkedHours(points))],
                backgroundColor: ['#ff85a2', '#ffbcd1', '#e6f3fa']
            }]
        },
        options: { responsive: true }
    });
}

function updateAdminChart() {
    if (adminStatsChartInstance) adminStatsChartInstance.destroy();
    const totalPoints = Object.values(db.points).flat().length;
    const totalJustifications = Object.values(db.justifications).flat().length;
    adminStatsChartInstance = new Chart(adminStatsChart, {
        type: 'doughnut',
        data: {
            labels: ['Pontos Registrados', 'Justificativas', 'Funcionários'],
            datasets: [{
                label: 'Estatísticas Gerais',
                data: [totalPoints, totalJustifications, Object.keys(db.users).length - 1],
                backgroundColor: ['#ff85a2', '#ffbcd1', '#e6f3fa']
            }]
        },
        options: { responsive: true }
    });
}

function updateNavMenu() {
    if (db.users[currentUser].role === 'admin') {
        navMenu.innerHTML = `
            <a href="#admin-dashboard" class="text-pink-600 hover:text-pink-800">Admin Dashboard</a>
            <a href="#profile" class="text-pink-600 hover:text-pink-800">Perfil</a>
            <a href="#notifications" class="text-pink-600 hover:text-pink-800">Notificações</a>
            <button id="logout-btn" class="bg-red-500 text-white p-2 rounded hover:bg-red-600">Sair</button>
        `;
        mobileMenu.innerHTML = `
            <a href="#admin-dashboard" class="block text-pink-600 hover:text-pink-800">Admin Dashboard</a>
            <a href="#profile" class="block text-pink-600 hover:text-pink-800">Perfil</a>
            <a href="#notifications" class="block text-pink-600 hover:text-pink-800">Notificações</a>
        `;
    } else {
        navMenu.innerHTML = `
            <a href="#employee-dashboard" class="text-pink-600 hover:text-pink-800">Meu Dashboard</a>
            <a href="#profile" class="text-pink-600 hover:text-pink-800">Perfil</a>
            <a href="#notifications" class="text-pink-600 hover:text-pink-800">Notificações</a>
            <button id="logout-btn" class="bg-red-500 text-white p-2 rounded hover:bg-red-600">Sair</button>
        `;
        mobileMenu.innerHTML = `
            <a href="#employee-dashboard" class="block text-pink-600 hover:text-pink-800">Meu Dashboard</a>
            <a href="#profile" class="block text-pink-600 hover:text-pink-800">Perfil</a>
            <a href="#notifications" class="block text-pink-600 hover:text-pink-800">Notificações</a>
        `;
    }
    document.getElementById('logout-btn').addEventListener('click', logout);
}

goToLoginBtn.addEventListener('click', () => {
    welcomeSection.classList.add('hidden');
    loginSection.classList.remove('hidden');
});

infoBtn.addEventListener('click', () => {
    alert('Sistema de Ponto: Gerencie pontos e justificativas com estilo! 🌸');
});

function logout() {
    currentUser = null;
    employeeDashboard.classList.add('hidden');
    adminDashboard.classList.add('hidden');
    profile.classList.add('hidden');
    notifications.classList.add('hidden');
    welcomeSection.classList.remove('hidden');
    notification.classList.add('hidden');
}

loginBtn.addEventListener('click', () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    if (db.users[username] && db.users[username].password === password) {
        currentUser = username;
        loginSection.classList.add('hidden');
        updateNavMenu();
        if (db.users[username].role === 'admin') {
            adminDashboard.classList.remove('hidden');
            loadAdminData();
            updateAdminChart();
            const pendingJustifications = Object.keys(db.justifications).reduce((count, user) => count + db.justifications[user].filter(j => j.status === 'Pendente').length, 0);
            if (pendingJustifications > 0) showNotification(`Você tem ${pendingJustifications} justificativa(s) pendente(s)! 📋`);
        } else {
            employeeDashboard.classList.remove('hidden');
            loadEmployeeData();
            updateEmployeeChart();
            const pendingJustifications = (db.justifications[username] || []).filter(j => j.status === 'Pendente').length;
            if (pendingJustifications > 0) showNotification(`Você tem ${pendingJustifications} justificativa(s) pendente(s)! 📋`);
        }
        userInfo.textContent = `Usuário: ${username}, Role: ${db.users[username].role}`;
    } else {
        alert('Usuário ou senha inválidos');
    }
});

logoutBtn.addEventListener('click', logout);

clockInBtn.addEventListener('click', () => {
    const now = new Date().toLocaleString();
    if (!db.points[currentUser]) db.points[currentUser] = [];
    db.points[currentUser].push({ time: now, type: 'Entrada/Saída' });
    logActivity(currentUser, 'Bateu ponto');
    saveDB();
    loadEmployeeData();
    updateEmployeeChart();
    showNotification('Ponto registrado com sucesso! ⏰');
});

justifyAbsenceBtn.addEventListener('click', () => {
    justifyModal.classList.remove('hidden');
});

submitJustifyBtn.addEventListener('click', () => {
    const text = justifyText.value.trim();
    if (text) {
        if (!db.justifications[currentUser]) db.justifications[currentUser] = [];
        db.justifications[currentUser].push({ text, status: 'Pendente', date: new Date().toLocaleDateString() });
        logActivity(currentUser, 'Enviou justificativa');
        saveDB();
        justifyText.value = '';
        justifyModal.classList.add('hidden');
        loadEmployeeData();
        updateEmployeeChart();
        showNotification('Justificativa enviada com sucesso! 📝');
    } else {
        alert('Por favor, insira uma justificativa.');
    }
});

cancelJustifyBtn.addEventListener('click', () => {
    justifyText.value = '';
    justifyModal.classList.add('hidden');
});

addEmployeeBtn.addEventListener('click', () => {
    const name = document.getElementById('new-employee-name').value.trim();
    const password = document.getElementById('new-employee-password').value.trim();
    if (name && password && !db.users[name]) {
        db.users[name] = { password, role: 'employee' };
        logActivity(currentUser, `Adicionou funcionário: ${name}`);
        saveDB();
        loadAdminData();
        updateAdminChart();
        document.getElementById('new-employee-name').value = '';
        document.getElementById('new-employee-password').value = '';
        showNotification('Funcionário adicionado com sucesso! 🎉');
    } else {
        alert('Nome ou senha inválidos, ou usuário já existe.');
    }
});

editEmployeeBtn.addEventListener('click', () => {
    const selectedUser = editEmployeeSelect.value;
    const newPassword = document.getElementById('edit-employee-password').value.trim();
    if (selectedUser && newPassword) {
        db.users[selectedUser].password = newPassword;
        logActivity(currentUser, `Editou senha de ${selectedUser}`);
        saveDB();
        document.getElementById('edit-employee-password').value = '';
        showNotification('Senha atualizada com sucesso! 🔑');
    } else {
        alert('Selecione um funcionário e insira uma nova senha.');
    }
});

requestVacationBtn.addEventListener('click', () => {
    const days = prompt('Quantos dias de férias deseja solicitar?');
    if (days && !isNaN(days) && days > 0) {
        showNotification(`Solicitação de ${days} dia(s) de férias enviada! ✅`);
        if (!db.justifications[currentUser]) db.justifications[currentUser] = [];
        db.justifications[currentUser].push({ text: `Férias - ${days} dias`, status: 'Pendente', date: new Date().toLocaleDateString() });
        logActivity(currentUser, `Solicitou ${days} dias de férias`);
        saveDB();
    } else {
        alert('Digite um número válido de dias.');
    }
});

adminExportReportBtn.addEventListener('click', () => {
    const selectedUser = employeeSelect.value;
    if (!selectedUser) {
        alert('Por favor, selecione um funcionário para exportar o relatório.');
        return;
    }
    const points = db.points[selectedUser] || [];
    if (points.length === 0) {
        alert('Nenhum ponto registrado para este funcionário.');
        return;
    }
    const csv = 'Data,Hora,Tipo\n' + points.map(p => `${new Date(p.time).toLocaleDateString()},${new Date(p.time).toLocaleTimeString()},${p.type}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio_${selectedUser}.csv`;
    a.click();
    window.URL.revokeObjectURL(url); // Libera o objeto URL após o download
    logActivity(currentUser, `Exportou relatório de ${selectedUser}`);
    showNotification('Relatório exportado com sucesso! 📊');
});

function loadEmployeeData() {
    employeePoints.innerHTML = '';
    const points = db.points[currentUser] || [];
    points.forEach((point, index) => {
        const li = document.createElement('li');
        li.textContent = `${point.time} - ${point.type}`;
        employeePoints.appendChild(li);
    });
    workedHours.textContent = `Horas trabalhadas: ${calculateWorkedHours(points)}`;
    employeeJustifications.innerHTML = '';
    (db.justifications[currentUser] || []).forEach(j => {
        const li = document.createElement('li');
        li.textContent = `${j.date} - ${j.text} (${j.status})`;
        employeeJustifications.appendChild(li);
    });
    notificationList.innerHTML = '';
    const pendingJustifications = (db.justifications[currentUser] || []).filter(j => j.status === 'Pendente');
    pendingJustifications.forEach(j => {
        const li = document.createElement('li');
        li.textContent = `Justificativa pendente: ${j.text} (${j.date})`;
        notificationList.appendChild(li);
    });
}

function loadAdminData() {
    employeeCount.textContent = Object.keys(db.users).filter(user => db.users[user].role === 'employee').length;
    employeeSelect.innerHTML = '';
    editEmployeeSelect.innerHTML = '';
    Object.keys(db.users).forEach(user => {
        if (db.users[user].role === 'employee') {
            const option = document.createElement('option');
            option.value = user;
            option.textContent = user;
            employeeSelect.appendChild(option);
            const editOption = document.createElement('option');
            editOption.value = user;
            editOption.textContent = user;
            editEmployeeSelect.appendChild(editOption);
        }
    });

    employeeSelect.addEventListener('change', () => {
        const selectedUser = employeeSelect.value;
        adminPoints.innerHTML = '';
        const points = db.points[selectedUser] || [];
        points.forEach((point, index) => {
            const li = document.createElement('li');
            li.textContent = `${point.time} - ${point.type}`;
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Excluir';
            deleteBtn.className = 'ml-2 bg-red-500 text-white p-1 rounded hover:bg-red-600';
            deleteBtn.addEventListener('click', () => {
                db.points[selectedUser].splice(index, 1);
                if (db.points[selectedUser].length === 0) delete db.points[selectedUser];
                logActivity(currentUser, `Excluiu ponto de ${selectedUser}`);
                saveDB();
                loadAdminData();
                updateAdminChart();
                showNotification('Registro excluído! 🗑️');
            });
            li.appendChild(deleteBtn);
            adminPoints.appendChild(li);
        });
        adminWorkedHours.textContent = `Horas trabalhadas: ${calculateWorkedHours(points)}`;
    });

    adminJustifications.innerHTML = '';
    Object.keys(db.justifications).forEach(user => {
        db.justifications[user].forEach((j, index) => {
            const li = document.createElement('li');
            li.textContent = `${user} - ${j.date} - ${j.text} (${j.status})`;
            const approveBtn = document.createElement('button');
            approveBtn.textContent = 'Aprovar';
            approveBtn.className = 'ml-2 bg-green-500 text-white p-1 rounded hover:bg-green-600';
            approveBtn.addEventListener('click', () => {
                db.justifications[user][index].status = 'Aprovada';
                logActivity(currentUser, `Aprovou justificativa de ${user}`);
                saveDB();
                loadAdminData();
                loadEmployeeData();
                updateAdminChart();
                showNotification(`Justificativa de ${user} aprovada! ✅`);
            });
            const rejectBtn = document.createElement('button');
            rejectBtn.textContent = 'Rejeitar';
            rejectBtn.className = 'ml-2 bg-red-500 text-white p-1 rounded hover:bg-red-600';
            rejectBtn.addEventListener('click', () => {
                db.justifications[user][index].status = 'Rejeitada';
                logActivity(currentUser, `Rejeitou justificativa de ${user}`);
                saveDB();
                loadAdminData();
                loadEmployeeData();
                updateAdminChart();
                showNotification(`Justificativa de ${user} rejeitada! ❌`);
            });
            li.appendChild(approveBtn);
            li.appendChild(rejectBtn);
            adminJustifications.appendChild(li);
        });
    });

    adminActivityLogs.innerHTML = '';
    db.activityLogs.forEach(log => {
        const li = document.createElement('li');
        li.textContent = `${log.timestamp} - ${log.user}: ${log.action}`;
        adminActivityLogs.appendChild(li);
    });

    notificationList.innerHTML = '';
    Object.keys(db.justifications).forEach(user => {
        db.justifications[user].filter(j => j.status === 'Pendente').forEach(j => {
            const li = document.createElement('li');
            li.textContent = `Justificativa pendente de ${user}: ${j.text} (${j.date})`;
            notificationList.appendChild(li);
        });
    });
}

menuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        if (targetId === 'employee-dashboard' && db.users[currentUser].role !== 'employee') return;
        if (targetId === 'admin-dashboard' && db.users[currentUser].role !== 'admin') return;
        document.querySelectorAll('section').forEach(section => section.classList.add('hidden'));
        document.getElementById(targetId).classList.remove('hidden');
        if (targetId === 'employee-dashboard') {
            loadEmployeeData();
            updateEmployeeChart();
        } else if (targetId === 'admin-dashboard') {
            loadAdminData();
            updateAdminChart();
        }


    });
});