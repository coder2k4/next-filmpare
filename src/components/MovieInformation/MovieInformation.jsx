import React, { useEffect, useState } from 'react';

import {
  ArrowBack,
  Favorite,
  FavoriteBorderOutlined,
  Language,
  Movie as MovieIcon,
  PlusOne,
  Remove,
  Theaters,
} from '@mui/icons-material';
import { Box, Button, ButtonGroup, CircularProgress, Grid, Modal, Rating, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';

import MovieList from '../MovieList/MovieList';
import { useGetListQuery, useGetMovieQuery, useGetRecommendationsQuery } from '../../services/TMDB';
import genreIcons from '../../assets/genres';
import { selectGenreOrCategory } from '../../features/currentGenreOrCategory';
import { userSelector } from '../../features/auth';
import { moviesApi } from '../../api/api';

import useStyles from './styles';

const MovieInformation = () => {
  const { user } = useSelector(userSelector);
  const dispatch = useDispatch();
  const { id } = useParams();

  const { data, isFetching, error } = useGetMovieQuery(id);
  const { data: favoriteMovies } = useGetListQuery({ listName: 'favorite/movies', accountId: user.id, sessionId: localStorage.getItem('session_id'), page: 1 });
  const { data: watchlistMovies } = useGetListQuery({ listName: 'watchlist/movies', accountId: user.id, sessionId: localStorage.getItem('session_id'), page: 1 });
  const { data: recommendations, isFetching: isRecommendationsFetching } = useGetRecommendationsQuery({ list: '/recommendations', movie_id: id });

  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const [isMovieFavorited, setIsMovieFavorited] = useState(false);
  const [isMovieWatchlisted, setIsMovieWatchlisted] = useState(false);

  useEffect(() => {
    setIsMovieFavorited(!!favoriteMovies?.results?.find((movie) => movie?.id === data?.id));
  }, [favoriteMovies, data]);

  useEffect(() => {
    setIsMovieWatchlisted(!!watchlistMovies?.results?.find((movie) => movie?.id === data?.id));
  }, [watchlistMovies, data]);

  const addToFavorites = async () => {
    await moviesApi.post(`/account/${user.id}/favorite?session_id=${localStorage.getItem('session_id')}`, {
      media_type: 'movie',
      media_id: id,
      favorite: !isMovieFavorited,
    });

    setIsMovieFavorited((prev) => !prev);
  };

  console.log({ isMovieWatchlisted });

  const addToWatchlist = async () => {
    await moviesApi.post(`/account/${user.id}/watchlist?session_id=${localStorage.getItem('session_id')}`, {
      media_type: 'movie',
      media_id: id,
      watchlist: !isMovieWatchlisted,
    });

    setIsMovieWatchlisted((prev) => !prev);
  };

  if (isFetching) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <CircularProgress size="8rem" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <Link to="/">Что-то пошло не так</Link>
      </Box>
    );
  }

  return (
    <Grid container className={classes.containerSpaceAround}>
      <Grid item sm={12} lg={4} style={{ display: 'flex', marginBottom: '30px' }}>
        <img
          className={classes.poster}
          src={`https://image.tmdb.org/t/p/w500/${data?.poster_path}`}
          alt={data?.title}
        />
      </Grid>
      <Grid item container direction="column" lg={7}>
        <Typography variant="h3" align="center" gutterBottom>
          {data?.title} ({data?.release_date.split('-')[0]})
        </Typography>
        <Typography variant="h5" align="center" gutterBottom>
          {data?.tagline}
        </Typography>
        <Grid item className={classes.containerSpaceAround}>
          <Box display="flex" align="center">
            <Rating readOnly value={data?.vote_average / 2} />
            <Typography variant="subtitle1" gutterBottom style={{ marginLeft: '10px' }}>
              {data?.vote_average} / 10
            </Typography>
          </Box>
          <Typography variant="h6" align="center" gutterBottom>
            {data?.runtime}мин | Язык: {data?.spoken_languages.map((lang) => lang.name).join(' ')}
          </Typography>
        </Grid>
        <Grid item className={classes.genresContainer}>
          {data?.genres?.map((genre) => (
            <Link
              key={genre.name}
              className={classes.links}
              to="/"
              onClick={() => dispatch(selectGenreOrCategory(genre.id))}
            >
              <img src={genreIcons[genre.name.toLowerCase()]} className={classes.genreImage} height={30} alt={genre.name} />
              <Typography color="textPrimary" variant="subtitle1">
                {genre?.name}
              </Typography>
            </Link>
          ))}
        </Grid>
        <Typography variant="h5" gutterBottom style={{ marginTop: '10px' }}>
          Страна производитель:
        </Typography>
        <Typography style={{ marginBottom: '2rem' }}>
          {data?.production_countries[0].name}
        </Typography>

        <Typography variant="h5" gutterBottom style={{ marginTop: '10px' }}>
          Описание:
        </Typography>
        <Typography style={{ marginBottom: '2rem' }}>
          {data?.overview}
        </Typography>
        <Typography variant="h5" gutterBottom>Актеры</Typography>
        <Grid item container spacing={2}>
          {data && data?.credits?.cast.map((character, i) => (
            character.profile_path && (
            <Grid
              key={i}
              item
              xs={4}
              md={2}
              component={Link}
              to={`/actors/${character.id}`}
              style={{ textDecoration: 'none' }}
            >
              <img
                className={classes.castImage}
                src={`https://image.tmdb.org/t/p/w500/${character.profile_path}`}
                alt={character.name}
              />
              <Typography color="textPrimary">{character?.name}</Typography>
              <Typography color="textSecondary">
                {character.character.split('/')[0]}
              </Typography>
            </Grid>
            )
          )).slice(0, 6)}
        </Grid>
        <Grid item container style={{ marginTop: '2rem' }}>
          <div className={classes.buttonsContainer}>
            <Grid item xs={12} sm={6} className={classes.buttonsContainer}>
              <ButtonGroup size="small" variant="outlined">
                <Button
                  target="_blank"
                  rel="noopener noreferrer"
                  href={data?.homepage}
                  endIcon={<Language />}
                >
                  Сайт
                </Button>
                <Button
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`https://www.imdb.com/title/${data?.imdb_id}`}
                  endIcon={<MovieIcon />}
                >
                  IMDB
                </Button>
                {data?.videos?.results?.length > 0 && (
                <Button onClick={() => setOpen(true)} href="#" endIcon={<Theaters />}>
                  Трейлер
                </Button>
                )}
              </ButtonGroup>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.buttonsContainer}>
              <ButtonGroup size="medium" variant="outlined">
                <Button
                  onClick={addToFavorites}
                  endIcon={isMovieFavorited ? <FavoriteBorderOutlined /> : <Favorite />}
                >
                  {isMovieFavorited ? 'Из избранного' : 'В избранное'}
                </Button>
                <Button onClick={addToWatchlist} endIcon={isMovieWatchlisted ? <Remove /> : <PlusOne />}>
                  К просмотру
                </Button>
                <Button endIcon={<ArrowBack />} sx={{ borderColor: 'primary.main' }}>
                  <Typography
                    style={{ textDecoration: 'none' }}
                    component={Link}
                    to="/"
                    color="inherit"
                    variant="subtitle2"
                  >
                    Назад
                  </Typography>
                </Button>
              </ButtonGroup>
            </Grid>
          </div>
        </Grid>
      </Grid>
      <Box marginTop="5rem" width="100%">
        <Typography variant="h3" gutterBottom align="center">
          Рекомендации:
        </Typography>
        {recommendations
          ? <MovieList movies={recommendations} numberOfMovies={12} />
          : <Box>Еще не появились! Добавляйте фильмы в избранное, чтобы мы могли предложить что-то по вашему вкусу</Box>}
      </Box>

      {data?.videos?.results?.length > 0 && (
      <Modal
        closeAfterTransition
        className={classes.modal}
        open={open}
        onClose={() => setOpen(false)}
      >

        <iframe
          autoPlay
          className={classes.video}
          frameBorder="0"
          title="Trailer"
          src={`https://www.youtube.com/embed/${data?.videos?.results[0]?.key}`}
          allow="autoplay"
        />

      </Modal>
      )}

    </Grid>
  );
};

export default MovieInformation;
