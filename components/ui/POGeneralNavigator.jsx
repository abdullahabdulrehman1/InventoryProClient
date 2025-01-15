import { createStackNavigator } from "@react-navigation/stack";
import POGeneral from "../screens/POGeneral/POGeneral";
import POGeneralData from "../screens/POGeneral/POGeneralData";
import POGeneralEdit from "../screens/POGeneral/POGeneralEdit";
import { useSelector } from "react-redux";
import { ROLES } from "../auth/role";

const Stack = createStackNavigator();

function POGeneralNavigator() {
  const userRole = useSelector((state) => state?.auth?.user?.role);

  const renderScreens = () => {
    switch (userRole) {
      case ROLES.ADMIN:
        return (
          <Stack.Navigator
            initialRouteName="POGeneral"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="POGeneral" component={POGeneral} />
            <Stack.Screen name="POGeneralData" component={POGeneralData} />
            <Stack.Screen name="POGeneralEdit" component={POGeneralEdit} />
          </Stack.Navigator>
        );
      case ROLES.NORMAL:
        return (
          <Stack.Navigator
            initialRouteName="POGeneral"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="POGeneral" component={POGeneral} />
            <Stack.Screen name="POGeneralData" component={POGeneralData} />
            <Stack.Screen name="POGeneralEdit" component={POGeneralEdit} />
          </Stack.Navigator>
        );
      case ROLES.VIEW_ONLY:
        return (
          <Stack.Navigator
            initialRouteName="POGeneralData"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="POGeneralData" component={POGeneralData} />
          </Stack.Navigator>
        );
      default:
        return null;
    }
  };

  return renderScreens();
}

export default POGeneralNavigator;