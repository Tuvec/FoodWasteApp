import { BrowserRouter, Route } from "react-router-dom";
import FoodItems from "./components/FoodItems/FoodItems";

import Login from "./components/home/Login";
import NewAccount from "./components/home/NewAccount";
import AddAliment from "./components/user-profile/AddFoodItem";
import Profile from "./components/user-profile/Profile";
import UserAlimentsContainer from "./components/user-profile/UserFoodItems";
import UserReservedFoodItemsContainer from "./components/user-profile/UserReservedFoodItemsContainer";
import NotificationsContainer from "./components/notifications/Notifications";
import AddFriend from "./components/friends/AddFriend";
import FriendsContainer from "./components/friends/FriendsContainer";

function App() {
  return (
    <BrowserRouter>
      <Route exact path="/" component={Login} />
      <Route exact path="/create-account" component={NewAccount} />
      <Route exact path="/sign-in" component={Login} />
      <Route exact path="/FoodItems" component={FoodItems} />
      <Route exact path="/profile" component={Profile} />
      <Route exact path="/add-new-foodItem" component={AddAliment} />
      <Route exact path="/my-FoodItems" component={UserAlimentsContainer} />
      <Route
        exact
        path="/reserved-FoodItems"
        component={UserReservedFoodItemsContainer}
      />
      <Route exact path="/notifications" component={NotificationsContainer} />
      <Route exact path="/add-friend" component={AddFriend} />
      <Route exact path="/friends" component={FriendsContainer} />
    </BrowserRouter>
  );
}

export default App;
