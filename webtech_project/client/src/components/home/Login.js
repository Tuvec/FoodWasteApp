import React from "react";
import "./Home.css";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { Link } from "react-router-dom";

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userName: "",
      password: "",
      errorMessage: "",
      display: "none",
    };

    const SERVER = "http://localhost:8080";

    this.isCorrectlyCompleted = () => {
      if (this.state.userName.length < 3 || this.state.userName.length > 20) {
        this.setState({
          errorMessage: "Username must have between 3 and 20 characters!",
        });
        return false;
      } else {
        let letters = /^[0-9a-zA-Z]+$/;
        if (
          this.state.password.length < 4 ||
          !this.state.password.match(letters)
        ) {
          this.setState({
            errorMessage: "Password must have at least 4 letters & numbers!",
          });
          return false;
        } else {
          this.setState({
            errorMessage: "",
          });
          return true;
        }
      }
    };

    this.handleSubmit = async () => {
      if (this.isCorrectlyCompleted()) {
        const response = await fetch(`${SERVER}/api/users/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userName: this.state.userName,
            password: this.state.password,
          }),
        });
        if (response.ok) {
          const user = await response.json();
          this.setState({
            display: "block",
          });
          localStorage.setItem("user", JSON.stringify(user));
          setTimeout(this.goToFoodItems, 1500);
        } else {
          this.setState({
            errorMessage: "Wrong username or password!",
          });
        }
      }
    };

    this.goToFoodItems = () => {
      this.props.history.push("/FoodItems");
    };
  }

  componentDidMount() {
    if (this.props.location.state) {
      this.setState({
        userName: this.props.location.state.userName,
        password: this.props.location.state.password,
      });
    }
  }

  render() {
    return (
      <>
        <div >
        <h1 style={{marginTop: "0px", marginBottom: "30px",fontStyle:'normal',backgroundColor:'#C9906F'}}>Anti Food Waste App</h1>

          <form class="center"
          style={{
            background: "#FFDEAD",
            }} >
          <h2><u>Sign-In</u></h2>
          <h1 class="bi bi-box-arrow-in-right"></h1>
            <div class="form-group col-12 ">
              <h5>Username:</h5>
              <InputText
                    placeholder="Username"
                    value={this.state.userName}
                    required
                    onChange={(e) =>
                      this.setState({ userName: e.target.value })
                    }
                  />
            </div>
            <div class="form-group col-12">
              <h5>Password:</h5>
              <InputText
                    type="password"
                    placeholder="Password"
                    value={this.state.password}
                    required
                    onChange={(e) =>
                      this.setState({ password: e.target.value })
                    }
                  />
            </div>
            <p id="errorMessage">{this.state.errorMessage}</p>
              <ProgressSpinner
                style={{
                  width: "40px",
                  height: "40px",
                  display: `${this.state.display}`,
                }}
              />
            <div >
                <Button
                  label="Sign in"
                  type="button"
                   style={{ marginLeft:25, backgroundColor:"#c5a9c9"}}
                  onClick={this.handleSubmit}
                />
              </div>
          <Link
              style={{marginTop: 15,marginLeft:45,alignSelf: "center" }}
              to="/create-account"
            >
              <u>{"Don't have an account? Sign up!"}</u>
            </Link>
          </form>
        </div>
      </>
    );
  }
}

export default Login;
