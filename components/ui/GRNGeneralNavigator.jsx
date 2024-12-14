import { createStackNavigator } from "@react-navigation/stack";
import GRNGeneral from "../screens/GRNGeneral/GRNGeneral";
import GRNGeneralData from "../screens/GRNGeneral/GRNGeneralData";
import GRNGeneralEdit from "../screens/GRNGeneral/GRNGeneralEdit";

const Stack = createStackNavigator();

function GRNGeneralNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="GRNGeneral"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="GRNGeneral" component={GRNGeneral} />
      <Stack.Screen name="GRNGeneralData" component={GRNGeneralData} />
      <Stack.Screen name="GRNGeneralEdit" component={GRNGeneralEdit} />
    </Stack.Navigator>
  );
}

export default GRNGeneralNavigator;
