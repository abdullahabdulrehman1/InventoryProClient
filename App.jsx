import React, { useEffect, useState } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Register from "./components/auth/register";
import Login from "./components/auth/login";
import DrawerNavigator from "./components/ui/DrawerNavigator";
import { store } from "./components/redux/store/store";
import { userExist, userNotExist } from "./components/redux/reducers/auth";
import ServerUrl from "./components/config/ServerUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { ActivityIndicator, View } from "react-native";
import StatusPending from './components/ui/StatusPending.jsx'
const Stack = createStackNavigator();


const AppNavigator = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const userStatus = user?.status
  
  useEffect(() => {
    const checkUserExistence = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        console.log("Token:", token);

        if (token) {
          const response = await axios.post(`${ServerUrl}/users/my`, {
            token,
          });
          console.log("Response:", response.data.user);
          dispatch(userExist(response.data.user));
          if (response.data.success === false) {
            await AsyncStorage.removeItem("user");
            dispatch(userNotExist());
          }
        } else {
          console.log("No token found");
          await AsyncStorage.removeItem("user");
          dispatch(userNotExist());
        }
      } catch (error) {
        console.error("Error checking user existence:", error.message);

        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("user");
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
        userStatus  === "pending"? (
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
