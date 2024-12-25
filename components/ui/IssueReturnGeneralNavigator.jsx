import { createStackNavigator } from "@react-navigation/stack";
import IssueReturnGeneral from "../screens/IssueReturnGeneral/IssueReturnGeneral";
import IssueReturnGeneralData from "../screens/IssueReturnGeneral/IssueReturnGeneralData";
import IssueReturnGeneralEdit from "../screens/IssueReturnGeneral/IssueReturnGeneralEdit";

const Stack = createStackNavigator();

function IssueReturnGeneralNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="IssueReturnGeneral"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="IssueReturnGeneral" component={IssueReturnGeneral} />
      <Stack.Screen
        name="IssueReturnGeneralData"
        component={IssueReturnGeneralData}
      />
      <Stack.Screen
        name="IssueReturnGeneralEdit"
        component={IssueReturnGeneralEdit}
      />
    </Stack.Navigator>
  );
}

export default IssueReturnGeneralNavigator;
