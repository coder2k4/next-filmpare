import React, { useEffect } from 'react';

import { useSelector } from 'react-redux';
import { Box, Button, Typography } from '@mui/material';
import { ExitToApp } from '@mui/icons-material';

import { userSelector } from '../../features/auth';
import { useGetListQuery } from '../../services/TMDB';
import RatedCards from '../RatedCards/RatedCards';

const Profile = () => {
  const { user } = useSelector(userSelector);

  const { data: favoriteMovies, refetch: refetchFavorites } = useGetListQuery({ listName: 'favorite/movies', accountId: user.id, sessionId: localStorage.getItem('session_id'), page: 1 });
  const { data: watchlistMovies, refetch: refetchWatchlisted } = useGetListQuery({ listName: 'watchlist/movies', accountId: user.id, sessionId: localStorage.getItem('session_id'), page: 1 });

  useEffect(() => {
    refetchFavorites();
    refetchWatchlisted();
  }, []);

  const logout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h4" gutterBottom>Мой профиль {user?.username ? `(${user?.username})` : ''}</Typography>
        <Button color="inherit" onClick={logout}>
          Выйти &nbsp; <ExitToApp />
        </Button>
      </Box>
      {!favoriteMovies?.results?.length && !watchlistMovies?.results?.length
        ? <Typography variant="h5">Добавьте фильмы в избранное или список просмотра, чтобы увидеть их здесь!</Typography>
        : (
          <Box>
            <RatedCards title="Избранное" data={favoriteMovies} />
            <RatedCards title="Для просмотра" data={watchlistMovies} />
          </Box>
        )}
    </Box>
  );
};

export default Profile;
