import React from "react";
import "../FoodItems/FoodItems.css";
import { DataView } from "primereact/dataview";
import { Button } from "primereact/button";
import Menu from "../menubar/Menu";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";

class UserFoodItems extends React.Component {
  constructor() {
    super();

    const SERVER = "http://localhost:8080/api/users";

    this.state = {
      FoodItems: [],
      layout: "list",
      displayConfirmation: false,
      message: "",
      statusOk: true,
      displayDialog: false,
      selectedItem: null,
      toastBR: "",
      id: "",
      name: "",
      ingredients: "",
      weight: "",
    };

    this.itemTemplate = this.itemTemplate.bind(this);

    this.setFoodItemImage = (FoodItems) => {
      let alim = FoodItems;

      for (let aliment of alim) {
        switch (aliment.category) {
          case "Vegetables":
            aliment.image =
              "https://images.unsplash.com/photo-1597362925123-77861d3fbac7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80";
            break;
          case "Fruits":
            aliment.image =
              "https://images.unsplash.com/photo-1610832958506-aa56368176cf?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80";
            break;
          case "Meat":
            aliment.image =
              "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80";
            break;
          case "Fish":
            aliment.image =
              "https://images.unsplash.com/photo-1611171711912-e3f6b536f532?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80";
            break;
          case "Dairy":
            aliment.image =
              "https://images.unsplash.com/photo-1628088062854-d1870b4553da?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80";
            break;
          default:
            break;
        }
      }
      return alim;
    };

    this.handleEditClick = (data) => {
      this.setState({
        selectedItem: data,
        displayDialog: true,
        id: data.id,
        name: data.name,
        ingredients: data.ingredients,
        weight: data.weight,
      });
    };

    this.showDeleteDialog = (data) => {
      this.setState({
        displayConfirmation: true,
        selectedItem: data,
      });
    };

    this.handleDeleteAliment = async (selectedAliment) => {
      const userId = JSON.parse(localStorage.getItem("user")).id;
      const foodItemId = this.state.selectedItem.id;

      const response = await fetch(
        `${SERVER}/${userId}/FoodItems/${foodItemId}`,
        {
          method: "DELETE",
        }
      );

      if (response.status === 204) {
        const FoodItemsAfterDelete = this.state.FoodItems;
        const foundIndex = FoodItemsAfterDelete.findIndex(
          (foodItem) => foodItem.id === foodItemId
        );
        if (foundIndex !== -1) {
          FoodItemsAfterDelete.splice(foundIndex, 1);
          this.setState({
            FoodItems: FoodItemsAfterDelete,
          });
          this.onHide();
          this.showBottomRightSuccess("Food Item was successfully deleted!");
        }
      }
    };

    this.onHide = () => {
      this.setState({
        displayDialog: false,
        displayConfirmation: false,
      });
    };

    this.saveChanges = async () => {
      if (this.isCorrectlyCompleted()) {
        const userId = JSON.parse(localStorage.getItem("user")).id;
        const response = await fetch(
          `${SERVER}/${userId}/FoodItems/${this.state.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...this.state.selectedItem,
              name: this.state.name,
              ingredients: this.state.ingredients,
              weight: this.state.weight,
            }),
          }
        );
        if (response.ok) {
          const updatedFoodItem = await response.json();
          let newFoodItems = this.state.FoodItems;
          const foundIndex = newFoodItems.findIndex(
            (foodItem) => foodItem.id === updatedFoodItem.id
          );
          if (foundIndex !== -1) {
            newFoodItems[foundIndex] = updatedFoodItem;
            newFoodItems = this.setFoodItemImage(newFoodItems);
            this.setState({ FoodItems: newFoodItems, selectedItem: null });
            this.showBottomRightSuccess("Food item was successfully modified!");
            this.onHide();
          }
        } else {
          this.showBottomRightError("An error has occured");
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
          message: "The food item must have at least 3 letters!",
          statusOk: false,
        });
        return false;
      } else {
        if (!this.state.weight || this.state.weight < 0) {
          this.setState({
            message: "The food item weight must be properly completed!",
            statusOk: false,
          });
          return false;
        } else {
          if (!this.state.ingredients || this.state.ingredients.length < 2) {
            this.setState({
              message: "Ingredients must have at least 2 letters!",
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

    this.shareOnFacebook = () => {
      window.FB.ui(
        {
          method: "share",
          href: "https://alimentespeciale.ro/", //'https://developers.facebook.com/docs/'   /*http://localhost:3000/FoodItems*/
        },
        function (response) { }
      );
    };

    this.daysUntil = (data) => {
      let today = new Date();

      let yearNow = String(today.getFullYear());
      let monthNow = String(today.getMonth() + 1).padStart(2, "0");
      let dayNow = String(today.getDate()).padStart(2, "0");

      if (yearNow === data.substring(0, 4)) {
        if (monthNow === data.substring(5, 7)) {
          return data.substring(8, 10) - dayNow;
        }
      }
      return 5;
    };
  }

  async componentDidMount() {
    const SERVER = "http://localhost:8080/api/users";
    const userId = JSON.parse(localStorage.getItem("user")).id;

    const response = await fetch(`${SERVER}/${userId}/FoodItems`);
    if (response.ok) {
      const FoodItems = await response.json();
      let alim = this.setFoodItemImage(FoodItems);
      this.setState({
        FoodItems: alim,
      });
    } else {
      alert("HTTP-error: " + response.status);
    }
  }

  itemTemplate(aliment) {
    if (!aliment) {
      return;
    }

    return this.renderListItem(aliment);
  }

  showBottomRightSuccess(detail) {
    this.toastBR.show({
      severity: "success",
      summary: "Success",
      detail: `${detail}`,
      life: 3000,
    });
  }

  showBottomRightError(detail) {
    this.toastBR.show({
      severity: "error",
      summary: "Error",
      detail: `${detail}`,
      life: 3000,
    });
  }

  setItemBackgroundColor(data) {
    let background = "";

    if (
      this.daysUntil(data.expirationDate) > 3 &&
      data.status === "AVAILABLE"
    ) {
      background = "#bae3ba";
    } else {
      if (data.status === "AVAILABLE") {
        if (this.daysUntil(data.expirationDate) <= 0) {
          background = "#cf6b5f";
        } else if (this.daysUntil(data.expirationDate) <= 3) {
          background = "#ebe4ab";
        }
      } else {
        background = "#ebebeb";
      }
    }
    return background;
  }

  renderListItem(data) {
    return (
      <a href="#" class="list-group-item list-group-item-action d-flex gap-3 py-3 m-2" aria-current="true">
        <div style={{
          backgroundColor: this.setItemBackgroundColor(data),
        }}
          class="rounded border p-2 flex-shrink-0">
          <img
            src={data.image} alt="twbs" width="150" height="150" ></img>
        </div>

        <div class="d-flex gap-2 w-100 justify-content-between m-2 " >
          <div >
            {/* <------------Name---------> */}
            &nbsp;
            <h6 class="mb-0 bi bi-bag">
              <span class="product-catagory d-inline-block font-weight-bold "
              >
                &nbsp; <u>Name:</u>
              </span>
              &nbsp;{data.name.toUpperCase()}
            </h6>
            {/* <-------Category---------> */}
            &nbsp;
            <h6 class="mb-0 bi bi-tags float-left">
              <span class="product-catagory d-inline-block font-weight-bold "
              >
                &nbsp; <u>Category:</u>
              </span>
              &nbsp;{data.category}&nbsp;
            </h6>

            {/* <-------weight---------> */}
            &nbsp; &nbsp;
            <h6 class="mb-0 bi bi-speedometer2 float-left">
              <span class="product-catagory d-inline-block font-weight-bold "
              >
                &nbsp; <u>Weight:</u>
              </span>
              &nbsp;{data.weight}kg&nbsp;&nbsp;
            </h6>
            {/* <-------Expiry---------> */}
            &nbsp;
            <h6 class="mb-0 bi-alarm float-left">
              <span class="product-catagory d-inline-block font-weight-bold "
              >
                &nbsp; <u>Expirey Date:</u>
              </span>
              &nbsp;{data.expirationDate.substring(0, 10)}
              &nbsp;&nbsp;
            </h6>

            {/* <-------Ingredents---------> */}

            <br></br>
            &nbsp;&nbsp;
            <h6 class="mb-0 bi bi-card-text  d-inline-block">
              <span class="product-catagory font-weight-bold  d-inline-block "
              >
                &nbsp; <u>Ingredients:</u>
              </span>
              &nbsp;{data.ingredients}
            </h6>
          </div>

          <Button
            className="block-btn"
            label="Edit"
            style={{ margin: "25px" }}
            onClick={() => this.handleEditClick(data)}
          />
          <Button
            className="p-button-danger block-btn"
            label="Delete"
            style={{ margin: "25px" }}
            onClick={() => this.showDeleteDialog(data)}
          />
        </div>
      </a>
    );
  }

  renderFooter() {
    return (
      <div>
        <Button
          label="No"
          icon="pi pi-times"
          onClick={() => this.onHide()}
          className="p-button-text"
        />
        <Button
          label="Yes"
          icon="pi pi-check"
          onClick={() => this.handleDeleteAliment(this.state.selectedItem)}
          autoFocus
        />
      </div>
    );
  }

  render() {
    return (
      <>
        <div
          id="background"
        ></div>
        <h1 style={{ marginTop: "0px", marginBottom: "30px", fontStyle: 'normal', backgroundColor: '#C9906F' }}>Anti Food Waste App</h1>

        <Menu />
        <h1 style={{ marginTop: "0px", marginBottom: "30px", fontStyle: 'normal', backgroundColor: '#C9906F' }}>My FoodItems</h1>
        <div>
          <div className="card">
            <DataView
              value={this.state.FoodItems}
              layout={this.state.layout}
              itemTemplate={this.itemTemplate}
              rows={4}
            />
            <Button
              id="btnShare"
              label="Share on Facebook"
              icon="pi pi-send"
              className="p-button-rounded p-button-warning"
              onClick={this.shareOnFacebook}
            />
          </div>
        </div>
        <Dialog
          header="Edit Food Item"
          visible={this.state.displayDialog}
          style={{ width: "50vw" }}
          onHide={this.onHide}
        >
          {this.state.selectedItem && (
            <>
              <div id="edit">
                <div class="form-group col-12 ">
                  <h5>Item Name:</h5>
                  <InputText
                    placeholder={this.state.name}
                    value={this.state.name}
                    className="inputs"
                    onChange={(e) => this.setState({ name: e.target.value })}
                  />
                </div>

                <div class="form-group col-12 ">
                  <h5>Ingredients:</h5>
                  <InputText
                    required
                    placeholder={this.state.ingredients}
                    value={this.state.ingredients}
                    className="inputs"
                    onChange={(e) =>
                      this.setState({ ingredients: e.target.value })
                    }
                  />
                </div>

                <div class="form-group col-12 ">
                  <h5>Weight:</h5>
                  <InputText
                    required
                    placeholder={this.state.weight}
                    value={this.state.weight}
                    className="inputs"
                    onChange={(e) => this.setState({ weight: e.target.value })}
                  />
                </div>

              </div>
              <p id="errorMessage">{this.state.message}</p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "30px",
                }}
              >
                <Button label="Apply" onClick={this.saveChanges} />
              </div>
            </>
          )}
        </Dialog>
        <Dialog
          header="Delete Food Item"
          visible={this.state.displayConfirmation}
          modal
          style={{ width: "350px" }}
          footer={this.renderFooter()}
          onHide={() => this.onHide()}
        >
          <div className="confirmation-content">
            <i
              className="pi pi-exclamation-triangle p-mr-3"
              style={{ fontSize: "2rem" }}
            />
            <span>Are you sure you want to delete this Food Item?</span>
          </div>
        </Dialog>
        <Toast ref={(el) => (this.toastBR = el)} position="bottom-right" />
      </>
    );
  }
}

export default UserFoodItems;
