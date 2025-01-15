import { createStackNavigator } from "@react-navigation/stack";
import GRNReturnGeneral from "../screens/GRNReturnGeneral/GRNReturnGeneral";
import GRNReturnGeneralData from "../screens/GRNReturnGeneral/GRNReturnGeneralData";
import GRNReturnGeneralEdit from "../screens/GRNReturnGeneral/GRNReturnGeneralEdit";
import { useSelector } from "react-redux";
import { ROLES } from "../auth/role";

const Stack = createStackNavigator();

function GRNReturnGeneralNavigator() {
  const userRole = useSelector((state) => state?.auth?.user?.role);

  const renderScreens = () => {
    switch (userRole) {
      case ROLES.ADMIN:
        return (
          <Stack.Navigator
            initialRouteName="GRNReturnGeneral"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="GRNReturnGeneral" component={GRNReturnGeneral} />
            <Stack.Screen name="GRNReturnGeneralData" component={GRNReturnGeneralData} />
            <Stack.Screen name="GRNReturnGeneralEdit" component={GRNReturnGeneralEdit} />
          </Stack.Navigator>
        );
      case ROLES.NORMAL:
        return (
          <Stack.Navigator
            initialRouteName="GRNReturnGeneral"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="GRNReturnGeneral" component={GRNReturnGeneral} />
            <Stack.Screen name="GRNReturnGeneralData" component={GRNReturnGeneralData} />
            <Stack.Screen name="GRNReturnGeneralEdit" component={GRNReturnGeneralEdit} />
          </Stack.Navigator>
        );
      case ROLES.VIEW_ONLY:
        return (
          <Stack.Navigator
            initialRouteName="GRNReturnGeneralData"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="GRNReturnGeneralData" component={GRNReturnGeneralData} />
          </Stack.Navigator>
        );
      default:
        return null;
    }
  };

  return renderScreens();
}

export default GRNReturnGeneralNavigator;