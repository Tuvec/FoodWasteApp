import React from "react";
import "./FoodItems.css";
import { DataView } from "primereact/dataview";
import { Button } from "primereact/button";
import Menu from "../menubar/Menu";
import { Toast } from "primereact/toast";


class FoodItems extends React.Component {
  constructor() {
    super();
    this.state = {
      FoodItems: [],
      layout: "grid",
      itemBackgroundColor: "",
    };

    this.itemTemplate = this.itemTemplate.bind(this);

    this.setFoodItemsImage = (FoodItems) => {
      let fooditems = FoodItems;

      for (let FoodItems of fooditems) {
        switch (FoodItems.category) {
          case "Vegetables":
            FoodItems.image =
              "https://images.unsplash.com/photo-1597362925123-77861d3fbac7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80";
            break;
          case "Fruits":
            FoodItems.image =
              "https://images.unsplash.com/photo-1610832958506-aa56368176cf?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80";
            break;
          case "Meat":
            FoodItems.image =
              "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80";
            break;
          case "Fish":
            FoodItems.image =
              "https://images.unsplash.com/photo-1611171711912-e3f6b536f532?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80";
            break;
          case "Dairy":
            FoodItems.image =
              "https://images.unsplash.com/photo-1628088062854-d1870b4553da?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80";
            break;
          default:
            break;
        }
      }
      return fooditems;
    };

    this.handleClick = async (data) => {
      const FoodItemsId = data.id;
      const FoodItemsUserId = data.userId;

      const currentUserId = JSON.parse(localStorage.getItem("user")).id;
      if (FoodItemsUserId !== currentUserId) {
        const res = await fetch(
          `http://localhost:8080/api/users/${currentUserId}/reservations`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              date: new Date().toISOString(),
              FoodItemsIds: [FoodItemsId],
            }),
          }
        );

        if (res.ok) {
          const newReservation = await res.json();
          const response = await fetch(
            `http://localhost:8080/api/users/${FoodItemsUserId}/FoodItems/${FoodItemsId}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                ...data,
                status: "RESERVED",
                reservationId: newReservation.id,
              }),
            }
          );

          if (response.ok) {
            const updatedFoodItems = await response.json();
            let newFoodItems = this.state.FoodItems;
            const foundIndex = newFoodItems.findIndex(
              (FoodItems) => FoodItems.id === updatedFoodItems.id
            );
            if (foundIndex !== -1) {
              newFoodItems[foundIndex] = updatedFoodItems;
              newFoodItems = this.setFoodItemsImage(newFoodItems);
              this.setState({ FoodItems: newFoodItems });
            }
          } else {
            alert(response.status);
          }
        } else {
          alert(res.status);
        }
      }
    };

    this.daysUntil = (data) => {
      let yearNow = parseInt(new Date().getFullYear());
      let monthNow = parseInt(new Date().getMonth() + 1);
      let dayNow = parseInt(new Date().getDate());

      if (yearNow === data.substring(0, 4)) {
        if (monthNow === data.substring(5, 7)) {
          return data.substring(8, 10) - dayNow;
        }
      }
      return data.substring(8, 10) - dayNow; //return 5;
    };
  }

  async componentDidMount() {
    const response = await fetch(`http://localhost:8080/api/FoodItems`);

    const FoodItems = await response.json();
    console.log(FoodItems)
    let fooditems = this.setFoodItemsImage(FoodItems);
    this.setState({
      FoodItems: fooditems,
    });
  }

  itemTemplate(FoodItems) {
    if (!FoodItems) {
      return;
    }
    return this.renderGridItem(FoodItems);
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
        console.log(this.daysUntil(data.expirationDate));
        if (this.daysUntil(data.expirationDate) <= 0) {
          background = "#cf6b5f";
        } else if (this.daysUntil(data.expirationDate) <= 3) {
          background = "#ebe4ab";
        }
      }
    }
    return background;
  }

  renderGridItem(data) {
    return (
      <>

        <div class="product-card">
          <div class="badge border" style={{ backgroundColor: "orange" }}>{data.status}</div>
          <div class="product-tumb" style={{ backgroundColor: this.setItemBackgroundColor(data) }}>
            <img src={`${data.image}`}
              onError={(e) =>
              (e.target.src =
                "")
              }
              alt={data.name}></img>
          </div>
          <div class="product-details">
            <div>
              <span class="d-inline-block float-left">
                <i class="bi bi-tags"></i>
              </span>
              <span class="product-catagory  d-inline-block  ">
                &nbsp; <u>Category:</u>
              </span>
            </div>
            <h5>{data.category ? data.category.toUpperCase() : "-"}</h5>
            <div>
              <span class="d-inline-block float-left">
                <h5 class="bi bi-bag"></h5>
              </span>
              <span class="product-catagory d-inline-block font-weight-bold "
              >
                &nbsp; <u>Name:</u>
              </span>
            </div>
            <h4>{data.name}</h4>

            <div>
              <span class="d-inline-block float-left">
                <h5 class="bi bi-card-text"></h5>              </span>
              <span class="product-catagory d-inline-block font-weight-bold "
              >
                &nbsp; <u>Ingredients:</u>
              </span>
            </div>
            <div class="rounded border border-dark border-2 p-2">
              <h5>{data.ingredients}</h5>
            </div>

            <div class="product-bottom-details">

              <div>
                <span class="d-inline-block float-left">
                  <h5 class="bi-alarm"></h5>
                </span>
                <span class="product-catagory d-inline-block font-weight-bold "
                >
                  &nbsp; <u>Expirey Date:</u>
                </span>
              </div>
              <div class="product-price">{data.expirationDate.substring(0, 10)}</div>

              <div class="product-links">
                <span class="d-inline-block float-right">
                  <h5 class="bi bi-speedometer2"></h5>
                </span>
                <span class="product-catagory d-inline-block font-weight-bold "
                >
                  <u>Weight:</u>&nbsp;
                </span>
              </div>
              <p class="float-right">
                {data.weight} Kg
              </p>
            </div>
            
            <Button
              label="GET IT"
              disabled={data.status === "RESERVED"}
              onClick={() => this.handleClick(data)}
            ></Button>
            
          </div>
        </div>
      </>
    );
  }

  render() {
    return (
      <>
        <div
          id="background"
        ></div>
        <h1 style={{ marginTop: "0px", marginBottom: "10px",fontStyle:"normal",backgroundColor:'#C9906F' }}>Anti Food Waste App</h1>
        <Menu />
        <div>
          <div>
            <DataView
              value={this.state.FoodItems}
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

export default FoodItems;
