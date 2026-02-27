(function () {
  const form = document.getElementById('loginForm');
  const email = document.getElementById('email');
  const pass = document.getElementById('password');
  const emailErr = document.getElementById('email-error');
  const passErr = document.getElementById('password-error');
  const togglePass = document.querySelector('.toggle-pass');
  const themeToggle = document.getElementById('themeToggle');

  // Se já estiver logado, vai direto pro dashboard
  const existingAuth = localStorage.getItem('auth') || sessionStorage.getItem('auth');
  if (existingAuth) {
    window.location.href = '../dashboard/index.html';
    return;
  }

  // Tema salvo
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.documentElement.classList.add('light');
    themeToggle.setAttribute('aria-pressed', 'true');
  }
  themeToggle.addEventListener('click', () => {
    const isLight = document.documentElement.classList.toggle('light');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    themeToggle.setAttribute('aria-pressed', String(isLight));
  });

  // Mostrar/ocultar senha
  togglePass.addEventListener('click', () => {
    const isPassword = pass.getAttribute('type') === 'password';
    pass.setAttribute('type', isPassword ? 'text' : 'password');
  });

  function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }
  function clearErrors() { emailErr.textContent = ''; passErr.textContent = ''; }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();

    const data = {
      email: email.value.trim(),
      password: pass.value,
      remember: document.getElementById('rememberMe').checked
    };

    let valid = true;
    if (!data.email) { emailErr.textContent = 'Informe seu e-mail.'; valid = false; }
    else if (!validateEmail(data.email)) { emailErr.textContent = 'E-mail inválido.'; valid = false; }
    if (!data.password) { passErr.textContent = 'Informe sua senha.'; valid = false; }
    else if (data.password.length < 6) { passErr.textContent = 'A senha deve ter pelo menos 6 caracteres.'; valid = false; }
    if (!valid) return;

    // 🔐 MOCK de autenticação (substitua pelo fetch da sua API)
    // Exemplo de integração real:
    // const resp = await fetch('https://sua-api.com/auth/login', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data), credentials:'include'});
    // if (!resp.ok) { passErr.textContent = 'Credenciais inválidas.'; return; }
    // const { token, user } = await resp.json();

    const user = { name: 'Alexandre Loiola', email: data.email }; // dados de exemplo
    const token = 'demo-' + Math.random().toString(36).slice(2);

    const storage = data.remember ? localStorage : sessionStorage;
    storage.setItem('auth', JSON.stringify({ token, user }));

    // Redireciona para o Dashboard
    window.location.href = '../dashboard/index.html';
  });
})();