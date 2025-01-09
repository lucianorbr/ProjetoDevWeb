document.addEventListener('DOMContentLoaded', function() {
  // Inicializa o localStorage se não existir
  if (!localStorage.getItem('usuarios')) {
      localStorage.setItem('usuarios', JSON.stringify([]));
  }

  const form = document.getElementById('userForm');
  const mensagem = document.getElementById('mensagem');

  form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const nome = document.getElementById('nome').value;
      const email = document.getElementById('email').value;
      const senha = document.getElementById('senha').value;

      // Validações
      if (senha.length < 6) {
          mostrarMensagem('A senha deve ter pelo menos 6 caracteres', 'erro');
          return;
      }

      // Verificar se o email já existe
      const usuarios = JSON.parse(localStorage.getItem('usuarios'));
      if (usuarios.some(user => user.email === email)) {
          mostrarMensagem('Este e-mail já está cadastrado', 'erro');
          return;
      }

      // Criar novo usuário
      const novoUsuario = {
          id: Date.now(), // Usando timestamp como ID
          nome,
          email,
          senha
      };

      // Adicionar ao localStorage
      usuarios.push(novoUsuario);
      localStorage.setItem('usuarios', JSON.stringify(usuarios));

      // Limpar formulário e mostrar mensagem de sucesso
      form.reset();
      mostrarMensagem('Usuário cadastrado com sucesso!', 'sucesso');
  });

  function mostrarMensagem(texto, tipo) {
      mensagem.textContent = texto;
      mensagem.className = tipo;
      mensagem.style.display = 'block';
      
      setTimeout(() => {
          mensagem.style.display = 'none';
      }, 3000);
  }

  function mostrarUsuarios() {
      const container = document.getElementById('listaUsuarios');
      const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
      
      if (container.style.display === 'block') {
          container.style.display = 'none';
          return;
      }

      if (usuarios.length === 0) {
          container.innerHTML = '<p>Nenhum usuário cadastrado.</p>';
      } else {
          let html = `
              <table>
                  <thead>
                      <tr>
                          <th>Nome</th>
                          <th>E-mail</th>
                      </tr>
                  </thead>
                  <tbody>
          `;

          usuarios.forEach(usuario => {
              html += `
                  <tr>
                      <td>${usuario.nome}</td>
                      <td>${usuario.email}</td>
                  </tr>
              `;
          });

          html += '</tbody></table>';
          container.innerHTML = html;
      }

      container.style.display = 'block';
  }
});