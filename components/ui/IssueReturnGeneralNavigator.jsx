import { createStackNavigator } from "@react-navigation/stack";
import { useSelector } from "react-redux";
import { ROLES } from "../auth/role";
import IssueReturnGeneral from "../screens/IssueReturnGeneral/IssueReturnGeneral";
import IssueReturnGeneralData from "../screens/IssueReturnGeneral/IssueReturnGeneralData";
import IssueReturnGeneralEdit from "../screens/IssueReturnGeneral/IssueReturnGeneralEdit";

const Stack = createStackNavigator();

function IssueReturnGeneralNavigator() {
  const userRole = useSelector((state) => state?.auth?.user?.role);

  const renderScreens = () => {
    switch (userRole) {
      case ROLES.ADMIN:
        return (
          <Stack.Navigator
            initialRouteName="IssueReturnGeneral"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="IssueReturnGeneral" component={IssueReturnGeneral} />
            <Stack.Screen name="IssueReturnGeneralData" component={IssueReturnGeneralData} />
            <Stack.Screen name="IssueReturnGeneralEdit" component={IssueReturnGeneralEdit} />
          </Stack.Navigator>
        );
      case ROLES.NORMAL:
        return (
          <Stack.Navigator
            initialRouteName="IssueReturnGeneral"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="IssueReturnGeneral" component={IssueReturnGeneral} />
            <Stack.Screen name="IssueReturnGeneralData" component={IssueReturnGeneralData} />
            <Stack.Screen name="IssueReturnGeneralEdit" component={IssueReturnGeneralEdit} />
          </Stack.Navigator>
        );
      case ROLES.VIEW_ONLY:
        return (
          <Stack.Navigator
            initialRouteName="IssueReturnGeneralData"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="IssueReturnGeneralData" component={IssueReturnGeneralData} />
          </Stack.Navigator>
        );
      default:
        return null;
    }
  };

  return renderScreens();
}

export default IssueReturnGeneralNavigator;