import React, { useState } from 'react';

import { Box, Button, CircularProgress, Grid, Typography } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useHistory, useParams } from 'react-router-dom';

import { useGetActorsDetailsQuery, useGetMoviesByActorIdQuery } from '../../services/TMDB';
import MovieList from '../MovieList/MovieList';
import Pagination from '../Pagination/Pagination';

import useStyles from './styles';

const Actors = () => {
  const classes = useStyles();
  const [page, setPage] = useState(1);

  const { id } = useParams();
  const history = useHistory();

  const { data, isFetching, error } = useGetActorsDetailsQuery(id);
  const { data: movies } = useGetMoviesByActorIdQuery({ id, page });

  if (isFetching) {
    return (
      <Box display="flex" justifyContent="center">
        <CircularProgress size="8rem" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <Button startIcon={<ArrowBack />} onClick={() => history.goBack()} color="primary">
          Назад
        </Button>
      </Box>
    );
  }

  return (
    <>
      <Grid container spacing={3}>
        <Grid item lg={5} xl={4}>
          <img
            className={classes.image}
            src={`https://image.tmdb.org/t/p/w780/${data?.profile_path}`}
            alt={data.name}
          />
        </Grid>
        <Grid item lg={7} xl={8} style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
          <Typography variant="h2" gutterBottom>
            {data?.name}
          </Typography>
          <Typography variant="h5" gutterBottom>
            Родился: {new Date(data?.birthday).toLocaleDateString('ru-RU')}
          </Typography>
          <Typography variant="body1" align="justify" paragraph>
            {data?.biography || 'Извините, биографии еще нет...'}
          </Typography>
          <Box marginTop="2rem" display="flex" justifyContent="space-around">
            <Button variant="contained" color="primary" target="_blank" href={`https://www.imdb.com/name/${data?.imdb_id}`}>
              IMDB
            </Button>
            <Button startIcon={<ArrowBack />} onClick={() => history.goBack()} color="primary">
              Назад
            </Button>
          </Box>
        </Grid>
      </Grid>
      <Box margin="2rem 0">
        <Typography variant="h2" gutterBottom align="center">Фильмография</Typography>
        <Pagination currentPage={page} setPage={setPage} totalPages={movies?.total_pages} />
        {movies && <MovieList movies={movies} numberOfMovies={12} />}
        <Pagination currentPage={page} setPage={setPage} totalPages={movies?.total_pages} />
      </Box>
    </>
  );
};

export default Actors;
