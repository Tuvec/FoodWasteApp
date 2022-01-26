import React from "react";
import Menu from "../menubar/Menu";
import "./user.css";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

class AddFoodItem extends React.Component {
  constructor(props) {
    super(props);

    const SERVER = "http://localhost:8080/api/users";
    this.state = {
      name: "",
      weight: "",
      ingredients: "",
      category: "",
      date: null,
      message: "",
      statusOk: true,
      toastBR: "",
    };

    this.categories = [
      "Vegetables",
      "Fruits",
      "Dairy",
      "Fish",
      "Meat"
    ];

    this.handleClick = async () => {
      if (this.isCorrectlyCompleted()) {
        const currentUserId = JSON.parse(localStorage.getItem("user")).id;
        const response = await fetch(`${SERVER}/${currentUserId}/FoodItems`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: this.state.name,
            category: this.state.category,
            expirationDate: this.state.date.toISOString(),
            ingredients: this.state.ingredients,
            weight: this.state.weight,
          }),
        });
        if (response.ok) {
          await response.json();
          this.setState({
            message: "Food Item was successfully added to your FoodItems list!",
            name: "",
            weight: "",
            ingredients: "",
            category: "",
            date: null,
          });
        } else {
          if (response.status === 404) {
            this.setState({
              message: "Oops! A problem has occured. Try again later.",
            });
          } else {
            this.setState({
              message: "Oops! A problem has occured. Try again later.",
            });
          }
        }
      }
    };

    this.isCorrectlyCompleted = () => {
      const match = /^[0-9]+$/;
      if (
        this.state.name.length < 3 ||
        !this.state.name ||
        this.state.name.match(match)
      ) {
        this.setState({
          message: "The Food Item must have at least 3 letters!",
          statusOk: false,
        });
        return false;
      } else {
        if (!this.state.weight || this.state.weight < 0) {
          this.setState({
            message: "The Food Item weight must be properly completed!",
            statusOk: false,
          });
          return false;
        } else {
          if (!this.state.date) {
            this.setState({
              message: "Please select the Food Item expiration date!",
              statusOk: false,
            });
            return false;
          } else if (!this.state.category) {
            this.setState({
              message: "Please select a category for the Food Item!",
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
    };
  }

  render() {
    return (
      <>
        <h1 style={{ marginTop: "0px", marginBottom: "30px", fontStyle: 'normal',backgroundColor:'#C9906F' }}>Anti Food Waste App</h1>

        <Menu />
        <h1 style={{ marginTop: "0px", marginBottom: "30px", fontStyle: 'normal',backgroundColor:'#C9906F' }}>Add New Food Item</h1>
        <form id="formContainer">
          <div class="form-group row">
            <h5 for="inputEmail3" class="col-sm-2 col-form-label">Item Name:</h5>
            <div class="col-sm-10">
              <InputText
                placeholder="Food Item name"
                id="name"
                type="text"
                value={this.state.name}
                onChange={(e) => this.setState({ name: e.target.value })}
              />
            </div>
          </div>
          <div class="form-group row">
            <h5 for="inputPassword3" class="col-sm-2 col-form-label">Weight:</h5>
            <div class="col-sm-10">
              <InputText
                placeholder="Weight"
                id="weight"
                type="text"
                value={this.state.weight}
                onChange={(e) => this.setState({ weight: e.target.value })}
              />
            </div>
          </div>
          <div class="form-group row">
            <h5 for="inputPassword3" class="col-sm-2 col-form-label">Category:</h5>
            <div class="col-sm-10">
              <Dropdown
                placeholder="Select a category"
                value={this.state.category}
                options={this.categories}
                onChange={(e) => {
                  this.setState({ category: e.target.value });
                }}
              />
            </div>
          </div>

          <div class="form-group row">
            <h5 for="inputPassword3" class="col-sm-2 col-form-label">Expiry Date:</h5>
            <div class="col-sm-10">
              <Calendar
                placeholder="Select expiration date"
                dateFormat="yy-mm-dd"
                value={this.state.date}
                onChange={(e) => this.setState({ date: e.target.value })}
              />
            </div>
          </div>

          <div class="form-group row">
            <h5 for="inputPassword3" class="col-sm-2 col-form-label">Ingredients:</h5>
            <div class="col-sm-10">
              <InputText
                placeholder="Ingredients"
                id="ingredients"
                type="text"
                value={this.state.ingredients}
                onChange={(e) =>
                  this.setState({ ingredients: e.target.value })
                }
              />
            </div>
          </div>
          <p id={this.state.statusOk ? "message" : "errorMessage"}>
            {this.state.message}
          </p>
          <div className="buttons">
            <Button
              id="addButton"
              label="Add Food Item"
              type="button"
              onClick={this.handleClick}
            />
          </div>
        </form>
        <Toast ref={(el) => (this.toastBR = el)} position="bottom-right" />
      </>
    );
  }
}

export default AddFoodItem;
