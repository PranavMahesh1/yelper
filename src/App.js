import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import HomePage from './components/HomePage';
import Details from './components/Details';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

function App() {

  return (
  // Define the path and what component to use at the path using routes
    <Router>
      <Switch>
        <Route path="/details">
          <Details />
        </Route>

        <Route path="/">
          <HomePage />
        </Route>

      </Switch>
    </Router>

  );
}

export default App;
