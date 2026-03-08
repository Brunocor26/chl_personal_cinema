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

// Caso queira testar passando um parâmetro na URL: ?video=meuvideo.mp4
window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    let videoParam = urlParams.get('video');
    
    // Fallback: se não tiver o parâmetro, tenta pegar o video default do servidor backend em ocaml
    if (!videoParam) {
        videoParam = "http://localhost:8080/media/movies/frozen.mp4";
    }

    // Fallback de teste para o poster
    let posterParam = urlParams.get('poster') || "http://localhost:8080/media/posters/frozen.jpg";

    if (videoParam) {
        playVideo(videoParam);
    }
    
    if (posterParam) {
        playposter(posterParam);
    }
});
