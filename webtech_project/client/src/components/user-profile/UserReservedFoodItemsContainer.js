import React from "react";
import { DataView } from "primereact/dataview";
import Menu from "../menubar/Menu";

class UserReservedFoodItemsContainer extends React.Component {
  constructor() {
    super();

    this.state = {
      reservations: [],
      FoodItems: [],
      layout: "list",
    };

    this.itemTemplate = this.itemTemplate.bind(this);

    this.setAlimentImage = (FoodItems) => {
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
    const currentUserId = JSON.parse(localStorage.getItem("user")).id;

    const response = await fetch(`${SERVER}/${currentUserId}/reservations`);
    if (response.ok) {
      const reservations = await response.json();
      let reservAlim = [];
      for (let reserv of reservations) {
        reservAlim.push(reserv.aliments[0]);
      }
      reservAlim = this.setAlimentImage(reservAlim);
      this.setState({
        reservations: reservations,
        FoodItems: reservAlim,
      });
    } else {
      alert("Http error: " + response.status);
    }
  }

  itemTemplate(reservation) {
    if (!reservation) {
      return;
    }

    return this.renderListItem(reservation);
  }

  setItemBackgroundColor(data) {
    let background = "";

    if (this.daysUntil(data.expirationDate) > 3) {
      background = "#bae3ba";
    } else if (this.daysUntil(data.expirationDate) <= 0) {
      background = "#cf6b5f";
    } else {
      background = "#ebe4ab";
    }

    return background;
  }

  renderListItem(data) {
    return (
      <div class="product-card">
        <div class="badge border" style={{ backgroundColor: "orange" }}>
          {data.status}
        </div>
        <div
          class="product-tumb"
          style={{
            backgroundColor: this.setItemBackgroundColor(data.aliments[0]),
          }}
        >
          <img
            src={`${data.aliments[0].image}`}
            onError={(e) => (e.target.src = "")}
            alt={data.aliments[0].name}
          ></img>
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
          <h5>
            {data.aliments[0].category
              ? data.aliments[0].category.toUpperCase()
              : "-"}
          </h5>
          <div>
            <span class="d-inline-block float-left">
              <h5 class="bi bi-bag"></h5>
            </span>
            <span class="product-catagory d-inline-block font-weight-bold ">
              &nbsp; <u>Name:</u>
            </span>
          </div>
          <h4>{data.aliments[0].name}</h4>

          <div>
            <span class="d-inline-block float-left">
              <h5 class="bi bi-card-text"></h5>{" "}
            </span>
            <span class="product-catagory d-inline-block font-weight-bold ">
              &nbsp; <u>Ingredients:</u>
            </span>
          </div>
          <div class="rounded border border-dark border-2 p-2">
            <h5>{data.aliments[0].ingredients}</h5>
          </div>

          <div class="product-bottom-details">
            <div>
              <span class="d-inline-block float-left">
                <h5 class="bi-alarm"></h5>
              </span>
              <span class="product-catagory d-inline-block font-weight-bold ">
                &nbsp; <u>Expirey Date:</u>
              </span>
            </div>
            <div class="product-price">
              {data.aliments[0].expirationDate.substring(0, 10)}
            </div>

            <div class="product-links">
              <span class="d-inline-block float-right">
                <h5 class="bi bi-speedometer2"></h5>
              </span>
              <span class="product-catagory d-inline-block font-weight-bold ">
                <u>Weight:</u>&nbsp;
              </span>
            </div>
            <p class="float-right">{data.aliments[0].weight} Kg</p>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <>
        <div
          id="background"
          style={{ backgroundImage: "url(/images/green-leaves.svg)" }}
        ></div>
        <h1
          style={{
            marginTop: "0px",
            marginBottom: "30px",
            fontStyle: "normal",
            backgroundColor: "#C9906F",
          }}
        >
          Anti Food Waste App
        </h1>

        <Menu />
        <h1
          style={{
            marginTop: "0px",
            marginBottom: "30px",
            fontStyle: "normal",
            backgroundColor: "#C9906F",
          }}
        >
          My Reservations
        </h1>

        <div>
          <div className="card">
            <DataView
              value={this.state.reservations}
              layout={this.state.layout}
              itemTemplate={this.itemTemplate}
              rows={8}
            />
          </div>
        </div>
      </>
    );
  }
}

export default UserReservedFoodItemsContainer;
