import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { useSelector } from "react-redux";
import { ROLES } from "../auth/role";
import POGeneral from "../screens/POGeneral/POGeneral";
import POGeneralData from "../screens/POGeneral/POGeneralData";
import POGeneralEdit from "../screens/POGeneral/POGeneralEdit";
import POPdfPage from "../screens/POGeneral/POPdfPage";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Navigator Component
const POGTabs = () => (
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
      name="New PO" 
      component={POGeneral}
      options={{
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="plus-box" size={24} color={color} />
        ),
      }}
    />
    <Tab.Screen 
      name="Data" 
      component={POGeneralData}
      options={{
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="database" size={24} color={color} />
        ),
      }}
    />
    
    <Tab.Screen 
      name="PDF" 
      component={POPdfPage}
      options={{
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="file-pdf-box" size={24} color={color} />
        ),
      }}
    />
  </Tab.Navigator>
);

function POGeneralNavigator() {
  const userRole = useSelector((state) => state?.auth?.user?.role);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {userRole === ROLES.VIEW_ONLY ? (
        <Stack.Screen name="POGeneralData" component={POGeneralData} />
      ) : (
        <>
          <Stack.Screen name="POGTabs" component={POGTabs} />
          <Stack.Screen name="POGeneralEdit" component={POGeneralEdit} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default POGeneralNavigator;