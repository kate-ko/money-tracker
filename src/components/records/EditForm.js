import React, { Component } from 'react';
import './form.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AxiosFuncs from '../utils/AxiosFuncs';

class EditForm extends Component {
  constructor() {
    super()
    this.categoriesExpense = [];
    this.categoriesIncome = [];
    this.currencies = ["NIS", "USD", "EUR"];
    this.state = {
      date: "",
      type: "",
      category: "",
      paymentMethod: "",
      amount: "",
      currency: "",
      comment: "",
      categoriesExpense: [],
      categoriesIncome: []
    }
  }

  componentDidMount() {
    this.getCategories();
    let id = this.props.recordIdToEdit;
    let record = this.props.records.find(r => r.id === id);
    let { date, type, category, paymentMethodId, amount, currency, comment } = record;
    type = type === 0 ? "Expense" : "Income";
    category = category.name;
    let paymentMethod = paymentMethodId === 0 ? "Cash" : "Card";
    this.setState({ date, type, category, paymentMethod, amount, currency, comment });
  }

  getCategories() {
    AxiosFuncs.getCategoriesFromDB()
      .then(result => {
        let categoriesExpense = result.data.filter(d => d.type === 0)
        let categoriesIncome = result.data.filter(d => d.type === 1)
        this.setState({ categoriesExpense, categoriesIncome })
      })
      .catch(err => console.log(err))
  }

  editRecord = () => {
    let category = (this.state.type === "Expense") ?
      this.state.categoriesExpense.find(d => d.name === this.state.category) :
      this.state.categoriesIncome.find(d => d.name === this.state.category);

    if (category === undefined) {
      category = (this.state.type === "Expense") ?
        this.state.categoriesExpense[0] : this.state.categoriesIncome[0];
    }
    let categoryid = category.id;
    let paymentmethodid = this.state.paymentMethod === "Cash" ? 0 : 1;
    let type = this.state.type === "Expense" ? 0 : 1;
    let { date, amount, currency, comment } = this.state;
    let id = this.props.recordIdToEdit;
    let newRecord = { id, date, type, categoryid, paymentmethodid, amount, currency, comment }

    AxiosFuncs.editRecord(newRecord).then(result => {
      this.props.closeEditForm();
      this.props.getRecords();
    }
    ).catch(err => console.log(err));
  }

  inputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    return (
      <div className="form">
        <div className="close-button"><FontAwesomeIcon onClick={this.props.closeEditForm} icon="window-close" /></div>
        <div>EDIT</div>
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

          <div> Amount</div><div> <input type="number" name="amount" value={this.state.amount} onChange={this.inputChange} /></div>

          <div> Currency: </div>
          <div className="sel"> <select name="currency" value={this.state.currency} onChange={this.inputChange} >
            {this.currencies.map((c, i) =>
              <option key={i} value={c}>{c}</option>
            )};
          </select></div>

          <div> Comment</div><div> <input type="text" name="comment" value={this.state.comment} onChange={this.inputChange} /> </div>
        </div>
        <div>
          <button onClick={this.editRecord}>Send</button>
        </div>
      </div>
    )
  }
}

export default EditForm;

