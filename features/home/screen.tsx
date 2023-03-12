import { ChevronDown, ChevronUp, MoreVertical, Send } from '@tamagui/lucide-icons'
import React, { useState } from 'react'
import { LayoutChangeEvent, LayoutRectangle } from 'react-native'
import { useLink } from 'solito/link'
import useSWR from 'swr'
import {
  ScrollView,
  YStack,
  H1,
  Paragraph,
  Card,
  XStack,
  Button,
  Separator,
  Anchor,
  Sheet,
  Image,
  TamaguiElement,
  Text,
  H2,
  H4,
  Avatar,
  H6,
  Stack,
  Input,
} from 'tamagui'
// @ts-ignore
import { PRIVATE_IP_ADDRESS } from '@env'
import { useNavigationState } from '@react-navigation/native'
import { useAuth } from '../../provider/auth'
import PostSettings from '../../components/PostSettings'
import CommentInput from '../../components/CommentInput'
import SheetComment from '../../components/SheetComment'
// @ts-ignore
export const fetcher = (...args: any[]) => fetch(...args).then((res) => res.json())

export function HomeScreen() {
  const stateLink = useNavigationState((state) => state)
  const dataAuth = useAuth()
  const { data, error, isLoading, mutate } = useSWR(
    `http://${PRIVATE_IP_ADDRESS}:3000/posts`,
    fetcher,
    {
      revalidateOnReconnect: true,
    }
  )
  React.useEffect(() => {
    mutate()
  }, [stateLink])
  const [state, setState] = React.useState<LayoutRectangle | null>(null)
  return (
    <ScrollView bc="$background" paddingHorizontal={'$1'}>
      <YStack
        f={1}
        jc="center"
        ai="center"
        onLayout={(event) => {
          setState(event.nativeEvent.layout)
        }}
      >
        {data?.map((item: Record<string, any>, id: number) => (
          <Card
            key={id}
            theme="light"
            paddingVertical={'$5'}
            borderTopColor={'$gray10'}
            borderBottomColor={'$gray10'}
            borderTopWidth={1}
            borderBottomWidth={1}
            borderRadius={'$0'}
            jc="center"
          >
            <Card.Header space={10}>
              <XStack ai={'center'} paddingHorizontal={'$2'} paddingBottom={'$2'}>
                <Avatar circular size="$3.5">
                  <Avatar.Image
                    src={`https://ui-avatars.com/api/?name=${item.author.username}&background=random`}
                  />
                  <Avatar.Fallback bc="red" />
                </Avatar>
                <Paragraph fow={'800'} paddingHorizontal={'$3'} fontSize={'$4'}>
                  {item.author.username}
                </Paragraph>
                <Stack f={1} />
                {dataAuth?.data.username === item.author.username && (
                  <PostSettings item={item} mutate={mutate} />
                )}
              </XStack>
              <Stack>
                <Image
                  src={item.photo}
                  width={state?.width || 0}
                  height={600}
                  resizeMode={'contain'}
                />
              </Stack>
              <YStack paddingHorizontal={'$2'} space={10}>
                <XStack>
                  <Paragraph fow={'800'}>{item.author.username}</Paragraph>
                  <Paragraph paddingHorizontal={'$3'}>{item.caption}</Paragraph>
                </XStack>
                {!!item.comments.length && <SheetComment item={item} mutate={mutate} />}
                {!dataAuth?.data.statusCode && (
                  <CommentInput item={item} mutate={mutate} dataAuth={dataAuth} size={'$2'} />
                )}
              </YStack>
            </Card.Header>
          </Card>
        ))}
      </YStack>
    </ScrollView>
  )
}
