document.addEventListener('DOMContentLoaded', function() {
  carregarUsuarios();

  // Adicionar event listener para o formulário de edição
  document.getElementById('editForm').addEventListener('submit', function(e) {
      e.preventDefault();
      salvarEdicao();
  });
});

function carregarUsuarios() {
  const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
  const tbody = document.getElementById('userList');
  tbody.innerHTML = '';

  usuarios.forEach(usuario => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
          <td>${usuario.nome}</td>
          <td>${usuario.email}</td>
          <td>
              <button onclick="editarUsuario(${usuario.id})" class="btn-acao btn-editar">Editar</button>
              <button onclick="excluirUsuario(${usuario.id})" class="btn-acao btn-excluir">Excluir</button>
          </td>
      `;
      tbody.appendChild(tr);
  });
}

function editarUsuario(id) {
  const usuarios = JSON.parse(localStorage.getItem('usuarios'));
  const usuario = usuarios.find(u => u.id === id);
  
  if (usuario) {
      document.getElementById('editId').value = usuario.id;
      document.getElementById('editNome').value = usuario.nome;
      document.getElementById('editEmail').value = usuario.email;
      document.getElementById('editSenha').value = '';
      
      document.getElementById('editModal').style.display = 'block';
  }
}

function salvarEdicao() {
  const id = parseInt(document.getElementById('editId').value);
  const nome = document.getElementById('editNome').value;
  const email = document.getElementById('editEmail').value;
  const novaSenha = document.getElementById('editSenha').value;

  const usuarios = JSON.parse(localStorage.getItem('usuarios'));
  const index = usuarios.findIndex(u => u.id === id);

  if (index !== -1) {
      // Verificar se o novo email já existe em outro usuário
      const emailExiste = usuarios.some(u => u.email === email && u.id !== id);
      if (emailExiste) {
          mostrarMensagem('Este e-mail já está em uso por outro usuário', 'erro');
          return;
      }

      // Atualizar usuário
      usuarios[index].nome = nome;
      usuarios[index].email = email;
      if (novaSenha) {
          if (novaSenha.length < 6) {
              mostrarMensagem('A senha deve ter pelo menos 6 caracteres', 'erro');
              return;
          }
          usuarios[index].senha = novaSenha;
      }

      localStorage.setItem('usuarios', JSON.stringify(usuarios));
      fecharModal();
      carregarUsuarios();
      mostrarMensagem('Usuário atualizado com sucesso!', 'sucesso');
  }
}

function excluirUsuario(id) {
  if (confirm('Tem certeza que deseja excluir este usuário?')) {
      const usuarios = JSON.parse(localStorage.getItem('usuarios'));
      const novosUsuarios = usuarios.filter(u => u.id !== id);
      localStorage.setItem('usuarios', JSON.stringify(novosUsuarios));
      carregarUsuarios();
      mostrarMensagem('Usuário excluído com sucesso!', 'sucesso');
  }
}

function fecharModal() {
  document.getElementById('editModal').style.display = 'none';
}

function mostrarMensagem(texto, tipo) {
  const mensagem = document.getElementById('mensagem');
  mensagem.textContent = texto;
  mensagem.className = tipo;
  mensagem.style.display = 'block';
  
  setTimeout(() => {
      mensagem.style.display = 'none';
  }, 3000);
}

// Fechar modal quando clicar fora dele
window.onclick = function(event) {
  const modal = document.getElementById('editModal');
  if (event.target === modal) {
      fecharModal();
  }
}