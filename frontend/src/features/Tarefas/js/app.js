(function () {

  // Proteção de Rota
  const rawAuth = localStorage.getItem('auth') || sessionStorage.getItem('auth');
  if (!rawAuth) {
    window.location.href = '../login/index.html';
    return;
  }
  const { user } = JSON.parse(rawAuth);

  // Atualiza o Avatar
  const chip = document.getElementById('userChip');
  chip.textContent = user.name ? user.name[0] : "U";

  // Logout
  document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('auth');
    sessionStorage.removeItem('auth');
    window.location.href = '../login/index.html';
  });

  // ---------- Tarefas ----------
  let tasks = JSON.parse(localStorage.getItem('tasks') || "[]");

  function renderTasks() {
    document.querySelectorAll(".task-list").forEach(col => col.innerHTML = "");

    tasks.forEach(task => {
      const card = document.createElement("div");
      card.className = "task-card";
      card.innerHTML = `
        <div class="task-header">
          <strong>${task.title}</strong>
          <button class="delete-btn" data-id="${task.id}">✖</button>
        </div>
        <p>${task.desc}</p>
      `;

      document.getElementById(`col-${task.status}`).appendChild(card);
    });

    // Botões de excluir
    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        tasks = tasks.filter(t => t.id != btn.dataset.id);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        renderTasks();
      });
    });
  }

  // Render inicial
  renderTasks();

  // ---------- Modal ----------
  const modal = document.getElementById('taskModal');
  const openModalBtn = document.getElementById('openModalBtn');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const saveTaskBtn = document.getElementById('saveTaskBtn');

  openModalBtn.addEventListener('click', () => modal.classList.add('open'));
  closeModalBtn.addEventListener('click', () => modal.classList.remove('open'));

  saveTaskBtn.addEventListener('click', () => {
    const title = document.getElementById('taskTitle').value;
    const desc = document.getElementById('taskDesc').value;
    const status = document.getElementById('taskStatus').value;

    if (!title.trim()) return alert("Digite o título");

    const newTask = {
      id: Date.now(),
      title,
      desc,
      status
    };

    tasks.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    modal.classList.remove("open");
    renderTasks();
  });

})();