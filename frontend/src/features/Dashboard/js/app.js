(function () {
  // 🔐 Protege a rota: exige autenticação
  const rawAuth = localStorage.getItem('auth') || sessionStorage.getItem('auth');
  if (!rawAuth) {
    window.location.href = '../login/index.html';
    return;
  }
  const { user } = JSON.parse(rawAuth);


  const chip = document.getElementById('userChip');
  if (user && chip) {
    const initials = (user.name || user.email || 'U')
      .split(' ')
      .map(p => p[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
    chip.textContent = initials;
    chip.title = user.name || user.email;
  }

  // Logout
  document.getElementById('logoutBtn')?.addEventListener('click', () => {
    localStorage.removeItem('auth'); sessionStorage.removeItem('auth');
    window.location.href = '../login/index.html';
  });


  document.getElementById('newTaskBtn')?.addEventListener('click', () => {
    alert('Ação de Nova Tarefa – aqui você pode abrir um modal ou navegar para /tarefas.');
  });

  const weeks = ['Sem 1','Sem 2','Sem 3','Sem 4','Sem 5','Sem 6'];
  const concluidas = [52, 64, 58, 70, 61, 80];
  const pendentes  = [12, 10, 14, 6, 9, 7];


  const total = concluidas.reduce((a,b)=>a+b,0) + pendentes.reduce((a,b)=>a+b,0);
  document.getElementById('totalTasks').textContent   = total;
  document.getElementById('doneTasks').textContent    = concluidas[concluidas.length - 1];
  document.getElementById('pendingTasks').textContent = pendentes[pendentes.length - 1];
  document.getElementById('lateTasks').textContent    = Math.max(0, Math.round(pendentes[pendentes.length-1]*0.25));

  // 📊 Gráfico com Chart.js
  const ctx = document.getElementById('weeklyChart');

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: weeks,
      datasets: [
        {
          label: 'Concluídas',
          data: concluidas,
          backgroundColor: 'rgba(34,197,94,0.8)',
          borderRadius: 8,
          borderSkipped: false
        },
        {
          label: 'Pendentes',
          data: pendentes,
          backgroundColor: 'rgba(168,85,247,0.8)',
          borderRadius: 8,
          borderSkipped: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: { color: 'rgba(255,255,255,0.06)' },
          ticks: { color: '#cdd3df' }
        },
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(255,255,255,0.06)' },
          ticks: { color: '#cdd3df' }
        }
      },
      plugins: {
        legend: { labels: { color: '#dde3ef' } },
        tooltip: { backgroundColor: '#0f1626', titleColor: '#fff', bodyColor: '#e7ecf7', borderColor: '#1f2937', borderWidth: 1 }
      }
    }
  });
})();
``