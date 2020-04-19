import React from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import { ProfileProvider, useProfileProvider } from 'contexts/profile';
import HomePage from 'features/HomePage';
import Dashboard from 'features/Dashboard';
import Colony from 'features/Colony';
import Registration from 'features/Registration';
import Animals from './components/Animals';
import SingleAnimal from './components/SingleAnimal';


/**
 * Renders a react-router enabled app with a wrapper to facilitate shared styles
 * and markup; add new routes for pages here.
 */
const App = () => (
  <Router>
    <ProfileProvider>
      <Switch>
        <ProtectedRoute exact path="/dashboard" component={Dashboard} />
        <ProtectedRoute path="/dashboard/colony" component={Colony} />
        <ProtectedRoute path="/animals/:id" component={Animals} />
        <ProtectedRoute path="/animal/:id" component={SingleAnimal} />
        <Route exact path="/" component={HomePage} />
        <Route exact path="/registration" component={Registration} />
      </Switch>
    </ProfileProvider>
  </Router>
);


const ProtectedRoute = (props) => {
  const { state: { loggedIn } } = useProfileProvider();

  if (!loggedIn) return <Redirect to="/" />;

  return (<Route {...props} />);
};

export default App;
