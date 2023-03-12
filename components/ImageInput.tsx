import React from 'react'
import { useController, useFormContext, ControllerProps, UseControllerProps } from 'react-hook-form'
import { YStack, Paragraph, Button, Image } from 'tamagui'
import * as ImagePicker from 'expo-image-picker'
import { Dimensions } from 'react-native'

interface ImageInputProps extends UseControllerProps {
  label: string
  name: string
  defaultValue?: string
  setFormError: Function
  type?: 'input' | 'textarea'
}

const ControlledInput = (props: ImageInputProps) => {
  const formContext = useFormContext()
  const { formState } = formContext

  const { name, label, rules, defaultValue, ...inputProps } = props

  const { field } = useController({ name, rules, defaultValue })

  const hasError = Boolean(formState?.errors[name])

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') alert('Sorry, we need camera roll permissions to make this work!')
    if (status === 'granted') {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
        allowsMultipleSelection: false,
      })

      if (result.assets) {
        formContext.setValue(name, result.assets?.[0])
      }
    }
  }
  const photo = formContext.watch('photo')
  return (
    <YStack space>
      {photo && (
        <YStack>
          <Paragraph>Image Preview</Paragraph>
          <Image
            src={photo.uri}
            width={Dimensions.get('window').width - 30}
            height={600}
            resizeMode={'contain'}
          />
        </YStack>
      )}
      <YStack>
        {label && !photo && <Paragraph>{label}</Paragraph>}
        <Button onPress={pickImage}>Select Image</Button>
        {hasError && <Paragraph theme={'red_alt1'}>{formState.errors[name]?.message}</Paragraph>}
      </YStack>
    </YStack>
  )
}

export const ImageInput = (props: ImageInputProps) => {
  const { name, rules, label, defaultValue, setFormError, ...inputProps } = props

  const formContext = useFormContext()

  // Placeholder until input name is initialized
  if (!formContext || !name) {
    const msg = !formContext
      ? 'TextInput must be wrapped by the FormProvider'
      : 'Name must be defined'
    console.error(msg)
    setFormError(true)
    return null
  }

  return <ControlledInput {...props} />
}
