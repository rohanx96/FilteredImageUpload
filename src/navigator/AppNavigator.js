import { createStackNavigator, createAppContainer } from "react-navigation";
import routes from "./routes";

const routerConfig = {
  defaultNavigationOptions: {
    header: null
  }
};

const AppNavigator = createStackNavigator(routes, routerConfig);

export default createAppContainer(AppNavigator);
