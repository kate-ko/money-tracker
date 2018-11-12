import React, { Component } from 'react';
import moment from 'moment';
import AxiosFuncs from '../utils/AxiosFuncs';
import './records.css';
import loader from '../img/money-loader.gif';

// Components
import AddForm from './AddForm';
import EditForm from './EditForm';
import DeleteForm from './DeleteForm';

// Font awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Records extends Component {
  constructor() {
    super()
    this.fields = ["Date", "Type", "Category", "Method", "Amount", "Currency", "Comments"]
    this.currencyIcon = { "NIS": "shekel-sign", "EUR": "euro-sign", "USD": "dollar-sign" }
    this.itemsPerPageOptions = [10, 20, 50, 100]
    this.state = {
      isLoading: true,
      allRecords: "",
      total: "",
      itemsPerPage: 10,
      textTosearch: "",
      startDate: "2018-01-01",
      endDate: "",
      currentPage: 1,
      showAddForm: false,
      recordIdToEdit: -1, // if -1 nothing to edit,
      recordIdToDelete: -1 // if -1 nothing to delete,
    }
  }

  componentDidMount() {
    this.props.changeSelected("Records")
    this.getRecords();
    let date = new Date();
    date = moment(date).format("YYYY-MM-DD");
    this.setState({ endDate: date })
  }

  getRecords = () => {
    AxiosFuncs.getDataFromDB().then(result => {
      let allRecords = result.data[0].record
      let total = allRecords.length
      //allRecords.sort((a, b) => (new Date(b.date) - new Date(a.date))); 
      this.setState({ allRecords, isLoading: false, total });
    }).catch(function (error) {
      console.log(error);
    })
  }

  changeInput = (event) => this.setState({
    [event.target.name]: event.target.value
  })

  changePage = (action) => {
    let currentPage = this.state.currentPage
    action === "plus" ? currentPage++ : currentPage--
    this.setState({ currentPage })
    this.getCurrentRecords();
  }

  showLoader = () => this.state.isLoading ? <div className="loading"> <img alt="loader" src={loader} /></div> : null

  // Top bar menu
  showSearchBar = () => <div className="search-bar">
    From: <input type="date" name="startDate" value={this.state.startDate} onChange={this.changeInput}></input><span> </span>
    To: <input type="date" name="endDate" value={this.state.endDate} onChange={this.changeInput}></input><span> </span>
    <input type="text" placeholder="Search comment" name="textTosearch" value={this.state.textTosearch} onChange={this.changeInput}></input>
  </div>

  showTotal = () =>
    <div className="total">
      Total: <span> </span>
      {this.state.total}
    </div>

  showItemsPerPage = () =>
    <div className="itemsPerPage">
      Show: <span> </span>
      <select name="itemsPerPage" value={this.state.itemsPerPage} onChange={this.changeInput}>
        {this.itemsPerPageOptions.map(m => <option key={m} value={m}>{m}</option>)}
      </select>
    </div>

  showPagination = (startIndex, endIndex, lastPage) =>
    <div className="pagination">
      {this.state.currentPage !== 1 ? <FontAwesomeIcon onClick={(e) => this.changePage("minus")} icon="angle-left" size="1x" /> : null}
      <span> </span> {startIndex} - {endIndex} <span> </span>
      {this.state.currentPage !== lastPage ? <FontAwesomeIcon onClick={() => this.changePage("plus")} icon="angle-right" size="1x" /> : null}
    </div>

  // 
  showHeader = () => <div id="grid-header">
    {this.fields.map((f, i) => <div key={i}>{f}</div>)}
  </div>

  showAddForm = () => {
    this.setState({ showAddForm: true })
  }

  // Close Forms Functions
  closeAddForm = () => this.setState({ showAddForm: false })
  closeEditForm = () => this.setState({ recordIdToEdit: -1 })
  closeDeleteForm = () => this.setState({ recordIdToDelete: -1 })

  // Filter records by date and comment
  getCurrentRecords = () => {
    let itemsPerPage = parseInt(this.state.itemsPerPage)
    let records = [...this.state.allRecords]
    let startIndex = (this.state.currentPage - 1) * itemsPerPage + 1
    let endIndex = startIndex + itemsPerPage - 1
    records = records.filter(c =>
      (c["comment"].toLowerCase().includes(this.state.textTosearch.toLowerCase()))
      && (c.date >= this.state.startDate || this.state.startDate === "")
      && (c.date <= this.state.endDate || this.state.endDate === "")
    )
    let lastPage = Math.ceil(records.length / itemsPerPage)
    records = records.slice(startIndex - 1, endIndex)
    return { records, startIndex, endIndex, lastPage }
  }

  renderRecords = (records) =>
    <div id="grid-container">
      {this.showHeader()}
      {records.map(c => {
        let date = moment(c.date).format("MM/DD/YY")
        return (
          <div className="item" key={c.id}>
            <div>{date}</div>
            <div>{c.type ? <FontAwesomeIcon icon="plus" /> : <FontAwesomeIcon icon="minus" />}</div>
            <div>{c.category.name}</div>
            <div>{c.paymentMethod.name === "cash" ? <FontAwesomeIcon icon="money-bill-alt" /> : <FontAwesomeIcon icon="credit-card" />} </div>
            <div>{c.amount}</div>
            <div><FontAwesomeIcon icon={this.currencyIcon[c.currency]} /></div>
            <div>{c.comment}</div>
            <div>
              <FontAwesomeIcon icon="trash-alt" onClick={() => this.deleteRecord(c.id)} />
              <span> </span>
              <FontAwesomeIcon icon="edit" onClick={() => this.editRecord(c.id)} />
            </div>
          </div>)
      })}
    </div>

  editRecord = (id) => {
    this.setState({ recordIdToEdit: id })
  }

  deleteRecord = (id) => {
    this.setState({ recordIdToDelete: id })
  }

  render() {
    let { records, startIndex, endIndex, lastPage } = this.getCurrentRecords()

    return (
      <div className="container">
        <div className="row-bar">
          {this.showSearchBar()}
          {this.showTotal()}
          {this.showItemsPerPage()}
          {this.showPagination(startIndex, endIndex, lastPage)}
        </div>
        {this.renderRecords(records)}
        {this.state.showAddForm ? <AddForm closeAddForm={this.closeAddForm} getRecords={this.getRecords} addRecord={this.addRecord} /> : null}
        {(this.state.recordIdToEdit !== -1) ? <EditForm closeEditForm={this.closeEditForm} recordIdToEdit={this.state.recordIdToEdit} records={records} getRecords={this.getRecords} /> : null}
        {(this.state.recordIdToDelete !== -1) ? <DeleteForm closeDeleteForm={this.closeDeleteForm} recordIdToDelete={this.state.recordIdToDelete} getRecords={this.getRecords} /> : null}
        {this.showLoader()}
        <div className="dot"> <FontAwesomeIcon size='6x' onClick={() => this.showAddForm()} icon="plus" /></div>
      </div>
    )
  }
}

export default Records;
