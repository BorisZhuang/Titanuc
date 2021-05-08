import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import Loading from "./components/Loading";
import LandingPage from './views/LandingPage';
import Chat from "./views/Chat";
import Profile from "./views/Profile";
import { useAuth0 } from "@auth0/auth0-react";
import history from "./utils/history";

// styles
import "./App.css";

// fontawesome
//import initFontAwesome from "./utils/initFontAwesome";
//initFontAwesome();

const App = () => {
  const { isLoading, error, isAuthenticated } = useAuth0();

  if (error) {
    return <div>Oops... {error.message}</div>;
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Router history={history}>
      <div id="app" className="d-flex flex-column h-100">
        <Switch>
          {isAuthenticated
            ? <Route path="/" component={Chat} />
            : <Route path="/" component={LandingPage} />}
          <Route path="/profile" component={Profile} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
