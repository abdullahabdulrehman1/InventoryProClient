import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useSelector } from 'react-redux'
import { ROLES } from '../auth/role'
import IssueReturnGeneral from '../screens/IssueReturnGeneral/IssueReturnGeneral'
import IssueReturnGeneralData from '../screens/IssueReturnGeneral/IssueReturnGeneralData'
import IssueReturnGeneralEdit from '../screens/IssueReturnGeneral/IssueReturnGeneralEdit'
import IssueReturnPdfPage from '../screens/IssueReturnGeneral/issueReturnPdfPage'

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

// Tab Navigator Component
const IssueReturnTabs = () => (
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
      name='NewReturn'
      component={IssueReturnGeneral}
      options={{
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name='plus-box' size={24} color={color} />
        ),
        tabBarLabel: 'New Return'
      }}
    />
    <Tab.Screen
      name='ReturnData'
      component={IssueReturnGeneralData}
      options={{
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name='database' size={24} color={color} />
        ),
        tabBarLabel: 'Return Data'
      }}
    />
    <Tab.Screen
      name='ReturnPDF'
      component={IssueReturnPdfPage}
      options={{
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name='file-pdf-box' size={24} color={color} />
        ),
        tabBarLabel: 'PDF Reports'
      }}
    />
  </Tab.Navigator>
)

function IssueReturnGeneralNavigator () {
  const userRole = useSelector(state => state?.auth?.user?.role)

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {userRole === ROLES.VIEW_ONLY ? (
        <Stack.Screen
          name='IssueReturnGeneralData'
          component={IssueReturnGeneralData}
        />
      ) : (
        <>
          <Stack.Screen name='IssueReturnTabs' component={IssueReturnTabs} />
          <Stack.Screen
            name='IssueReturnGeneralEdit'
            component={IssueReturnGeneralEdit}
          />
          <Stack.Screen
            name='IssueReturnGeneralPDF'
            component={IssueReturnPdfPage}
          />
        </>
      )}
    </Stack.Navigator>
  )
}

export default IssueReturnGeneralNavigator
