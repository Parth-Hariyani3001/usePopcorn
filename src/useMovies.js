import { useState, useEffect } from "react";

const KEY = "f69a7d4d";

export function useMovies(query) {
  console.log("Called");
  const [movies, setMovies] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    function () {
      //   callback?.(); //If a callback exist then only call or else skip it
      const controller = new AbortController();
      async function fetchMovies() {
        try {
          setisLoading(true);
          setError("");
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );

          if (!res.ok)
            throw new Error(
              "Something went wrong with fetching movies"
            );

          const data = await res.json();
          // console.log(data);
          if (data.Response === "False") {
            throw new Error(
              "Movie Not found please try searching another movie"
            );
          }
          setMovies(data.Search);
          setError("");
        } catch (err) {
          if (err.name !== "AbortError") {
            setError(err.message);
          }
        } finally {
          setisLoading(false);
        }
      }
      if (query.length <= 2) {
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

  return { movies, isLoading, error };
}
