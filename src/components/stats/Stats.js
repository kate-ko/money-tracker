import React, { Component } from 'react';
import AxiosFuncs from '../utils/AxiosFuncs';
import './stats.css';

// Components
import SimpleLineChart from './SimpleLineChart';
import CategoryPieChart from './CategoryPieChart';

class Stats extends Component {
  constructor() {
    super()
    this.state = {
      isLoading: true,
      allRecords: ""
    }
  }

  componentDidMount() {
    this.props.changeSelected("Stats")
    this.getRecords();
  }

  getRecords = () => {
    AxiosFuncs.getDataFromDB().then(result => {
      let allRecords = result.data[0].record
      allRecords.sort((a, b) => (new Date(b.date) - new Date(a.date)));
      this.setState({ allRecords, isLoading: false });
    }).catch(function (error) {
      console.log(error);
    })
  }

  changeInput = (event) => this.setState({
    [event.target.name]: event.target.value
  })

  render() {
    //console.log(this.state.allRecords)
    return (
    <div>
      <SimpleLineChart allRecords={this.state.allRecords}/>
      <CategoryPieChart allRecords={this.state.allRecords}/>
    </div>)
  }
}

export default Stats;
