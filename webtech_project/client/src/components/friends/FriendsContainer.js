import React from "react";
import { DataView } from "primereact/dataview";
import Menu from "../menubar/Menu";
import "../FoodItems/FoodItems.css";

class FriendsContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      friends: [],
    };
    this.itemTemplate = this.itemTemplate.bind(this);
  }

  async componentDidMount() {
    const SERVER = "http://localhost:8080/api/users";
    const currentUserId = JSON.parse(localStorage.getItem("user")).id;
    const response = await fetch(`${SERVER}/${currentUserId}/friends`);
    if (response.ok) {
      const friends = await response.json();
      this.setState({
        friends: friends,
      });
    } else {
      alert("HTTP-Error" + response.status);
    }
  }

  itemTemplate(friend) {
    if (!friend) {
      return;
    }

    return this.renderListItem(friend);
  }

  renderListItem(data) {
    return (
      <div
        className="p-col-12"
        style={{ backgroundColor: "#ebebeb", borderTop: "1px solid lightgray" }}
      >
        <div className="product-list-item">
          <img
            src={`images/unknown-user.png`}
            onError={(e) =>
              (e.target.src =
                "https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png")
            }
            alt={data.name}
          />
          <div className="product-list-detail">
            <div className="product-name">{data.name}</div>
            <div style={{ marginTop: "15px" }}>
              <i className="pi pi-envelope product-category-icon"></i>
              <span className="product-category">{data.email}</span>
            </div>
            <div style={{ marginTop: "15px" }} className="product-weight">
              {" "}
              <i className="pi pi-user product-category-icon"></i>{" "}
              {data.userName}
            </div>
          </div>
          <div className="product-weight">
            {" "}
            <i className="pi pi-tag"></i> {data.tag}
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
        <h1 style={{ marginTop: "0px", marginBottom: "10px" }}>Friends</h1>
        <div>
          <div className="card">
            <DataView
              value={this.state.friends}
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

export default FriendsContainer;
