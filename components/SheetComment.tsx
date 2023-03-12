import { ChevronDown, ChevronUp } from '@tamagui/lucide-icons'
import React from 'react'
import { useRouter } from 'solito/router'
import { KeyedMutator } from 'swr'
import {
  Button,
  Input,
  Paragraph,
  Sheet,
  YStack,
  Text,
  XStack,
  Avatar,
  H3,
  H5,
  Separator,
  Stack,
} from 'tamagui'
import { useAuth } from '../provider/auth'
import CommentInput from './CommentInput'

function SheetComment({ item, mutate }: { item: Record<string, any>; mutate: KeyedMutator<any> }) {
  const dataAuth = useAuth()
  const router = useRouter()
  const [position, setPosition] = React.useState(0)
  const [open, setOpen] = React.useState(false)
  return (
    <>
      <Paragraph
        theme={'alt1'}
        onPress={() => {
          dataAuth.data?.statusCode === 401 ? router.push('/login') : setOpen(true)
        }}
      >
        View all {item.comments.length} comments
      </Paragraph>
      <Sheet
        forceRemoveScrollEnabled={open}
        modal
        open={open}
        onOpenChange={setOpen}
        snapPoints={item.comments.length < 3 ? [50] : [85, 50, 25]}
        dismissOnSnapToBottom
        position={position}
        onPositionChange={setPosition}
        zIndex={100_000}
      >
        <Sheet.Overlay />
        <Sheet.Handle />
        <Sheet.Frame f={1} space="$5">
          <Sheet.ScrollView p="$4" space>
            <YStack space={13} f={1}>
              <XStack key={item.id} space={9} ai={'center'}>
                <Avatar circular size="$4">
                  <Avatar.Image
                    src={`https://ui-avatars.com/api/?name=${item.author.username}&background=random`}
                  />
                  <Avatar.Fallback bc="red" />
                </Avatar>
                <YStack>
                  <Paragraph size={'$3'}>{item.author.username}</Paragraph>
                  <Paragraph size={'$5'}>{item.caption}</Paragraph>
                </YStack>
              </XStack>
              <Separator borderColor={'$gray8'} marginHorizontal={'$-4'} />
              {item.comments.map((comment: { user: { username: any }; value: any; id: any }) => (
                <XStack key={comment.id} space={9} ai={'center'}>
                  <Avatar circular size="$4">
                    <Avatar.Image
                      src={`https://ui-avatars.com/api/?name=${comment.user.username}&background=random`}
                    />
                    <Avatar.Fallback bc="red" />
                  </Avatar>
                  <YStack>
                    <Paragraph size={'$3'}>{comment.user.username}</Paragraph>
                    <Paragraph size={'$4'}>{comment.value}</Paragraph>
                  </YStack>
                </XStack>
              ))}
              <Stack marginTop={'$3'}>
                {dataAuth?.data && (
                  <CommentInput item={item} mutate={mutate} dataAuth={dataAuth} size={'$3'} />
                )}
              </Stack>
            </YStack>
          </Sheet.ScrollView>
        </Sheet.Frame>
      </Sheet>
    </>
  )
}

export default SheetComment
