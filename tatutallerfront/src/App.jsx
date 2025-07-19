import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import AdminPanel from './Features/AdminPanel';
import OtherFeature from './Features/OtherFeature'; // Example for other features
import './styles/App.css'; // Assuming you have some global styles

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/admin" component={AdminPanel} />
          <Route path="/other" component={OtherFeature} />
          {/* Add more routes as needed */}
          <Route path="/" exact>
            <h1>Welcome to the Application</h1>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;