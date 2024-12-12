// In POGeneralNavigator.js

import { createStackNavigator } from "@react-navigation/stack";
import POGeneral from "../screens/POGeneral/POGeneral";
import POGeneralData from "../screens/POGeneral/POGeneralData";
import POGeneralEdit from "../screens/POGeneral/POGeneralEdit";


const Stack = createStackNavigator();

function POGeneralNavigator() {
  return (
    <Stack.Navigator initialRouteName="POGeneral" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="POGeneral" component={POGeneral} />
      <Stack.Screen name="POGeneralData" component={POGeneralData} />
      <Stack.Screen name="POGeneralEdit" component={POGeneralEdit} />
    </Stack.Navigator>
  );
}

export default POGeneralNavigator;