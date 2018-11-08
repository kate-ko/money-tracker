import React, { Component } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import moment from 'moment';

class SimpleLineChart extends Component {
  constructor() {
    super()
    this.state = {
      allRecords: [],
      months: [],
      startDate: "",
      endDate: ""
    }
  }

  componentDidMount() {
    let today = new Date();
    let currentYear = moment(today).format("YY")
    let startDate = '01/' + currentYear
    let endDate = moment(today).format("MM/YY");
    this.setState({ startDate, endDate })
  }

  // generate months in format "04/18" for select field from the earliest month there is a record for
  generateSelectMonths() {
    let allRecords = this.props.allRecords
    let months = []
    let key = ""

    if (allRecords.length !== 0) {
      let startDate = allRecords.sort((a, b) => (new Date(a.date) - new Date(b.date)))[0].date
      let { startMonth, startYear, currentMonth, currentYear } = this.getDatesSelect(startDate)

      for (let year = startYear; year <= currentYear; year++) {
        for (let month = startMonth; month <= currentMonth; month++) {
          month = (month < 10) ? ('0' + month) : month
          key = `${month}/${year}` 
          // let m = moment(month).format("MMM")
          // key = `${month} ${year}`
          months.push(key)
        }
      }
    }
    return months;
  }

  getDatesSelect(startDate) {
    let today = new Date();
    let currentYear = parseInt(moment(today).format("YY"))
    let currentMonth = parseInt(moment(today).format("MM"))
    let startYear = parseInt(moment(startDate).format("YY"))
    let startMonth = parseInt(moment(startDate).format("MM"))
    return { startMonth, startYear, currentMonth, currentYear }
  }

  // Aggregate income and expenses by months and fills the table
  aggregate() {
    let allRecords = this.props.allRecords;
    let startDate = this.getDateFromMonth(this.state.startDate, "")
    let endDate = this.getDateFromMonth(this.state.endDate, "end")
    let table = this.generateMonthTable()
    let month = ""
    let data = []

    if (allRecords.length !== 0) {
      for (let element of allRecords) {
        month = moment(element.date).format("MM/YY");
        if (element.date >= startDate && element.date < endDate) {
          if (element.type === 0) {
            table[month].expense = table[month].expense + element.amount
          }
          else {
            table[month].income = table[month].income + element.amount
          }
        }
      }
    }
    if (table.length !== 0) {
      for (let element of Object.keys(table)) {
        data.push({ month: element, expense: table[element].expense, income: table[element].income })
      }
    }
    return data
  }

  // get month in format 04/18 and return 2018-04-01
  getDateFromMonth(month, flag) {
    if (month !== undefined) {
      if (month.includes('/')) {
        let arr = month.split("/")
        return flag === 'end' ? `20${arr[1]}-${arr[0] + 1}-01` : `20${arr[1]}-${arr[0]}-01`
      }
    }
    return month
  }

  // generate table for aggregation and fill it with 0 
  generateMonthTable() {
    let allRecords = this.props.allRecords
    let table = {}
    let key = ""
    if (allRecords.length !== 0) {
      let start = this.parseDate(this.state.startDate)
      let end = this.parseDate(this.state.endDate)

      for (let year = start.year; year <= end.year; year++) {
        for (let month = start.month; month <= end.month; month++) {
          month = (month < 10) ? ('0' + month) : month
          key = `${month}/${year}`
          table[key] = { income: 0, expense: 0 }
        }
      }
    }
    return table;
  }

  // gets date in format '05/18' and return month and year separately
  parseDate(date) {
    let month = parseInt(date.split('/')[0])
    let year = parseInt(date.split('/')[1])
    return { month, year }
  }

  inputChange = (event) => this.setState({
    [event.target.name]: event.target.value
  })

  showDateFilter = (months) =>
    <div className="select-month">
      <select name="startDate" value={this.state.startDate} onChange={this.inputChange} >
        {months.map(m => <option key={m} value={m}>{m}</option>)}
      </select>
      <span> </span>
      <select name="endDate" value={this.state.endDate} onChange={this.inputChange} >
        {months.map(m => <option key={m} value={m}>{m}</option>)}
      </select>
    </div>

  render() {
    let data = this.aggregate();
    let months = this.generateSelectMonths();

    return (
      <div className="chart-box">
        <div className="chart-name">Income and expenses for period</div>
        {this.showDateFilter(months)}
        <LineChart width={600} height={400} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" padding={{ left: 30, right: 30 }} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="income" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="expense" stroke="#82ca9d" />
        </LineChart>
      </div>
    );
  }
}

export default SimpleLineChart
