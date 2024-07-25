import { useEffect, useState } from "react";

const KEY = "a1c6b557";
export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoding] = useState(false);
  const [isError, setError] = useState("");

  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchMovies() {
        setIsLoding(true);
        setError("");
        try {
          let res = await fetch(
            `http://www.omdbapi.com/?i=tt3896198&apikey=${KEY}&s=${query}`,
            {
              signal: controller.signal,
            }
          );

          if (!res.ok) {
            throw new Error("Something went wrong while fetching movies!");
          }

          let data = await res.json();
          if (data.Response === "False") throw new Error("Movie not found");

          setMovies(data.Search);
          setError("");
        } catch (err) {
          console.log("I", err.message);
          if (err.name !== "AbortError") {
            setError(err.message);
          }
        } finally {
          setIsLoding(false);
          //setError("");
        }
      }
      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }
      fetchMovies();
      return function () {
        controller.abort();
      };
    },
    [query]
  );
  return { movies, isLoading, isError };
}
