import { useState, useEffect, useRef } from 'react';
import './index.css';

const STATE_PROFILE = 'PROFILE';
const STATE_SCANNER = 'SCANNER';
const STATE_PLAYER = 'PLAYER';

const PHRASES = [
  "Tens o caderno mágico?",
  "Pede ajuda à mamã!",
  "Liga ao tio que ele sabe!"
];

function App() {
  const [appState, setAppState] = useState(STATE_PROFILE);
  const [currentMedia, setCurrentMedia] = useState(null);
  const [randomPhrase, setRandomPhrase] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [moviesMap, setMoviesMap] = useState({});
  const videoRef = useRef(null);

  useEffect(() => {
    // Escolher frase aleatória a cada reload da app
    const randomIndex = Math.floor(Math.random() * PHRASES.length);
    setRandomPhrase(PHRASES[randomIndex]);

    // Buscar lista de filmes do servidor OCaml e gerar o mapa de QR Codes
    fetch('/movielist')
      .then(res => res.text())
      .then(text => {
        const files = text.split('\n').filter(f => f.trim() !== '');
        setMovieList(files);
        
        const map = {};
        files.forEach((file, index) => {
          const baseName = file.replace(/\.(mp4|mov|mkv|avi)$/i, '');
          // Atribui o botão '1' ao primeiro ficheiro, '2' ao segundo, etc.
          map[String(index + 1)] = {
            video: `/media/movies/${file}`,
            poster: `/media/posters/${baseName}.jpg`
          };
        });
        setMoviesMap(map);
      })
      .catch(err => console.error("Failed to fetch movie list", err));
  }, []);

  useEffect(() => {
    let timeout;
    if (appState === STATE_PROFILE) {
      timeout = setTimeout(() => {
        setAppState(STATE_SCANNER);
      }, 5000);
    }
    return () => clearTimeout(timeout);
  }, [appState]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key;

      if (appState === STATE_PROFILE) {
        // Any key advances to scanner 
        if (key === 'Enter' || (key >= '0' && key <= '9')) {
           setAppState(STATE_SCANNER);
        }
      } else if (appState === STATE_SCANNER) {
        if (moviesMap[key]) {
          setCurrentMedia(moviesMap[key]);
          setAppState(STATE_PLAYER);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [appState]);

  useEffect(() => {
      if (appState === STATE_PLAYER && videoRef.current) {
          videoRef.current.play().catch(e => console.log("Auto-play prevented"));
      }
  }, [appState]);

  const handleProfileClick = () => {
    setAppState(STATE_SCANNER);
  };

  const handleBackToScanner = () => {
      if (videoRef.current) {
          videoRef.current.pause();
      }
      setAppState(STATE_SCANNER);
  };

  return (
    <>
      <div className="animated-background">
        <div className="bubble"></div><div className="bubble"></div><div className="bubble"></div>
        <div className="bubble"></div><div className="bubble"></div><div className="bubble"></div>
      </div>

      {/* Profile Selection Screen */}
      <div className={`screen-container ${appState !== STATE_PROFILE ? 'exit' : ''}`}>
        <h2 className="profile-title">Quem está a ver?</h2>
        <div className="profile-avatar-wrapper" onClick={handleProfileClick}>
          <img src="/chloe.jpg" alt="Chloe" className="profile-avatar" />
          <span className="profile-name">Chloé</span>
        </div>
      </div>

      {/* Scanner Screen */}
      <div className={`screen-container ${appState !== STATE_SCANNER ? 'exit' : ''}`}>
        <h1 className="title">Cinema da Chloé</h1>
        <p className="instruction">{randomPhrase}</p>
        
        {/* Posters Netflix Carousel */}
        <div className="posters-carousel">
          {movieList.map(movieFile => {
            // Substitui a extensão (.mp4, .mov, etc) por .jpg para o poster
            const baseName = movieFile.replace(/\.(mp4|mov|mkv|avi)$/i, '');
            const posterUrl = `/media/posters/${baseName}.jpg`;
            return (
              <img key={movieFile} src={posterUrl} alt={baseName} className="poster-img" />
            );
          })}
        </div>
      </div>

      {/* Player Screen */}
      {appState === STATE_PLAYER && (
         <div className="player-container">
            <button className="back-btn" onClick={handleBackToScanner}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              <span>Voltar</span>
            </button>
            <video 
                ref={videoRef}
                className="video-player"
                controls
                autoPlay
                src={currentMedia?.video}
                poster={currentMedia?.poster}
            >
                O teu navegador não suporta a tag de vídeo.
            </video>
         </div>
      )}
    </>
  );
}

export default App;
