import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, useParams } from "react-router-dom";
import "./App.css";

const API = "https://www.omdbapi.com/";
const KEY = import.meta.env.VITE_API_KEY;

function Home() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function searchMovies() {
    if (!query) return setError("Enter a movie name");

    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `${API}?apikey=${KEY}&s=${encodeURIComponent(query)}&type=${type}`
      );
      const data = await res.json();

      if (data.Response === "False") throw new Error(data.Error);

      setMovies(data.Search || []);
    } catch (e) {
      setMovies([]);
      setError(e.message);
    }

    setLoading(false);
  }

  return (
    <>
      <h1>🎬 Movie Explorer</h1>

      <input
        placeholder="Search movie"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="">All</option>
        <option value="movie">Movies</option>
        <option value="series">Series</option>
        <option value="episode">Episodes</option>
      </select>

      <button onClick={searchMovies}>Search</button>

      {loading && <h3>Loading...</h3>}
      {error && <p className="error">❌ {error}</p>}

      <div className="movies">
        {movies.map((movie) => (
          <div className="card" key={movie.imdbID}>
            <img src={movie.Poster !== "N/A" ? movie.Poster : ""} />
            <h3>{movie.Title}</h3>
            <p>📅 {movie.Year}</p>
            <Link to={`/movie/${movie.imdbID}`}>
              <button>View Details</button>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}

function Details() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    fetch(`${API}?apikey=${KEY}&i=${id}&plot=full`)
      .then((res) => res.json())
      .then(setMovie);
  }, [id]);

  if (!movie) return <h3>Loading...</h3>;

  return (
    <div className="details">
      <Link to="/">← Back</Link>
      <h1>{movie.Title}</h1>
      <img src={movie.Poster} />
      <p>⭐ Rating: {movie.imdbRating}</p>
      <p>🎭 Genre: {movie.Genre}</p>
      <p>📅 Year: {movie.Year}</p>
      <p>{movie.Plot}</p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<Details />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;