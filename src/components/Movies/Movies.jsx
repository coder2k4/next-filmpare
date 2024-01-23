import React, { useState } from 'react';

import { useSelector } from 'react-redux';
import { Box, CircularProgress, Typography, useMediaQuery } from '@mui/material';

import MovieList from '../MovieList/MovieList';
import { useGetMoviesQuery } from '../../services/TMDB';
import Pagination from '../Pagination/Pagination';
import FeaturedMovie from '../FeaturedMovie/FeaturedMovie';

const Movies = () => {
  const { genreIdOrCategoryName, searchQuery } = useSelector((state) => state.currentGenreOrCategory);

  const [page, setPage] = useState(1);

  const { data, error, isFetching } = useGetMoviesQuery({
    genreIdOrCategoryName, page, searchQuery,
  });

  // const lg = useMediaQuery('(max-width:900px)');
  const lg = useMediaQuery((theme) => theme.breakpoints.only('lg'));
  const numberOfMovies = lg ? 17 : 19;

  // const numberOfMovies = 17;

  if (isFetching) {
    return (
      <Box display="flex" justifyContent="center">
        <CircularProgress size="4rem" />
      </Box>
    );
  }

  if (!data.results.length) {
    return (
      <Box display="flex" alignItems="center" mt="20px">
        <Typography variant="h4">
          Нет фильмов, соответствующих этому названию.
          <br />
          Пожалуйста, попробуйте найти что-то другое.
        </Typography>
      </Box>
    );
  }

  if (error) return 'An error has occured.';

  return (
    <div>
      <Pagination currentPage={page} setPage={setPage} totalPages={data.total_pages} />
      <FeaturedMovie movie={data.results[0]} />
      <MovieList movies={data} numberOfMovies={numberOfMovies} excludeFirst />
      <Pagination currentPage={page} setPage={setPage} totalPages={data.total_pages} />
    </div>
  );
};

export default Movies;
