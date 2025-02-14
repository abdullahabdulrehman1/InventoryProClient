import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import GRNGeneral from "../screens/GRNGeneral/GRNGeneral";
import GRNGeneralData from "../screens/GRNGeneral/GRNGeneralData";
import GRNGeneralEdit from "../screens/GRNGeneral/GRNGeneralEdit";
import { useSelector } from "react-redux";
import { ROLES } from "../auth/role";
import GRNPdfPage from "../screens/GRNGeneral/GRNPdfPage";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Navigator Component
const GRNTabs = () => (
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
      name="NewGRN" 
      component={GRNGeneral}
      options={{
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="plus-box" size={24} color={color} />
        ),
        tabBarLabel: 'New GRN'
      }}
    />
        <Tab.Screen 
      name="GRNData" 
      component={GRNGeneralData}
      options={{
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="database" size={24} color={color} />
        ),
        tabBarLabel: 'GRN Data'
      }}
    />
    <Tab.Screen 
      name="GRNPdf" 
      component={GRNPdfPage}
      options={{
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="file-pdf-box" size={24} color={color} />
        ),
        tabBarLabel: 'PDF Reports'
      }}
    />
  </Tab.Navigator>
);

function GRNGeneralNavigator() {
  const userRole = useSelector((state) => state?.auth?.user?.role);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {userRole === ROLES.VIEW_ONLY ? (
        <Stack.Screen name="GRNGeneralData" component={GRNGeneralData} />
      ) : (
        <>
          <Stack.Screen name="GRNTabs" component={GRNTabs} />
          <Stack.Screen name="GRNGeneralEdit" component={GRNGeneralEdit} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default GRNGeneralNavigator;