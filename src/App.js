import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';

// Components
import Records from './components/records/Records'
import Home from './components/home/Home'
import Stats from './components/stats/Stats'

// Font awesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { faAngleLeft, faAngleRight, faCheck, faWindowClose, faPlus, faMinus, faMoneyBillAlt, faCreditCard, faTrashAlt, faShekelSign, faDollarSign, faEuroSign, faEdit } from '@fortawesome/free-solid-svg-icons';
library.add(faAngleLeft, faAngleRight, faCheck, faWindowClose, faPlus, faMinus, faMoneyBillAlt, faCreditCard, faTrashAlt, faShekelSign, faDollarSign, faEuroSign, faEdit);

class App extends Component {
  constructor() {
    super()
    this.tabs = ["Home", "Records", "Stats"]
    this.state = {
      selected: ""
    }
  }

  showNavBar = () => <div id="nav-bar">
    <ul id="nav-bar">
      {this.tabs.map((tab, i) =>
        <li key={i}>
          <Link className={this.state.selected === tab ? "selected" : ""} to={"/" + tab}>
            <span>{tab}</span>
          </Link>
        </li>)
      }
    </ul>
  </div>

  changeSelected = (tab) => this.setState({ selected: tab })

  render() {
    return (
      <Router>
        <div className="App">
          {this.showNavBar()}
          <Switch>
            <Route path="/records" exact render={() => <Records changeSelected={this.changeSelected} />} />
            <Route path="/home" exact render={() => <Home changeSelected={this.changeSelected} />} />} />
            <Route path="/stats" exact render={() => <Stats changeSelected={this.changeSelected} />} />} />
            <Route path="/" render={() => <Home />} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
