import { createStackNavigator } from "@react-navigation/stack";
import GRNGeneral from "../screens/GRNGeneral/GRNGeneral";
import GRNGeneralData from "../screens/GRNGeneral/GRNGeneralData";
import GRNGeneralEdit from "../screens/GRNGeneral/GRNGeneralEdit";
import { useSelector } from "react-redux";
import { ROLES } from "../auth/role";
import GRNPdfPage from "../screens/GRNGeneral/GRNPdfPage";

const Stack = createStackNavigator();

function GRNGeneralNavigator() {
  const userRole = useSelector((state) => state?.auth?.user?.role);

  const renderScreens = () => {
    switch (userRole) {
      case ROLES.ADMIN:
        return (
          <Stack.Navigator
            initialRouteName="GRNGeneral"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="GRNGeneral" component={GRNGeneral} />
            <Stack.Screen name="GRNGeneralData" component={GRNGeneralData} />
            <Stack.Screen name="GRNGeneralEdit" component={GRNGeneralEdit} />
            <Stack.Screen name="GRNPdfPage" component={GRNPdfPage} />
          </Stack.Navigator>
        );
      case ROLES.NORMAL:
        return (
          <Stack.Navigator
            initialRouteName="GRNGeneral"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="GRNGeneral" component={GRNGeneral} />
            <Stack.Screen name="GRNGeneralData" component={GRNGeneralData} />
            <Stack.Screen name="GRNGeneralEdit" component={GRNGeneralEdit} />
            <Stack.Screen name="GRNPdfPage" component={GRNPdfPage} />
          </Stack.Navigator>
        );
      case ROLES.VIEW_ONLY:
        return (
          <Stack.Navigator
            initialRouteName="GRNGeneralData"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="GRNGeneralData" component={GRNGeneralData} />
          </Stack.Navigator>
        );
      default:
        return null;
    }
  };

  return renderScreens();
}

export default GRNGeneralNavigator;