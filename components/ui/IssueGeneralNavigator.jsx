import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSelector } from "react-redux";
import { ROLES } from "../auth/role";
import IssueGeneral from "../screens/IssueGeneral/IssueGeneral";
import IssueGeneralData from "../screens/IssueGeneral/IssueGeneralData";
import IssueGeneralEdit from "../screens/IssueGeneral/IssueGeneralEdit";
import IssueGeneralPDF from "../screens/IssueGeneral/IssueGeneralPDF";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Navigator Component
const IssueTabs = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: '#2196F3',
      tabBarInactiveTintColor: '#757575',
      tabBarStyle: {
        paddingBottom: 5,
        height: 60,
      }
    }}
  >
    <Tab.Screen 
      name="NewIssue" 
      component={IssueGeneral}
      options={{
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="plus-box" size={24} color={color} />
        ),
        tabBarLabel: 'New Issue'
      }}
    />
    <Tab.Screen 
      name="IssueData" 
      component={IssueGeneralData}
      options={{
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="database" size={24} color={color} />
        ),
        tabBarLabel: 'Issue Data'
      }}
    />
    <Tab.Screen 
      name="IssuePDF" 
      component={IssueGeneralPDF}
      options={{
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="file-pdf-box" size={24} color={color} />
        ),
        tabBarLabel: 'PDF Reports'
      }}
    />
  </Tab.Navigator>
);

function IssueGeneralNavigator() {
  const userRole = useSelector((state) => state?.auth?.user?.role);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {userRole === ROLES.VIEW_ONLY ? (
        <Stack.Screen name="IssueGeneralData" component={IssueGeneralData} />
      ) : (
        <>
          <Stack.Screen name="IssueTabs" component={IssueTabs} />
          <Stack.Screen name="IssueGeneralEdit" component={IssueGeneralEdit} />
          <Stack.Screen name="IssueGeneralPDF" component={IssueGeneralPDF} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default IssueGeneralNavigator;