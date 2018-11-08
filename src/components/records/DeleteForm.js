import React, { Component } from 'react';
import './delete-form.css';
import AxiosFuncs from '../utils/AxiosFuncs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


class DeleteForm extends Component {
  deleteRecord = () => {
    AxiosFuncs.deleteRecord(this.props.recordIdToDelete).then( res => {
      this.props.closeDeleteForm();
      this.props.getRecords();
    }).catch(err => console.log(err));
  }

  render() {
    return (
      <div className="delete-form">
        <div className="close-button"><FontAwesomeIcon onClick={this.props.closeDeleteForm} icon="window-close" /></div>
        <div>Are you sure you want to delete this record? </div>
        <div className="div-button">
          <button onClick={this.deleteRecord}>YES</button>
          <span> </span>
          <button onClick={this.props.closeDeleteForm}>NO</button>
        </div>
      </div>
    )
  }
}

export default DeleteForm;

