import React from "react";
import Menu from "../menubar/Menu";
import "./Notifications.css";
import { Message } from "primereact/message";
import { DataView } from "primereact/dataview";
import { Card } from "primereact/card";

class Notifications extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      FoodItems: [],
      layout: "list",
      title: "",
    };

    this.itemTemplate = this.itemTemplate.bind(this);

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

    this.existingExpired = () => {
      let numberOfExpiredFoodItems = 0;

      for (let aliment of this.state.FoodItems) {
        if (
          aliment.expirationDate.substring(0, 10) <
            new Date().getFullYear() +
              "-" +
              new Date().getMonth() +
              1 +
              "-" +
              new Date().getDate() &&
          aliment.status === "AVAILABLE"
        ) {
          numberOfExpiredFoodItems += 1;
        }
      }

      return numberOfExpiredFoodItems;
    };

    this.gonnaExpire = () => {
      let nrFoodItemsGonnaExpire = 0;

      for (let aliment of this.state.FoodItems) {
        let daysUntilExpire = this.daysUntil(aliment.expirationDate);

        if (daysUntilExpire <= 3) {
          nrFoodItemsGonnaExpire += 1;
        }
      }

      return nrFoodItemsGonnaExpire;
    };
  }

  async componentDidMount() {
    const SERVER = "http://localhost:8080/api/users";
    const userId = JSON.parse(localStorage.getItem("user")).id;

    const response = await fetch(`${SERVER}/${userId}/FoodItems`);
    if (response.ok) {
      const alim = await response.json();
      this.setState({
        FoodItems: alim,
      });

      this.notificationsNumber();
    } else {
      alert("HTTP-error: " + response.status);
    }
  }

  notificationsNumber = () => {
    let FoodItemsGonnaExpire = [];
    for (let aliment of this.state.FoodItems) {
      let daysUntilExpire = this.daysUntil(aliment.expirationDate);
      if (daysUntilExpire <= 3) {
        FoodItemsGonnaExpire.push(aliment);
      }
    }
    this.setState({
      title: `You have ${FoodItemsGonnaExpire.length} notifications.`,
    });
  };

  itemTemplate(aliment) {
    if (!aliment) {
      return;
    }

    return this.renderListItem(aliment);
  }

  renderListItem(data) {
    return (
      <>
        {data.status === "AVAILABLE" ? (
          <div>
            {data.expirationDate.substring(0, 10) <
            new Date().getFullYear() +
              "-" +
              new Date().getMonth() +
              1 +
              "-" +
              new Date().getDate() ? (
              <div className="notification">
                <Message
                  className="msg"
                  severity="error"
                  text={
                    "Aliment " +
                    data.name +
                    " expired on " +
                    data.expirationDate.substring(0, 10)
                  }
                />
              </div>
            ) : (
              <>
                {" "}
                {this.daysUntil(data.expirationDate) <= 3 ? (
                  <div className="notification">
                    <Message
                      text={
                        "Aliment " +
                        data.name +
                        " is going to expire in " +
                        this.daysUntil(data.expirationDate) +
                        " days"
                      }
                    />
                  </div>
                ) : (
                  <> </>
                )}
              </>
            )}
          </div>
        ) : (
          <div className="notification">
            {" "}
            <Message
              text={"The aliment " + data.name + " is reserved."}
            />{" "}
          </div>
        )}
      </>
    );
  }

  render() {
    return (
      <div>
        <Menu />
        <h1>Notifications</h1>
        <div>
          <div className="card">
            {this.existingExpired() > 0 || this.gonnaExpire() > 0 ? (
              <Card title={this.state.title}>
                <DataView
                  value={this.state.FoodItems}
                  layout={this.state.layout}
                  itemTemplate={this.itemTemplate}
                  rows={8}
                />
              </Card>
            ) : (
              <Card
                title="Notification"
                style={{
                  width: "20rem",
                  marginBottom: "2.5em",
                  marginLeft: "25px",
                }}
              >
                <p >
                  No new notifications
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Notifications;
