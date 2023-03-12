import { Button, Form, Paragraph, ScrollView, Spinner, YStack } from 'tamagui'
import { ChevronLeft } from '@tamagui/lucide-icons'
import React from 'react'
import { createParam } from 'solito'
import { useLink } from 'solito/link'
import { FormProvider, useForm } from 'react-hook-form'
import { TextInput } from '../../components/TextInput'
import { Dimensions } from 'react-native'
import { ImageInput } from '../../components/ImageInput'
import axios from 'axios'
// @ts-ignore
import { PRIVATE_IP_ADDRESS } from '@env'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from 'solito/router'

export function PostDetailScreen() {
  const { ...methods } = useForm()
  const [formError, setError] = React.useState<Boolean>(false)
  const router = useRouter()

  const onSubmit = React.useCallback(
    async (props: any) => {
      try {
        const formData = new FormData()
        const splittedLink = props.photo.uri.split('/')
        const imageName = splittedLink[splittedLink.length - 1] as string
        const bearerToken = await AsyncStorage.getItem('@bearerToken')
        const { photo, ...body } = props
        const bodyObjects = Object.entries(body)
        bodyObjects.forEach(([key, value]: [string, any]) => {
          formData.append(key, value)
        })
        formData.append('file', {
          // @ts-ignore
          name: photo.fileName || imageName,
          uri: photo.uri,
          type: 'image/png',
        })
        const posted = await axios.post(`http://${PRIVATE_IP_ADDRESS}:3000/posts`, formData, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${bearerToken}`,
          },
        })
        router.push('/')
      } catch (error) {
        console.log(error)
      }
    },
    [router, PRIVATE_IP_ADDRESS]
  )

  return (
    <ScrollView bc="$background">
      <FormProvider {...methods}>
        <Form
          ai="center"
          jc={'center'}
          space
          onSubmit={methods.handleSubmit(onSubmit)}
          bw={1}
          br="$4"
          bc="$background"
          boc="$borderColor"
          p="$8"
        >
          <YStack width={Dimensions.get('window').width - 30} space={'$4'} theme={'alt2'}>
            <ImageInput
              name="photo"
              label="Upload Image"
              setFormError={setError}
              rules={{ required: 'Select your image to submit your post!' }}
            />
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
                Submit
              </Button>
            </Form.Trigger>
          </YStack>
        </Form>
      </FormProvider>
    </ScrollView>
  )
}
