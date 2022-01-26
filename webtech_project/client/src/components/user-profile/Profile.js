import React from "react";
import Menu from "../menubar/Menu";
import "./user.css";
import "primeflex/primeflex.css";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

class Profile extends React.Component {
  constructor(props) {
    super(props);

    const SERVER = "http://localhost:8080";
    const user = JSON.parse(localStorage.getItem("user"));

    this.state = {
      userId: user.id,
      userName: user.userName,
      email: user.email,
      firstName: user.name.split(" ")[0],
      lastName: user.name.split(" ")[1],
      editMode: false,
      message: "",
      statusOk: true,
      toastBR: "",
    };

    this.handleClick = async () => {
      if (!this.state.editMode) {
        this.setState({
          editMode: true,
        });
      } else {
        if (this.isCorrectlyCompleted()) {
          const response = await fetch(`${SERVER}/api/users/${user.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userName: this.state.userName,
              email: this.state.email,
              name: `${this.state.firstName} ${this.state.lastName}`,
            }),
          });
          if (response.ok) {
            let updatedUser = await response.json();
            this.setState({
              message: "Changes were successfully applied!",
              statusOk: true,
              editMode: false,
            });
            localStorage.setItem("user", JSON.stringify(updatedUser));
            setTimeout(() => {
              this.setState({ message: "" });
            }, 2500);
          } else {
            if (response.status === 409) {
              this.setState({
                message: "Oops, this user already exists!",
                statusOk: false,
              });
            } else {
              this.setState({
                message: "A problem has occured. Try again later.",
                statusOk: false,
              });
            }
          }
        }
      }
    };

    this.isCorrectlyCompleted = () => {
      let matches = /^[a-zA-Z]+$/;
      if (
        this.state.firstName.length < 3 ||
        this.state.firstName.length > 30 ||
        !this.state.firstName.match(matches)
      ) {
        this.setState({
          message: "Firstname must have between 3 and 30 characters!",
          statusOk: false,
        });
        return false;
      } else {
        if (
          this.state.lastName.length < 3 ||
          this.state.lastName.length > 30 ||
          !this.state.lastName.match(matches)
        ) {
          this.setState({
            message: "Lastname must have between 3 and 30 characters!",
            statusOk: false,
          });
          return false;
        } else {
          let emailMatch =
            /^[a-zA-Z0-9.*-_]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
          if (
            this.state.email.length < 8 ||
            this.state.email.length > 30 ||
            !this.state.email.match(emailMatch)
          ) {
            this.setState({
              message: "Email must have between 8 and 30 characters!",
              statusOk: false,
            });
            return false;
          } else {
            if (
              this.state.userName.length < 3 ||
              this.state.userName.length > 20
            ) {
              this.setState({
                message: "Username must have between 3 and 20 characters!",
                statusOk: false,
              });
              return false;
            } else {
              this.setState({
                message: "",
                statusOk: true,
              });
              return true;
            }
          }
        }
      }
    };
  }

  render() {
    return (
      <>
        <div
          id="background"
          style={{ background: "antiquewhite" }}
        ></div>
                <h1 style={{ marginTop: "0px", marginBottom: "30px", fontStyle: 'normal',backgroundColor:'#C9906F' }}>Anti Food Waste App</h1>

        <Menu />
        <h1 style={{ marginTop: "0px", marginBottom: "30px", fontStyle: 'normal',backgroundColor:'#C9906F' }}>My Profile</h1>

        <div id="formContainer" >
          <div className="p-grid">
            <div className="p-md-6">
              <label htmlFor="username">Username</label>
              <div className="p-inputgroup">
                <InputText
                  placeholder="Username"
                  id="username"
                  type="text"
                  value={this.state.userName}
                  readOnly={!this.state.editMode}
                  onChange={(e) => {
                    this.setState({ userName: e.target.value });
                  }}
                />
              </div>
            </div>

            <div className="p-md-6">
              <label htmlFor="email">Email</label>
              <div className="p-inputgroup">
                <InputText
                  placeholder="Email"
                  id="email"
                  type="email"
                  value={this.state.email}
                  readOnly={!this.state.editMode}
                  onChange={(e) => {
                    this.setState({ email: e.target.value });
                  }}
                />
              </div>
            </div>

            <div className="p-md-6">
              <label htmlFor="firstname6">First name</label>
              <div className="p-inputgroup">
                <InputText
                  placeholder="First Name"
                  id="firstname"
                  type="text"
                  value={this.state.firstName}
                  readOnly={!this.state.editMode}
                  onChange={(e) => {
                    this.setState({ firstName: e.target.value });
                  }}
                />
              </div>
            </div>

            <div className="p-md-6">
              <label htmlFor="firstname6">Last name</label>
              <div className="p-inputgroup">
                <InputText
                  placeholder="Last Name"
                  id="lastname"
                  type="text"
                  value={this.state.lastName}
                  readOnly={!this.state.editMode}
                  onChange={(e) => {
                    this.setState({ lastName: e.target.value });
                  }}
                />
              </div>
            </div>
          </div>
          <p id={this.state.statusOk ? "message" : "errorMessage"}>
            {this.state.message}
          </p>
          <div className="buttons">
            <Button
              id="editButton"
              style={{ background: "rgb(215,204,200)" }}
              label={this.state.editMode ? "Save changes" : "Edit"}
              type="button"
              onClick={this.handleClick}
            />
          </div>
        </div>
        <Toast ref={(el) => (this.toastBR = el)} position="bottom-right" />
      </>
    );
  }
}

export default Profile;
