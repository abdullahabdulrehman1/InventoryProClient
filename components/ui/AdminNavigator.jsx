import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AdminPanel from "../screens/Admin/AdminPanel";
import ApprovedUsers from "../screens/Admin/ApprovedUsers";
import PendingUsers from "../screens/Admin/PendingUsers";

const Stack = createStackNavigator();

function AdminPanelNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AdminPanel"
        component={AdminPanel}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ApprovedUsers"
        component={ApprovedUsers}
        options={{ title: "Approved Users",headerShown: false }}
      />
      <Stack.Screen
        name="PendingUsers"
        component={PendingUsers}
        options={{ title: "Pending Users",headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default AdminPanelNavigator;