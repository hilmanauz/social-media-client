import AsyncStorage from '@react-native-async-storage/async-storage'
import React from 'react'
import useSWR from 'swr'
// @ts-ignore
import { PRIVATE_IP_ADDRESS } from '@env'
import { useRouter } from 'solito/router'
import { useNavigationState } from '@react-navigation/native'

export type AuthResponse = {
  data?: any
  error?: any
}

const AuthContext = React.createContext<AuthResponse>({
  data: undefined,
  error: undefined,
})

export const useAuth = () => React.useContext(AuthContext)

export const AuthProvider = (props: { children: React.ReactNode }) => {
  const [bearer, setBearer] = React.useState<null | string>(null)
  const state = useNavigationState((state) => state)
  React.useEffect(() => {
    AsyncStorage.getItem('@bearerToken').then((value) => setBearer(value))
  }, [state])
  const { data, error } = useSWR([`http://${PRIVATE_IP_ADDRESS}:3000`, bearer], (args) => {
    return fetch(args[0], {
      headers: new Headers({
        Authorization: `Bearer ${args[1]}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      }),
    }).then((res) => res.json())
  })
  return (
    <AuthContext.Provider
      value={{
        data,
        error,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  )
}
