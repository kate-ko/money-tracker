import React, { Component } from 'react';
import { PieChart, Pie, Tooltip} from 'recharts';
import moment from 'moment';

/* example of data 
const data01 = [{ name: 'Group A', value: 400 },
{ name: 'Group B', value: 300, fill: "red" },
{ name: 'Group C', value: 300 , fill: "blue"}, { name: 'Group D', value: 200 },
{ name: 'Group E', value: 278 }, { name: 'Group F', value: 189 }] */

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', 
'#3e4af9' , '#f95d3e', '#d3f93e', '#b560f2', '#f24b7a', '#9bf998'];

class CategoryPieChart extends Component {
  constructor() {
    super()
    this.state = {
      allRecords: [],
      months: [],
      selectedMonth: "10/18",
      type: "expense"
    }
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

  // Aggregate expenses by category
  aggregate() {
    let allRecords = this.props.allRecords;
    let startDate = this.getDateFromMonth(this.state.selectedMonth, "")
    let endDate = this.getDateFromMonth(this.state.selectedMonth, "end")
    let table = {}
    let data = []
    let type = this.state.type === "expense" ? 0 : 1;

    if (allRecords.length !== 0) {
      allRecords.map(element => {
        if (element.date >= startDate && element.date < endDate && element.type === type) {
          table[element.category.name] = table[element.category.name] + element.amount ||
                                         element.amount 
        }
      })
      Object.keys(table).map(element => data.push({ name: element, value: table[element]}));
      data.sort((a, b) => (b.value - a.value));
      data.forEach((obj, index) => obj.fill = COLORS[index % COLORS.length]);
    }
    return data;
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

  inputChange = (event) => this.setState({
    [event.target.name]: event.target.value
  })

  showFilter = (months) =>
    <div className="select-month">
      <select name="selectedMonth" value={this.state.selectedMonth} onChange={this.inputChange} >
        {months.map(m => <option key={m} value={m}>{m}</option>)}
      </select><span> </span>
      <select name="type" value={this.type} onChange={this.inputChange} >
        <option value="expense">expense</option>
        <option value="income">income</option>
      </select>
    </div>

  render() {
    let data = this.aggregate();
    let months = this.generateSelectMonths();

    return (
      <div className="chart-box">
        <div className="chart-name">Income and expenses per month</div>
        {this.showFilter(months)}
        <PieChart width={400} height={400}>
          <Pie isAnimationActive={false} dataKey="value" data={data} cx={200} cy={200} outerRadius={150} fill="#8884d8" label />
          <Tooltip />
        </PieChart>
      </div>
    );
  }
}

export default CategoryPieChart;
