import { createStackNavigator } from "@react-navigation/stack";
import IssueGeneral from "../screens/IssueGeneral/IssueGeneral";
import IssueGeneralData from "../screens/IssueGeneral/IssueGeneralData";
import IssueGeneralEdit from "../screens/IssueGeneral/IssueGeneralEdit";

const Stack = createStackNavigator();

function IssueGeneralNavigator() {
  return (
    <Stack.Navigator initialRouteName="IssueGeneral" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="IssueGeneral" component={IssueGeneral} />
      <Stack.Screen name="IssueGeneralData" component={IssueGeneralData} />
      <Stack.Screen name="IssueGeneralEdit" component={IssueGeneralEdit} />
    </Stack.Navigator>
  );
}

export default IssueGeneralNavigator;
