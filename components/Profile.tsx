import React from 'react'
import { Popover, Adapt, YGroup, XStack, Label, Input, Button, PopoverClose, Avatar } from 'tamagui'
import { Plus, LogOut } from '@tamagui/lucide-icons'
import { useColorScheme } from 'react-native'
import { useLink } from 'solito/link'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useAuth } from '../provider/auth'

function Profile() {
  const scheme = useColorScheme()
  const { data } = useAuth()
  const linkProps = useLink({
    href: '/post',
  })
  const login = useLink({
    href: '/login',
  })
  return (
    <Popover size="$5" placement="bottom">
      <Popover.Trigger asChild>
        <Button size="$8" chromeless padding={'$2'} height={'$3'}>
          <Avatar circular size="$3">
            <Avatar.Image
              src={`https://ui-avatars.com/api/?name=${data?.username}&background=random`}
            />
            <Avatar.Fallback bc="$gray1Dark" />
          </Avatar>
        </Button>
      </Popover.Trigger>

      <Popover.Content
        bw={1}
        boc="$borderColor"
        padding={'$3'}
        enterStyle={{ x: 0, y: -10, o: 0 }}
        exitStyle={{ x: 0, y: -10, o: 0 }}
        theme={scheme === 'dark' ? 'light' : 'dark'}
        x={0}
        y={35}
        o={1}
        width={170}
        animation={[
          'quick',
          {
            opacity: {
              overshootClamping: true,
            },
          },
        ]}
        elevate
      >
        <Popover.Arrow />
        <YGroup space="$3" width={'100%'}>
          <YGroup.Item>
            <Popover.Close asChild>
              <Button size="$3" icon={Plus} {...linkProps} theme={'blue_Button'}>
                Create post
              </Button>
            </Popover.Close>
          </YGroup.Item>
          <YGroup.Item>
            <Popover.Close asChild>
              <Button
                size="$3"
                icon={LogOut}
                theme={'red_Button'}
                onPress={async (e) => {
                  e.persist()
                  login.onPress(e)
                  await AsyncStorage.removeItem('@bearerToken')
                }}
              >
                Sign Out
              </Button>
            </Popover.Close>
          </YGroup.Item>
        </YGroup>
      </Popover.Content>
    </Popover>
  )
}

export default Profile
