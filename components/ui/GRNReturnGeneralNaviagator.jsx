import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useSelector } from 'react-redux'
import { ROLES } from '../auth/role'
import GRNReturnGeneral from '../screens/GRNReturnGeneral/GRNReturnGeneral'
import GRNReturnGeneralData from '../screens/GRNReturnGeneral/GRNReturnGeneralData'
import GRNReturnGeneralEdit from '../screens/GRNReturnGeneral/GRNReturnGeneralEdit'
import GRNReturnGeneralPDF from '../screens/GRNReturnGeneral/GRNReturnGeneralPDF'

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

// Tab Navigator Component
const GRNReturnTabs = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: '#2196F3',
      tabBarInactiveTintColor: '#757575',
      tabBarStyle: {
        paddingBottom: 5,
        height: 60
      }
    }}
  >
    <Tab.Screen
      name='NewGRNReturn'
      component={GRNReturnGeneral}
      options={{
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name='plus-box' size={24} color={color} />
        ),
        tabBarLabel: 'New GRN Return'
      }}
    />
    <Tab.Screen
      name='GRNReturnData'
      component={GRNReturnGeneralData}
      options={{
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name='database' size={24} color={color} />
        ),
        tabBarLabel: 'GRN Return Data'
      }}
    />
    <Tab.Screen
      name='GRNReturnPDF'
      component={GRNReturnGeneralPDF}
      options={{
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name='file-pdf-box' size={24} color={color} />
        ),
        tabBarLabel: 'PDF Reports'
      }}
    />
  </Tab.Navigator>
)

function GRNReturnGeneralNavigator () {
  const userRole = useSelector(state => state?.auth?.user?.role)

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {userRole === ROLES.VIEW_ONLY ? (
        <Stack.Screen
          name='GRNReturnGeneralData'
          component={GRNReturnGeneralData}
        />
      ) : (
        <>
          <Stack.Screen name='GRNReturnTabs' component={GRNReturnTabs} />
          <Stack.Screen
            name='GRNReturnGeneralEdit'
            component={GRNReturnGeneralEdit}
          />
          <Stack.Screen
            name='GRNReturnGeneralPDF'
            component={GRNReturnGeneralPDF}
          />
        </>
      )}
    </Stack.Navigator>
  )
}

export default GRNReturnGeneralNavigator
