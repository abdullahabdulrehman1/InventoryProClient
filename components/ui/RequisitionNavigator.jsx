import { createStackNavigator } from "@react-navigation/stack";
import RequisitionGeneral from "../screens/Requisition/RequisitionGeneral";
import RequisitionEdit from "../screens/Requisition/RequisitionEdit";
import RequisitionData from "../screens/Requisition/RequisitionData";
import { useSelector } from "react-redux";
import { ROLES } from "../auth/role";

const Stack = createStackNavigator();

function RequisitionNavigator() {
  const userRole = useSelector((state) => state?.auth?.user?.role);

  const renderScreens = () => {
    switch (userRole) {
      case ROLES.ADMIN:
        return (
          <Stack.Navigator
            initialRouteName="RequisitionGeneral"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen
              name="RequisitionGeneral"
              component={RequisitionGeneral}
            />
            <Stack.Screen name="RequisitionEdit" component={RequisitionEdit} />
            <Stack.Screen name="RequisitionData" component={RequisitionData} />
          </Stack.Navigator>
        );
      case ROLES.NORMAL:
        return (
          <Stack.Navigator
            initialRouteName="RequisitionGeneral"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen
              name="RequisitionGeneral"
              component={RequisitionGeneral}
            />
            <Stack.Screen name="RequisitionEdit" component={RequisitionEdit} />
            <Stack.Screen name="RequisitionData" component={RequisitionData} />
          </Stack.Navigator>
        );
      case ROLES.VIEW_ONLY:
        return (
          <Stack.Navigator
            initialRouteName="RequisitionData"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="RequisitionData" component={RequisitionData} />
          </Stack.Navigator>
        );
      default:
        return null;
    }
  };

  return renderScreens();
}

export default RequisitionNavigator;