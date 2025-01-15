import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Provider, useDispatch, useSelector } from "react-redux";
import Login from "./components/auth/login";
import Register from "./components/auth/register";
import ServerUrl from "./components/config/ServerUrl";
import { userExist, userNotExist } from "./components/redux/reducers/auth";
import { store } from "./components/redux/store/store";
import DrawerNavigator from "./components/ui/DrawerNavigator";
import StatusPending from "./components/ui/StatusPending.jsx";
import * as SecureStore from "expo-secure-store";
const Stack = createStackNavigator();

const AppNavigator = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const userStatus = user?.status;

  useEffect(() => {
    const checkUserExistence = async () => {
      try {
        const token = await SecureStore.getItemAsync("token");
        console.log("Token:", token);

        if (token) {
          const response = await axios.post(
            `${ServerUrl}/users/my`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log("Response:", response.data.user);
          dispatch(userExist(response.data.user));
          if (response.data.success === false) {
            await SecureStore.deleteItemAsync("user");
            dispatch(userNotExist());
          }
        } else {
          console.log("No token found");
          await SecureStore.deleteItemAsync("user");
          dispatch(userNotExist());
        }
      } catch (error) {
        console.error("Error checking user existence:", error.message);

        await SecureStore.deleteItemAsync("token");
        await SecureStore.deleteItemAsync("user");
        dispatch(userNotExist());
      } finally {
        setLoading(false);
      }
    };

    checkUserExistence();
  }, [dispatch]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#1b1f26" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          userStatus === "pending" ? (
            // If userStatus is 'pending', show the StatusPending screen
            <Stack.Group>
              <Stack.Screen name="StatusPending" component={StatusPending} />
            </Stack.Group>
          ) : (
            // Otherwise, show the DrawerNavigator screen
            <Stack.Group>
              <Stack.Screen name="Drawer" component={DrawerNavigator} />
            </Stack.Group>
          )
        ) : (
          // If user is not logged in, show the Register and Login screens
          <Stack.Group>
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="Login" component={Login} />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
};

export default App;
