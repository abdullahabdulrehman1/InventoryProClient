import { createStackNavigator } from "@react-navigation/stack";
import { useSelector } from "react-redux";
import { ROLES } from "../auth/role";
import IssueGeneral from "../screens/IssueGeneral/IssueGeneral";
import IssueGeneralData from "../screens/IssueGeneral/IssueGeneralData";
import IssueGeneralEdit from "../screens/IssueGeneral/IssueGeneralEdit";

const Stack = createStackNavigator();

function IssueGeneralNavigator() {
  const userRole = useSelector((state) => state?.auth?.user?.role);

  const renderScreens = () => {
    switch (userRole) {
      case ROLES.ADMIN:
        return (
          <Stack.Navigator
            initialRouteName="IssueGeneral"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="IssueGeneral" component={IssueGeneral} />
            <Stack.Screen name="IssueGeneralData" component={IssueGeneralData} />
            <Stack.Screen name="IssueGeneralEdit" component={IssueGeneralEdit} />
          </Stack.Navigator>
        );
      case ROLES.NORMAL:
        return (
          <Stack.Navigator
            initialRouteName="IssueGeneral"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="IssueGeneral" component={IssueGeneral} />
            <Stack.Screen name="IssueGeneralData" component={IssueGeneralData} />
            <Stack.Screen name="IssueGeneralEdit" component={IssueGeneralEdit} />
          </Stack.Navigator>
        );
      case ROLES.VIEW_ONLY:
        return (
          <Stack.Navigator
            initialRouteName="IssueGeneralData"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="IssueGeneralData" component={IssueGeneralData} />
          </Stack.Navigator>
        );
      default:
        return null;
    }
  };

  return renderScreens();
}

export default IssueGeneralNavigator;