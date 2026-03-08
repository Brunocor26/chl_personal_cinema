// Referência aos elementos do player de vídeo
const videoPlayer = document.getElementById('videoPlayer');
const videoSource = document.getElementById('videoSource');

/**
 * Carrega e reproduz um vídeo a partir de uma URL fornecida.
 * @param {string} videoUrl - A URL ou caminho local do arquivo de vídeo.
 */
function playVideo(videoUrl) {
    if (!videoUrl) {
        console.error("Nenhuma URL de vídeo fornecida.");
        return;
    }

    // Atualiza o source do vídeo
    videoSource.src = videoUrl;

    // Recarrega o player com o novo vídeo
    videoPlayer.load();

    // Tenta reproduzir o vídeo automaticamente
    videoPlayer.play()
        .then(() => {
            console.log("Reproduzindo:", videoUrl);
        })
        .catch(error => {
            console.error("Erro ao reproduzir o vídeo:", error);
            // Em alguns navegadores, o autoplay pode ser bloqueado
        });
}

const posterImage = document.getElementById('posterImage');

/**
 * Carrega e exibe um poster a partir de uma URL fornecida.
 * @param {string} posterUrl - A URL ou caminho local do arquivo do poster.
 */
function playposter(posterUrl) {
    if (!posterUrl) {
        console.error("Nenhuma URL de poster fornecida.");
        return;
    }

    // Atualiza o source da imagem e torna ela visível
    posterImage.src = posterUrl;
    posterImage.style.display = 'block';
}

const startMenu = document.getElementById('startMenu');
const playerContainer = document.getElementById('playerContainer');

// Movies map: Keyboard Number -> Movie Data
const moviesMap = {
    '1': {
        video: 'http://localhost:8080/media/movies/frozen.mp4',
        poster: 'http://localhost:8080/media/posters/frozen.jpg'
    }
    // Adicione mais filmes aqui no futuro ('2': { video: '...', poster: '...' })
};

/**
 * Esconde o meu inicial e mostra o reprodutor.
 */
function showPlayer() {
    startMenu.classList.add('hidden');
    playerContainer.classList.add('visible');
}

/**
 * Esconde o reprodutor, pausa o vídeo e volta ao menu inicial.
 */
function hidePlayer() {
    // Pausa o vídeo atual
    videoPlayer.pause();
    
    // Altera a visibilidade das interfaces
    playerContainer.classList.remove('visible');
    startMenu.classList.remove('hidden');
}

/**
 * Escuta eventos do teclado globalmente
 */
window.addEventListener('keydown', (event) => {
    const key = event.key;
    
    // Verifica se a tecla pressionada é um número de 1 a 9
    if (moviesMap[key]) {
        const movie = moviesMap[key];
        
        showPlayer();
        playposter(movie.poster);
        
        // Dá um pequeno delay para a animação do menu ocorrer suavemente antes de carregar o vídeo
        setTimeout(() => {
            playVideo(movie.video);
        }, 500);
    }
});

// Mantemos o fallback de teste na inicialização, caso você queira testar a URL diretamente
window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    let videoParam = urlParams.get('video');
    let posterParam = urlParams.get('poster');

    if (videoParam || posterParam) {
        showPlayer();
        if (posterParam) playposter(posterParam);
        if (videoParam) playVideo(videoParam);
    }
});
