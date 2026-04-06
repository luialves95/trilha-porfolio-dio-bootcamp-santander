// Configuração
const username = 'luialves95';
const apiUrl = `https://api.github.com/users/${username}`;
const reposUrl = `https://api.github.com/users/${username}/repos?sort=updated&per_page=12`;

// Elementos
const reposContainer = document.getElementById('repos-list');
const statsContainer = document.getElementById('github-stats');
const avatarImg = document.getElementById('avatar-img');

// Buscar informações do perfil
async function fetchProfile() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Erro ao buscar perfil');
        const data = await response.json();
        // Atualizar avatar (já está no HTML via URL direta, mas garantimos)
        if (avatarImg) avatarImg.src = data.avatar_url || `https://avatars.githubusercontent.com/${username}`;
        // Exibir estatísticas no about
        if (statsContainer) {
            statsContainer.innerHTML = `
                <i class="fas fa-users"></i> <p><strong>${data.followers}</strong> seguidores</p>
                <i class="fas fa-user-plus"></i> <p><strong>${data.following}</strong> seguindo</p>
                <i class="fas fa-code-branch"></i> <p><strong>${data.public_repos}</strong> repositórios públicos</p>
                <i class="fas fa-calendar-alt"></i> <p>Membro desde ${new Date(data.created_at).getFullYear()}</p>
            `;
        }
    } catch (error) {
        console.error('Erro ao carregar perfil:', error);
        if (statsContainer) statsContainer.innerHTML = '<p>Erro ao carregar estatísticas.</p>';
    }
}

// Buscar repositórios
async function fetchRepos() {
    try {
        const response = await fetch(reposUrl);
        if (!response.ok) throw new Error('Erro ao buscar repositórios');
        const repos = await response.json();
        if (repos.length === 0) {
            reposContainer.innerHTML = '<div class="error">Nenhum repositório encontrado.</div>';
            return;
        }
        const reposHTML = repos.map(repo => `
            <div class="project-card">
                <h3>${repo.name}</h3>
                <p>${repo.description || 'Sem descrição'}</p>
                <div class="project-meta">
                    <span><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
                    <span><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>
                    <span><i class="fas fa-circle" style="color:${repo.language ? '#9b4dff' : '#555'}"></i> ${repo.language || 'N/A'}</span>
                </div>
                <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="btn-secondary" style="display:inline-block; margin-top:12px; padding:6px 12px; font-size:0.8rem;">Ver no GitHub →</a>
            </div>
        `).join('');
        reposContainer.innerHTML = reposHTML;
    } catch (error) {
        console.error('Erro ao carregar repositórios:', error);
        reposContainer.innerHTML = '<div class="error">Erro ao carregar projetos. Tente novamente mais tarde.</div>';
    }
}

// Menu mobile
document.addEventListener('DOMContentLoaded', () => {
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('nav ul');
    if (mobileBtn && navMenu) {
        mobileBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
    fetchProfile();
    fetchRepos();
});