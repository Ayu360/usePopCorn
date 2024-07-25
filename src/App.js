import { useEffect, useRef, useState } from "react";
import { Navbar } from "./components/Navbar";
import { Button } from "./components/Button";
import { MovieList } from "./components/MovieList";
import { WatchedMovieList } from "./components/WatchedMovieList";
import { WatchedSummary } from "./components/WatchedSummary";
import StarRaiting from "./StarRaiting.js";

import { BallTriangle } from "react-loader-spinner";
import { useMovies } from "./hooks/useMovies.js";
import { useLocalStorageState } from "./hooks/useLocalStorageState.js";
import { useKey } from "./hooks/useKey.js";
import useWindowSize from "./hooks/useWindowSize.js";

const KEY = "a1c6b557";
export default function App() {
  const [query, setQuery] = useState("inception");
  const [selectedID, setSelectedID] = useState(null);
  const [watched, setWatched] = useLocalStorageState([], "watched");

  const { movies, isLoading, isError } = useMovies(query);
  const { isMobile } = useWindowSize();

  function handleSelectedMovie(id) {
    setSelectedID((selectedID) => (selectedID === id ? null : id));
  }

  function handleCloseMovie() {
    setSelectedID(null);
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handleDeleteMovie(id) {
    setWatched((watched) => watched.filter((ele) => ele.imdbID !== id));
  }

  return (
    <>
      <Navbar isMobile={isMobile}>
        <Search query={query} setQuery={setQuery} />
        <NumResult movies={movies} />
      </Navbar>

      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !isError && (
            <MovieList movies={movies} onSelectMovie={handleSelectedMovie} />
          )}
          {isError && <Error message={isError} />}
        </Box>

        <Box>
          {selectedID ? (
            <MovieDetail
              id={selectedID}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMovieList
                watched={watched}
                onDeleteMovie={handleDeleteMovie}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function Loader() {
  return (
    <div className="loader">
      <BallTriangle
        height={100}
        width={100}
        radius={5}
        color="#4fa94d"
        ariaLabel="ball-triangle-loading"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
      />
    </div>
  );
}

function Error({ message }) {
  return (
    <p className="error">
      <span>❌</span>
      {message}
    </p>
  );
}

function Main({ children }) {
  const { isMobile } = useWindowSize();
  return <main className={isMobile ? "main-mobile" : "main"}>{children}</main>;
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <Button isOpen={isOpen} setIsOpen={setIsOpen} />
      {isOpen && children}
    </div>
  );
}

function NumResult({ movies }) {
  return (
    <p className="num-results">
      <strong>{movies.length} </strong> results
    </p>
  );
}

function Search({ query, setQuery }) {
  let inputEl = useRef();
  useKey("Enter", function () {
    if (document.activeElement === inputEl.current) return;
    inputEl.current.focus();
    setQuery("");
  });
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  );
}

function MovieDetail({ id, onCloseMovie, onAddWatched, watched }) {
  let [selectedMovie, setSelectedMovie] = useState("");
  let [isLoading, setIsLoading] = useState(false);
  let [userRating, setUserRating] = useState(0);
  const isAdded = watched.map((movie) => movie.imdbID).includes(id);
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === id
  )?.userRating;

  let countOfRating = useRef(0);
  useEffect(
    function () {
      async function fetchSelectedMovie() {
        setIsLoading(true);
        let res = await fetch(`https://omdbapi.com/?apikey=${KEY}&i=${id}`);
        let data = await res.json();
        setSelectedMovie(data);
        setIsLoading(false);
      }
      fetchSelectedMovie();
    },
    [id]
  );

  useEffect(
    function () {
      if (userRating !== 0) countOfRating.current++;
    },
    [userRating]
  );

  const {
    Title: title,
    Poster: poster,
    Released: released,
    Runtime: runtime,
    Genre: genre,
    Plot: plot,
    Actors: actors,
    Director: director,
    imdbRating,
    imdbID,
  } = selectedMovie;

  function handleAddNewMovie() {
    const newWatchedMovie = {
      title,
      poster,
      runtime: Number(runtime.split(" ").at(0)),
      imdbRating: Number(imdbRating),
      imdbID,
      userRating,
      countOfRating,
    };
    onAddWatched(newWatchedMovie);
    onCloseMovie();
  }

  useEffect(
    function () {
      if (!title) return;
      document.title = title;

      return function () {
        document.title = "Usepopcorn";
        console.log(`cleanup function called for movie: ${title}`);
      };
    },
    [title]
  );

  return (
    <div className="details">
      {isLoading && <Loader />}
      {!isLoading && (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt="movie poster" />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDb rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!isAdded ? (
                <>
                  <StarRaiting
                    maxRaiting={10}
                    size={24}
                    indicatorFunction={setUserRating}
                  />
                  {userRating > 0 && (
                    <button
                      className="btn-add"
                      onClick={(e) => handleAddNewMovie()}
                    >
                      Add to Watched
                    </button>
                  )}
                </>
              ) : (
                <p>You've rated this {watchedUserRating}⭐</p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}
