import React from 'react';

import {
  Box,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from '@mui/material';
import { useTheme } from '@mui/styles';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import genreIcons from '../../assets/genres';
import { useGetGenresQuery } from '../../services/TMDB';
import { selectGenreOrCategory } from '../../features/currentGenreOrCategory';

import useStyles from './styles';

const redLogo = 'https://fontmeme.com/permalink/210930/8531c658a743debe1e1aa1a2fc82006e.png';
const blueLogo = 'https://fontmeme.com/permalink/210930/6854ae5c7f76597cf8680e48a2c8a50a.png';

const categories = [
  { label: 'Популярные', value: 'popular' },
  { label: 'Лучший ретинг', value: 'top_rated' },
  { label: 'Новые', value: 'upcoming' },
];

/* const data = {
  genres: [
    { name: 'Драма' },
    { name: 'Комедия' },
    { name: 'Фантастика' },
    { name: 'Ужасы' },
    { name: 'Боевик' },
    { name: 'Триллер' },
    { name: 'Мелодрама' },
    { name: 'Фэнтези' },
    { name: 'Детектив' },
    { name: 'Анимация' },
  ],
}; */

function Sidebar() {
  const classes = useStyles();
  const theme = useTheme();

  const { data, isFetching } = useGetGenresQuery();

  const { genreIdOrCategoryName } = useSelector((state) => state.currentGenreOrCategory);

  const dispatch = useDispatch();

  return (
    <>
      <Link to="/" className={classes.imageLink}>
        <img
          className={classes.image}
          src={theme.palette.mode === 'light' ? redLogo : blueLogo}
          alt="Filmpire logo"
        />
      </Link>
      <Divider />
      <List>
        <ListSubheader>Категории</ListSubheader>
        {categories.map(({ label, value }) => (
          <Link key={value} className={classes.links} to="/">
            <ListItem onClick={() => dispatch(selectGenreOrCategory(value))} button>
              <ListItemIcon>
                <img
                  src={genreIcons[value.toLowerCase()]}
                  className={classes.genreImage}
                  height={30}
                  alt={label}
                />
              </ListItemIcon>
              <ListItemText primary={label} />
            </ListItem>
          </Link>
        ))}
      </List>
      <Divider />
      <List>
        <ListSubheader>Жанры</ListSubheader>
        {isFetching ? (
          <Box display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        ) : data.genres.map(({ name, id }) => (
          <Link key={name} className={classes.links} to="/">
            <ListItem onClick={() => dispatch(selectGenreOrCategory(id))} button>
              <ListItemIcon>
                <img src={genreIcons[name.toLowerCase()]} className={classes.genreImage} height={30} />
              </ListItemIcon>
              <ListItemText primary={name} />
            </ListItem>
          </Link>
        ))}
      </List>
    </>
  );
}

export default Sidebar;
