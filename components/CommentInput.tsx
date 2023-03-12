import AsyncStorage from '@react-native-async-storage/async-storage'
import { Send } from '@tamagui/lucide-icons'
import axios from 'axios'
import React from 'react'
import { KeyedMutator } from 'swr'
import { XStack, Avatar, Input, Button, SizeTokens } from 'tamagui'
import { AuthResponse, useAuth } from '../provider/auth'
// @ts-ignore
import { PRIVATE_IP_ADDRESS } from '@env'
import { Spinner } from 'tamagui'

function CommentInput({
  mutate,
  item,
  dataAuth,
  size,
}: {
  mutate: KeyedMutator<any>
  item: Record<string, any>
  dataAuth: AuthResponse
  size: SizeTokens
}) {
  const [comment, setComment] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const submitComment = React.useCallback(async () => {
    try {
      setLoading(true)
      const bearerToken = await AsyncStorage.getItem('@bearerToken')
      await axios.post(
        `http://${PRIVATE_IP_ADDRESS}:3000/comments/${item.id}`,
        { value: comment },
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${bearerToken}`,
          },
        }
      )
      await mutate()
      setComment('')
      setLoading(false)
    } catch (error) {
      console.log(error)
    }
  }, [comment])
  return (
    <XStack space={'$2'}>
      <Avatar circular size={size || '$2'}>
        <Avatar.Image
          src={`https://ui-avatars.com/api/?name=${dataAuth?.data?.username}&background=random`}
        />
        <Avatar.Fallback bc="red" />
      </Avatar>
      <XStack ai="center" space="$1" f={1}>
        <Input
          f={1}
          size={size || '$2'}
          borderWidth={'$0'}
          placeholder={'Add a comment...'}
          disabled={loading}
          value={comment}
          onChangeText={(text) => setComment(text)}
        />
        <Button
          size={size || '$2'}
          onPress={submitComment}
          disabled={loading}
          icon={loading ? () => <Spinner /> : Send}
        />
      </XStack>
    </XStack>
  )
}

export default CommentInput
