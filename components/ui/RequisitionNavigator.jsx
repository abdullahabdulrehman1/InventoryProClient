import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import RequisitionGeneral from "../screens/Requisition/RequisitionGeneral";
import RequisitionEdit from "../screens/Requisition/RequisitionEdit";
import RequisitionData from "../screens/Requisition/RequisitionData";
import { useSelector } from "react-redux";
import { ROLES } from "../auth/role";
import PdfPage from "../screens/Requisition/PdfPage";
import { useEffect, useState } from "react";
import { Keyboard, Platform } from "react-native"; // Added Platform import

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Create Bottom Tab Navigator Component
const RequisitionTabs = () => {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setIsKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setIsKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: '#757575',
        tabBarStyle: {
          display: isKeyboardVisible ? 'none' : 'flex', // Hide tab bar when keyboard is visible
          height: 60,
          paddingBottom: 5,
          // Add iOS-specific padding to avoid home indicator
          ...(Platform.OS === 'ios' && {
            paddingBottom: 20
          }),
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          overflow: 'hidden',
          backgroundColor: '#F8F9FA',
          borderTopWidth: 1,
          borderTopColor: '#E0E0E0',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginBottom: 4
        }
      }}
    >
       <Tab.Screen 
        name="Form" 
        component={RequisitionGeneral}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="form-select" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Data" 
        component={RequisitionData}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="database" size={24} color={color} />
          ),
        }}
      />
     
      <Tab.Screen 
        name="PDF" 
        component={PdfPage}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="file-pdf-box" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Modified Requisition Navigator
function RequisitionNavigator() {
  const userRole = useSelector((state) => state?.auth?.user?.role);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {userRole === ROLES.VIEW_ONLY ? (
        <Stack.Screen name="RequisitionData" component={RequisitionData} />
      ) : (
        <>
          <Stack.Screen name="RequisitionTabs" component={RequisitionTabs} />
          <Stack.Screen name="RequisitionEdit" component={RequisitionEdit} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default RequisitionNavigator;