import { useRef } from 'react';

import { CssBaseline } from '@mui/material';
import { Route, Switch } from 'react-router-dom';

import useStyles from './styles';
import NavBar from './components/NavBar/NavBar';
import Movies from './components/Movies/Movies';
import Profile from './components/Profile/Profile';
import MovieInformation from './components/MovieInformation/MovieInformation';
import Actors from './components/Actors/Actors';

function App() {
  const classes = useStyles();
  const alanBtnContainer = useRef();

  return (
    <div className={classes.root}>
      <CssBaseline />
      <NavBar />
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Switch>
          <Route exact path="/movie/:id">
            <MovieInformation />
          </Route>
          <Route exact path="/actors/:id">
            <Actors />
          </Route>
          <Route exact path={['/', '/approved']}>
            <Movies />
          </Route>
          <Route exact path="/profile/:id">
            <Profile />
          </Route>
        </Switch>
      </main>
      <div ref={alanBtnContainer} />
    </div>
  );
}

export default App;
