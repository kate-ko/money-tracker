import { observable, action } from "mobx";
import axios from 'axios';
class DataStore {
	@observable users = [];
	@observable children=[];
	@observable parent= "";
	@observable  selectedOption= 1;
	@observable addChildBox=false;
	@observable  currentUserIdForAddChild= {};


	@action closeAddBox = () => {
		console.log("close");
		this.addChildBox = false;
	}
	// @computed get iceCreamsFilteredCount() {
	// 	return this.filterIceCreams.length;
	// }
	// @action closeUpdateModal = () => {
	// 	this.showComponent = false;
	// }


	@action getChildren = () => {
		let userId = this.selectedOption;
		console.log("userId", userId);
		axios.get(`http://localhost:5001/getChildren/${userId}`)
			.then(result => {
				console.log(result.data);
				this.parent=result.data;
				this.children=result.data["Children"];
				console.log("this children",result.data["Children"]);
		})
	}

	addNewUserToState=(newUser)=>{
		this.users.push(newUser);
		console.log(this.users);

	}
	@action addChildToDb = (newUserData) => {
		newUserData["parentId"]=this.currentUserIdForAddChild;
		console.log("clickedChild", newUserData);
		axios.post('http://localhost:5001/addChild', newUserData, {
          headers: {
              'Content-Type': 'application/json',
          }
      }
      )
      .then(response => {
        console.log("response from DB",response);
        this.addNewUserToState(response.data)
      })
      .catch(function (error) {
        alert("Sorry, something wrong. New client haven't added.");
        console.log(error);
	  });
	  this.closeAddBox();
    console.log("Added to DB")
  }

//   updateClientDetailsDB = (data) =>{
//     console.log('DATA FOR DB', data);
//     axios.post('http://localhost:5000/updateClientInfo', data, {
//           headers: {
//               'Content-Type': 'application/json',
//           }
//       }
//       )
//       .then(response => {
//         console.log("response from DB",response);
//         // this.addNewClientToState(response.data)
//       })
//       .catch(function (error) {
//         alert("Sorry, something wrong. New client haven't added.");
//         console.log(error);
//       });
//       console.log("Updated in DB")
//   }

//     }

}

const store = new DataStore();
window.store = store;
export default store;