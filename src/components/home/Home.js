import React, { Component } from 'react'
import './Home.css';
import coins from '../img/coins.png';

class Home extends Component {
  componentDidMount() {
    this.props.changeSelected("Home")
  }

  render() {
    return (
      <div className="home">
        <div className="text">
          Welcome to the money tracking app. This app will help you to track your spendings and earning.
          In the tab "Records", you can add, delete and edit new records.
          In the tab "Stats", you can see charts reflecting your spending habits and see how you can improve.
          Stack:
          <ul>
            <li>React</li>
            <li>Node.js</li>
            <li>Express</li>
            <li>JavaScript, ES6</li>
            <li>PostgreSQL + Sequelize</li>
            <li>Recharts</li>
            <li>HTML5</li>
            <li>CSS3</li>
          </ul>
          <img alt="coins" src={coins} height="200" width="200"/>
        </div>
      </div>
    )

  }
}

export default Home;

