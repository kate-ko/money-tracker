import React, { Component } from 'react';
import './form.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AxiosFuncs from '../utils/AxiosFuncs';
import moment from 'moment';

class AddForm extends Component {
  constructor() {
    super()
    this.currencies = ["NIS", "USD", "EUR"]
    this.state = {
      date: "",
      type: "Expense",
      category: "",
      paymentMethod: "Cash",
      amount: 0,
      currency: "NIS",
      comment: "",
      categoriesExpense: [],
      categoriesIncome: [],
      isRed: ""
    }
  }

  componentDidMount() {
    this.getCategories();
  }

  getCategories() {
    AxiosFuncs.getCategoriesFromDB()
      .then(result => {
        let categoriesExpense = result.data.filter(d => d.type === 0)
        let categoriesIncome = result.data.filter(d => d.type === 1)
        let date = new Date();
        date = moment(date).format("YYYY-MM-DD")
        let category = categoriesExpense[0].name
        this.setState({ categoriesExpense, categoriesIncome, date, category })
      })
      .catch(err => {console.log(err); alert("Problem with DB")})
  }

  addRecord = () => {
    if (this.state.amount <= 0) {
      this.setState({isRed: "red"})
      return;
    }
    let category = (this.state.type === "Expense") ?
      this.state.categoriesExpense.filter(d => d.name === this.state.category) :
      this.state.categoriesIncome.filter(d => d.name === this.state.category)
    let categoryid = category[0].id
    let paymentmethodid = this.state.paymentMethod === "Cash" ? 0 : 1;
    let type = this.state.type === "Expense" ? 0 : 1;
    let { date, amount, currency, comment } = this.state;
    let newRecord = { date, type, categoryid, paymentmethodid, amount, currency, comment }
    AxiosFuncs.addRecord(newRecord).then(result => {
      this.props.closeAddForm();
      this.props.getRecords();
    }
    ).catch(err => console.log(err));
  }

  inputChange = (e) => {
    if (e.target.name === "type") {
      let category = "";
      category = (e.target.value === "Income") ? this.state.categoriesIncome[0].name :
                                                 this.state.categoriesExpense[0].name
      this.setState({ [e.target.name]: e.target.value, category}); 
      return;                                  
    }
    this.setState({ [e.target.name]: e.target.value, isRed: ""});
  }

  render() {
    return (
      <div className="form">
        <div className="close-button"><FontAwesomeIcon onClick={this.props.closeAddForm} icon="window-close" /></div>
        <div>ADD NEW</div>
        <div className="form-input">

          <div className="one-column1" onChange={this.inputChange} name="type">
            <div> Expense <input type="radio" checked={this.state.type === "Expense"} onChange={this.inputChange} value="Expense" name="type" /> </div><span> </span>
            <div> Income <input type="radio" checked={this.state.type === "Income"} onChange={this.inputChange} value="Income" name="type" /> </div>
          </div>
          <div className="one-column1" onChange={this.inputChange} name="paymentMethod">
            <div> Cash <input type="radio" checked={this.state.paymentMethod === "Cash"} onChange={this.inputChange} value="Cash" name="paymentMethod" /> </div><span> </span>
            <div> Card <input type="radio" checked={this.state.paymentMethod === "Card"} onChange={this.inputChange} value="Card" name="paymentMethod" /> </div>
          </div>

          <div> Date:</div><div> <input name="date" type="date" value={this.state.date} onChange={this.inputChange} /></div>

          <div> Category: </div>
          <div className="sel"> <select name="category" value={this.state.category} onChange={this.inputChange} >
            {this.state.type === "Expense" ? this.state.categoriesExpense.map((cat, i) =>
              <option key={i} value={cat.name}>{cat.name}</option>
            ) : this.state.categoriesIncome.map((cat, i) =>
              <option key={i} value={cat.name}>{cat.name}</option>)
            }
          </select></div>

          <div> Amount</div><div className={this.state.isRed}> <input type="number" name="amount" value={this.state.amount} onChange={this.inputChange} /> </div>

          <div> Currency: </div>
          <div className="sel"> <select name="currency" value={this.state.currency} onChange={this.inputChange} >
            {this.currencies.map((c, i) =>
              <option key={i} value={c}>{c}</option>
            )};
          </select></div>

          <div> Comment</div><div> <input type="text" name="comment" value={this.state.comment} onChange={this.inputChange} /> </div>
        </div>
        <div>
          <button onClick={this.addRecord}>Send</button>
        </div>
      </div>
    )
  }
}

export default AddForm;

