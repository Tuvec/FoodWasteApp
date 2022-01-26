import React from "react";
import { DataView } from "primereact/dataview";
import { Button } from "primereact/button";
import Menu from "../menubar/Menu";
import { Toast } from "primereact/toast";
import "../FoodItems/FoodItems.css";

class AddFriend extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
      friends: [],
      layout: "list",
      toastBR: "",
    };

    this.itemTemplate = this.itemTemplate.bind(this);

    this.handleAddClick = async (user) => {
      const SERVER = `http://localhost:8080/api/users`;
      const currentUserId = JSON.parse(localStorage.getItem("user")).id;

      const foundIndex = this.state.friends.findIndex(
        (u) => user.userName === u.userName
      );
      if (foundIndex !== -1) {
      } else {
        const postResponse = await fetch(`${SERVER}/${currentUserId}/friends`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userName: user.userName,
            name: user.name,
            email: user.email,
          }),
        });
        if (postResponse.ok) {
          await postResponse.json();
          let newFriends = this.state.friends;
          newFriends.push(user);
          this.setState({
            friends: newFriends,
          });
        }
      }
    };
  }

  async componentDidMount() {
    const SERVER = `http://localhost:8080/api/users`;
    const currentUserId = JSON.parse(localStorage.getItem("user")).id;

    const getResponse = await fetch(`${SERVER}/${currentUserId}/friends`);
    if (getResponse.ok) {
      const friends = await getResponse.json();
      this.setState({
        friends: friends,
      });
    }

    const response = await fetch("http://localhost:8080/api/users");
    if (response.ok) {
      const allUsers = await response.json();
      const foundCurrentUserIndex = allUsers.findIndex(
        (user) => user.id === currentUserId
      );
      if (foundCurrentUserIndex !== -1) {
        allUsers.splice(foundCurrentUserIndex, 1);
        this.setState({
          users: allUsers,
        });
      }
    } else {
      alert("HTTP-error: " + response.status);
    }
  }

  itemTemplate(user) {
    if (!user) {
      return;
    }

    return this.renderListItem(user);
  }

  checkFriend(user) {
    const foundIndex = this.state.friends.findIndex(
      (u) => user.userName === u.userName
    );
    if (foundIndex !== -1) {
      return true;
    }

    return false;
  }

  renderListItem(data) {
    return (
      <div
        style={{
          backgroundColor: "#ebebeb",
          width: "100%",
          borderTop: "1px solid lightgray",
        }}
      >
        <div className="p-col-12">
          <div className="product-list-item">
            <div className="product-list-detail" style={{ width: "70vw" }}>
              <div className="product-name">{data.name}</div>
              <div style={{ marginTop: "15px" }}>
                <span className="product-category">{data.email}</span>
              </div>
              <div className="product-weight">{data.userName}</div>
            </div>

            {!this.checkFriend(data) ? (
              <>
                <Button
                  label="Add friend"
                  style={{ marginTop: "20px", marginLeft: "30px" }}
                  onClick={() => this.handleAddClick(data)}
                />
              </>
            ) : (
              <p id="alreadyYourFriend">Already your friend</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <>
        <div id="background"></div>
        <Menu />
        <h1 style={{ marginTop: "0px", marginBottom: "10px" }}>Users</h1>
        <div>
          <div className="card">
            <DataView
              value={this.state.users}
              layout={this.state.layout}
              itemTemplate={this.itemTemplate}
              rows={8}
            />
          </div>
        </div>
        <Toast ref={(el) => (this.toastBR = el)} position="bottom-right" />
      </>
    );
  }
}

export default AddFriend;
