import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { XStack, Text, Button } from 'tamagui'
import Profile from '../../components/Profile'

import { HomeScreen } from '../../features/home/screen'
import Login from '../../features/login'
import Register from '../../features/register'
import { LogIn } from '@tamagui/lucide-icons'
import React from 'react'
import { useAuth } from '../../provider/auth'
import { useLink } from 'solito/link'
import { PostDetailScreen } from '../../features/post/detail-screen'
import { useRouter } from 'solito/router'
import { useNavigationState } from '@react-navigation/native'

const Stack = createNativeStackNavigator<{
  home: undefined
  post: undefined
  login: undefined
  register: undefined
}>()

export function NativeNavigation() {
  const { data } = useAuth()
  const loginLink = useLink({
    href: '/login',
  })
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="home"
        component={HomeScreen}
        options={{
          title: 'Ituloh!',
          headerRight: (props) =>
            data?.statusCode === 401 ? (
              <Button size={'$3'} padding={'$2'} icon={LogIn} chromeless {...loginLink}>
                Sign in
              </Button>
            ) : (
              <Profile />
            ),
        }}
      />
      <Stack.Screen
        name="post"
        component={PostDetailScreen}
        options={{
          title: 'Create post',
        }}
      />
      <Stack.Screen
        name="login"
        options={{
          title: '',
        }}
        component={Login}
      />
      <Stack.Screen
        name="register"
        options={{
          title: '',
        }}
        component={Register}
      />
    </Stack.Navigator>
  )
}
