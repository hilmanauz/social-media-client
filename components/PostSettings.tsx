import React, { useState } from 'react'
import {
  Popover,
  Adapt,
  YGroup,
  XStack,
  Label,
  Input,
  Button,
  PopoverClose,
  Avatar,
  Sheet,
  Form,
} from 'tamagui'
import { Plus, LogOut, MoreVertical, Edit, Trash, ChevronDown } from '@tamagui/lucide-icons'
import { useColorScheme } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { FormProvider, useForm } from 'react-hook-form'
import { TextInput } from './TextInput'
import { Spinner } from 'tamagui'
import axios from 'axios'
// @ts-ignore
import { PRIVATE_IP_ADDRESS } from '@env'
import { KeyedMutator } from 'swr'

const PostSettings = React.forwardRef(
  ({ item, mutate }: { item: Record<string, any>; mutate: KeyedMutator<any> }, ref) => {
    const scheme = useColorScheme()
    const [open, setOpen] = useState(false)
    const handleDelete = React.useCallback(async () => {
      try {
        const bearerToken = await AsyncStorage.getItem('@bearerToken')
        await axios.delete(`http://${PRIVATE_IP_ADDRESS}:3000/posts/${item.id}`, {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        })
        await mutate()
        setOpen(false)
      } catch (error) {
        console.log(error)
      }
    }, [PRIVATE_IP_ADDRESS, item, mutate])
    return (
      <>
        <Popover size="$5" placement="bottom">
          <Popover.Trigger asChild>
            <Button
              icon={MoreVertical}
              chromeless
              size={'$6'}
              paddingHorizontal={'$3'}
              height={'$0'}
            />
          </Popover.Trigger>

          <Popover.Content
            // @ts-ignore
            ref={ref}
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
                  <Button size="$3" icon={Edit} onPress={() => setOpen((x) => !x)}>
                    Update
                  </Button>
                </Popover.Close>
              </YGroup.Item>
              <YGroup.Item>
                <Popover.Close asChild>
                  <Button size="$3" icon={Trash} theme={'red_Button'} onPress={handleDelete}>
                    Delete
                  </Button>
                </Popover.Close>
              </YGroup.Item>
            </YGroup>
          </Popover.Content>
        </Popover>
        <SheetUpdate item={item} mutate={mutate} setOpen={setOpen} open={open} />
      </>
    )
  }
)

function SheetUpdate({
  item,
  mutate,
  setOpen,
  open,
}: {
  item: Record<string, any>
  mutate: KeyedMutator<any>
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const [formError, setError] = React.useState<Boolean>(false)
  const [position, setPosition] = useState(0)
  const { ...methods } = useForm({
    values: item,
  })

  React.useEffect(() => {
    if (!open) {
      methods.reset(item)
    }
  }, [open])

  const onSubmit = React.useCallback(
    async (props: any) => {
      try {
        const bearerToken = await AsyncStorage.getItem('@bearerToken')
        await axios.patch(`http://${PRIVATE_IP_ADDRESS}:3000/posts/${item.id}`, props, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${bearerToken}`,
          },
        })
        await mutate()
        setOpen(false)
      } catch (error) {
        console.log(error)
      }
    },
    [PRIVATE_IP_ADDRESS, item, mutate]
  )

  return (
    <>
      <Sheet
        modal
        open={open}
        onOpenChange={setOpen}
        snapPoints={[30]}
        position={position}
        onPositionChange={setPosition}
        dismissOnSnapToBottom
      >
        <Sheet.Overlay />
        <Sheet.Frame>
          <Sheet.Handle />
          <FormProvider {...methods}>
            <Form
              space
              onSubmit={methods.handleSubmit(onSubmit)}
              bw={1}
              br="$4"
              bc="$background"
              boc="$borderColor"
              p="$8"
            >
              <TextInput
                name="caption"
                label="Caption"
                type={'textarea'}
                placeholder="Hello World!"
                setFormError={setError}
                rules={{ required: 'Caption is required!' }}
              />
              <Form.Trigger asChild>
                <Button
                  marginTop={'$5'}
                  icon={methods.formState.isSubmitting ? () => <Spinner /> : undefined}
                >
                  Update
                </Button>
              </Form.Trigger>
            </Form>
          </FormProvider>
        </Sheet.Frame>
      </Sheet>
    </>
  )
}

export default PostSettings
