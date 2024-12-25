import { createStackNavigator } from "@react-navigation/stack";
import GRNGeneral from "../screens/GRNGeneral/GRNGeneral";
import GRNGeneralData from "../screens/GRNGeneral/GRNGeneralData";
import GRNGeneralEdit from "../screens/GRNGeneral/GRNGeneralEdit";
import GRNReturnGeneral from "../screens/GRNReturnGeneral/GRNReturnGeneral";
import GRNReturnGeneralData from "../screens/GRNReturnGeneral/GRNReturnGeneralData";
import GRNReturnGeneralEdit from "../screens/GRNReturnGeneral/GRNReturnGeneralEdit";

const Stack = createStackNavigator();

function GRNReturnGeneralNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="GRNReturnGeneral"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="GRNReturnGeneral" component={GRNReturnGeneral} />
      <Stack.Screen
        name="GRNReturnGeneralData"
        component={GRNReturnGeneralData}
      />
      <Stack.Screen
        name="GRNReturnGeneralEdit"
        component={GRNReturnGeneralEdit}
      />
    </Stack.Navigator>
  );
}

export default GRNReturnGeneralNavigator;
