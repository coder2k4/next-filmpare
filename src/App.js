import { useRef } from 'react';

import { CssBaseline, Switch } from '@mui/material';
import { Route } from 'react-router-dom';

import useStyles from './styles';
import NavBar from './components/NavBar/NavBar';

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
            {/* <MovieInformation /> */}
          </Route>
          <Route exact path="/actors/:id">
            {/* <Actors /> */}
          </Route>
          <Route exact path={['/', '/approved']}>
            {/* <Movies /> */}
          </Route>
          <Route exact path="/profile/:id">
            {/* <Profile /> */}
          </Route>
        </Switch>
      </main>
      <div ref={alanBtnContainer} />
    </div>
  );
}

export default App;
