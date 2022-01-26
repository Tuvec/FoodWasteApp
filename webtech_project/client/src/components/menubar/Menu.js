import React from "react";
import { Menubar } from "primereact/menubar";
import { withRouter } from "react-router-dom";

class Menu extends React.Component {
  constructor() {
    super();

    this.state = {
      displayConfirmation: false,
    };

    this.items = [
      {
        label: "My profile",
        items: [
          {
            label: "Profile settings",
            url: "http://localhost:3000/profile",
          },
          {
            label: "My FoodItems",
            items: [
              {
                label: "Add new Food Item",
                url: "http://localhost:3000/add-new-foodItem",
              },
              {
                label: "See all FoodItems",
                url: "http://localhost:3000/my-FoodItems",
              },
            ],
          },
          {
            label: "Reserved FoodItems",
            url: "http://localhost:3000/reserved-FoodItems",
          },
          {
            separator: true,
          },
          {
            label: "Export FoodItems",
            items: [
              {
                label: "Facebook",
                command: () => {
                  window.FB.ui(
                    {
                      method: "share",
                      href: "https://newfood.ro/",
                    },
                    function (response) {}
                  );
                },
              },
            ],
          },
        ],
      },
      {
        label: "Available FoodItems",
        url: "http://localhost:3000/FoodItems",
      },
      {
        label: "Friends",

        items: [
          {
            label: "Add a new friend",
            url: "http://localhost:3000/add-friend",
          },
          {
            label: "See all friends",
            url: "http://localhost:3000/friends",
          },
        ],
      },
      {
        label: "Notifications",
        url: "http://localhost:3000/notifications",
      },
      {
        label: "Log out",
        command: () => {
          localStorage.removeItem("user");
          this.props.history.push("/");
        },
      },
    ];
  }

  render() {
    return (
      <>
        <Menubar
          style={{
            backgroundColor: "#c5a9c9",
            marginBottom: "20px",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: "2",
          }}
          model={this.items}
        />
      </>
    );
  }
}

export default withRouter(Menu);
