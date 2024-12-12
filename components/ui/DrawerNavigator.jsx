// DrawerNavigator.js
import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, View } from "react-native";
import CustomDrawerContent from "./CustomDrawerContent";
import GRNGeneral from "../screens/GRNGeneral";
import IssueGeneral from "../screens/IssueGeneral";
import IssueReturnGeneral from "../screens/IssueReturnGeneral";
import GRNReturnGeneral from "../screens/GRNReturnGeneral";
import POGeneralNavigator from "./POGeneralNavigator";
import RequisitionNavigator from "./RequisitionNavigator";
import { useSelector } from "react-redux";
import AdminPanel from "../screens/Admin/AdminPanel";
import { ROLES } from "../auth/role";
import AdminPanelNavigator from "./AdminNavigator";

const Drawer = createDrawerNavigator();
const DrawerNavigator = () => {
  const userRole = useSelector((state) => state?.auth?.user?.role);
  const userStatus = useSelector((state) => state?.auth?.user?.status);

  const renderScreens = () => {
    switch (userRole) {
      case ROLES.ADMIN:
        return (
          <>
            <Drawer.Screen
              name="Admin Panel"
              component={AdminPanelNavigator}
              options={{
                drawerIcon: ({ color, size }) => (
                  <Ionicons name="settings-outline" color={color} size={size} />
                ),
              }}
            />
            <Drawer.Screen
              name="Requisition General"
              component={RequisitionNavigator}
              options={{
                drawerIcon: ({ color, size }) => (
                  <Ionicons
                    name="document-text-outline"
                    color={color}
                    size={size}
                  />
                ),
              }}
            />
            <Drawer.Screen
              name="PO General"
              component={POGeneralNavigator}
              options={{
                drawerIcon: ({ color, size }) => (
                  <Ionicons name="cart-outline" color={color} size={size} />
                ),
              }}
            />
            <Drawer.Screen
              name="GRN General"
              component={GRNGeneral}
              options={{
                drawerIcon: ({ color, size }) => (
                  <Ionicons name="receipt-outline" color={color} size={size} />
                ),
              }}
            />
            <Drawer.Screen
              name="Issue General"
              component={IssueGeneral}
              options={{
                drawerIcon: ({ color, size }) => (
                  <Ionicons name="send-outline" color={color} size={size} />
                ),
              }}
            />
            <Drawer.Screen
              name="Issue Return General"
              component={IssueReturnGeneral}
              options={{
                drawerIcon: ({ color, size }) => (
                  <Ionicons
                    name="return-down-back-outline"
                    color={color}
                    size={size}
                  />
                ),
              }}
            />
            <Drawer.Screen
              name="GRN Return General"
              component={GRNReturnGeneral}
              options={{
                drawerIcon: ({ color, size }) => (
                  <Ionicons
                    name="return-down-forward-outline"
                    color={color}
                    size={size}
                  />
                ),
              }}
            />
          </>
        );
      case ROLES.NORMAL:
        return (
          <>
            <Drawer.Screen
              name="Requisition General"
              component={RequisitionNavigator}
              options={{
                drawerIcon: ({ color, size }) => (
                  <Ionicons
                    name="document-text-outline"
                    color={color}
                    size={size}
                  />
                ),
              }}
            />
            <Drawer.Screen
              name="PO General"
              component={POGeneralNavigator}
              options={{
                drawerIcon: ({ color, size }) => (
                  <Ionicons name="cart-outline" color={color} size={size} />
                ),
              }}
            />
            <Drawer.Screen
              name="GRN General"
              component={GRNGeneral}
              options={{
                drawerIcon: ({ color, size }) => (
                  <Ionicons name="receipt-outline" color={color} size={size} />
                ),
              }}
            />
            <Drawer.Screen
              name="Issue General"
              component={IssueGeneral}
              options={{
                drawerIcon: ({ color, size }) => (
                  <Ionicons name="send-outline" color={color} size={size} />
                ),
              }}
            />
            <Drawer.Screen
              name="Issue Return General"
              component={IssueReturnGeneral}
              options={{
                drawerIcon: ({ color, size }) => (
                  <Ionicons
                    name="return-down-back-outline"
                    color={color}
                    size={size}
                  />
                ),
              }}
            />
            <Drawer.Screen
              name="GRN Return General"
              component={GRNReturnGeneral}
              options={{
                drawerIcon: ({ color, size }) => (
                  <Ionicons
                    name="return-down-forward-outline"
                    color={color}
                    size={size}
                  />
                ),  
              }}
            />
          </>
        );
      case ROLES.VIEW_ONLY:
        return (
          <>
            <Drawer.Screen
              name="Requisition General"
              component={RequisitionNavigator}
              options={{
                drawerIcon: ({ color, size }) => (
                  <Ionicons
                    name="document-text-outline"
                    color={color}
                    size={size}
                  />
                ),
              }}
            />
            <Drawer.Screen
              name="PO General"
              component={POGeneralNavigator}
              options={{
                drawerIcon: ({ color, size }) => (
                  <Ionicons name="cart-outline" color={color} size={size} />
                ),
              }}
            />
            <Drawer.Screen
              name="GRN General"
              component={GRNGeneral}
              options={{
                drawerIcon: ({ color, size }) => (
                  <Ionicons name="receipt-outline" color={color} size={size} />
                ),
              }}
            />
            <Drawer.Screen
              name="Issue General"
              component={IssueGeneral}
              options={{
                drawerIcon: ({ color, size }) => (
                  <Ionicons name="send-outline" color={color} size={size} />
                ),
              }}
            />
            <Drawer.Screen
              name="Issue Return General"
              component={IssueReturnGeneral}
              options={{
                drawerIcon: ({ color, size }) => (
                  <Ionicons
                    name="return-down-back-outline"
                    color={color}
                    size={size}
                  />
                ),
              }}
            />
            <Drawer.Screen
              name="GRN Return General"
              component={GRNReturnGeneral}
              options={{
                drawerIcon: ({ color, size }) => (
                  <Ionicons
                    name="return-down-forward-outline"
                    color={color}
                    size={size}
                  />
                ),
              }}
            />
          </>
        );
      default:
        return (
          <Drawer.Screen
            name="Default Screen"
            component={RequisitionNavigator}
            options={{
              drawerIcon: ({ color, size }) => (
                <Ionicons
                  name="document-text-outline"
                  color={color}
                  size={size}
                />
              ),
            }}
          />
        );
    }
  };

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={({ navigation }) => ({
        headerStyle: {
          backgroundColor: "#333",
        },
        headerTintColor: "#fff",
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <View
              style={{
                marginLeft: 10,
                backgroundColor: "black",
                borderRadius: 50,
                padding: 5,
              }}
            >
              <Ionicons name="menu" size={24} color="white" />
            </View>
          </TouchableOpacity>
        ),
        drawerStyle: {
          backgroundColor: "#333",
        },
        drawerActiveTintColor: "white",
        drawerInactiveTintColor: "#888",
      })}
    >
      {renderScreens()}
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
