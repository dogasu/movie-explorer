import { useState, useEffect } from "react";

function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);

  const API_KEY = "a0720dd055e36debc926735d2739f0de";

  const popularSuggestions = [
    "Avengers",
    "Spider-Man",
    "Inception",
    "Frozen",
    "Star Wars",
    "Harry Potter",
  ];

  useEffect(() => {
    fetchTrending();
  }, []);

  const fetchTrending = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`
      );
      const data = await res.json();
      setMovies(data.results);
    } catch (err) {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const searchMovies = async (term) => {
    const searchTerm = term || query;
    if (!searchTerm) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${searchTerm}`
      );
      const data = await res.json();
      setMovies(data.results);

      setHistory((prev) =>
        prev.includes(searchTerm) ? prev : [searchTerm, ...prev].slice(0, 5)
      );
    } catch (err) {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Film seçildiğinde trailer fetch et
  const handleSelectMovie = async (movie) => {
    setSelectedMovie(movie);
    setTrailerKey(null); // eski trailer varsa temizle

    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${API_KEY}&language=en-US`
      );
      const data = await res.json();
      const trailer = data.results.find(
        (vid) => vid.type === "Trailer" && vid.site === "YouTube"
      );
      if (trailer) setTrailerKey(trailer.key);
    } catch (err) {
      console.log("Trailer fetch error", err);
    }
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        padding: "20px",
        minHeight: "100vh",
        width: "100vw",
        boxSizing: "border-box",
        background: "linear-gradient(135deg, #1f1c2c, #928dab)",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "30px", color: "#fff" }}>
        🎬 Movie Explorer
      </h1>

      {/* Search Bar */}
      <div style={{ textAlign: "center", marginBottom: "15px" }}>
        <input
          type="text"
          placeholder="Search for movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            padding: "10px",
            width: "300px",
            maxWidth: "80%",
            borderRadius: "5px",
            border: "none",
            marginRight: "10px",
          }}
        />
        <button
          onClick={() => searchMovies()}
          style={{
            padding: "10px 20px",
            borderRadius: "5px",
            border: "none",
            backgroundColor: "#ff4c4c",
            color: "#fff",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Search
        </button>
      </div>

      {/* Popular Suggestions */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        {popularSuggestions.map((item) => (
          <button
            key={item}
            onClick={() => searchMovies(item)}
            style={{
              padding: "5px 12px",
              margin: "5px",
              borderRadius: "5px",
              border: "none",
              backgroundColor: "#00bfff",
              color: "#fff",
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Search History */}
      {history.length > 0 && (
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <p style={{ color: "#fff", marginBottom: "5px" }}>Recent Searches:</p>
          {history.map((item) => (
            <button
              key={item}
              onClick={() => searchMovies(item)}
              style={{
                padding: "5px 12px",
                margin: "3px",
                borderRadius: "5px",
                border: "none",
                backgroundColor: "#ffa500",
                color: "#fff",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              {item}
            </button>
          ))}
        </div>
      )}

      {loading && <p style={{ textAlign: "center", color: "#fff" }}>Loading...</p>}
      {error && <p style={{ textAlign: "center", color: "#ffcccc" }}>{error}</p>}

      {movies.length > 0 && (
        <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#fff" }}>
          {query ? "Search Results" : "Trending Now"}
        </h2>
      )}

      {movies.length === 0 && !loading && !error && (
        <p style={{ textAlign: "center", color: "#fff", marginTop: "50px" }}>
          No movies found. Try searching or see trending movies below.
        </p>
      )}

      {/* Movie Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "20px",
          width: "90%",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {movies.map((movie) => (
          <div
            key={movie.id}
            onClick={() => handleSelectMovie(movie)}
            style={{
              borderRadius: "10px",
              overflow: "hidden",
              backgroundColor: "#2c2c34",
              color: "#fff",
              boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
              transition: "transform 0.3s, box-shadow 0.3s",
              cursor: "pointer",
              position: "relative",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-10px)";
              e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.5)";
              const desc = e.currentTarget.querySelector(".overview");
              if (desc) desc.style.opacity = "1";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.3)";
              const desc = e.currentTarget.querySelector(".overview");
              if (desc) desc.style.opacity = "0";
            }}
          >
            {movie.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                alt={movie.title}
                style={{
                  width: "100%",
                  height: "300px",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "300px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#444",
                  color: "#bbb",
                }}
              >
                No Image
              </div>
            )}
            <div style={{ padding: "10px", position: "relative" }}>
              <h3 style={{ margin: "10px 0 5px", fontSize: "18px" }}>{movie.title}</h3>
              <p style={{ margin: "0 0 5px" }}>⭐ {movie.vote_average}</p>
              <p style={{ margin: "0 0 5px", fontSize: "12px", color: "#ccc" }}>
                {movie.release_date}
              </p>
              <div
                className="overview"
                style={{
                  fontSize: "12px",
                  color: "#eee",
                  marginTop: "5px",
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  opacity: 0,
                  transition: "opacity 0.3s",
                }}
              >
                {movie.overview || "No description available."}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedMovie && (
        <div
          onClick={() => setSelectedMovie(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            padding: "20px",
            overflowY: "auto",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "#1f1c2c",
              borderRadius: "10px",
              width: "100%",
              maxWidth: "700px",
              padding: "20px",
              color: "#fff",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <button
              onClick={() => setSelectedMovie(null)}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "none",
                border: "none",
                color: "#fff",
                fontSize: "24px",
                cursor: "pointer",
              }}
            >
              &times;
            </button>

            {selectedMovie.poster_path && (
              <img
                src={`https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`}
                alt={selectedMovie.title}
                style={{
                  width: "200px",
                  borderRadius: "10px",
                  marginBottom: "15px",
                  objectFit: "cover",
                }}
              />
            )}

            <h2 style={{ marginBottom: "10px" }}>{selectedMovie.title}</h2>
            <p style={{ marginBottom: "5px" }}>⭐ {selectedMovie.vote_average}</p>
            <p style={{ marginBottom: "10px", color: "#ccc" }}>
              Release Date: {selectedMovie.release_date}
            </p>
            <p style={{ textAlign: "justify", lineHeight: "1.4", marginBottom: "15px" }}>
              {selectedMovie.overview || "No description available."}
            </p>

            {/* YouTube Trailer */}
            {trailerKey ? (
              <iframe
                width="100%"
                height="315"
                src={`https://www.youtube.com/embed/${trailerKey}`}
                title="YouTube trailer"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ borderRadius: "10px", maxWidth: "560px" }}
              ></iframe>
            ) : (
              <p>No trailer available</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
