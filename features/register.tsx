import React from 'react'
import { Controller, FieldValues, FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { Dimensions } from 'react-native'
import { Button, Form, H4, Spinner, YStack, Text, Input, Paragraph, H2, H1, Stack } from 'tamagui'
import { TextInput } from '../components/TextInput'
// @ts-ignore
import { PRIVATE_IP_ADDRESS } from '@env'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from 'solito/router'

function Register() {
  const { ...methods } = useForm()
  const router = useRouter()
  const [formError, setError] = React.useState<Boolean>(false)
  const onSubmit = React.useCallback(async (props: any) => {
    try {
      await axios.post(`http://${PRIVATE_IP_ADDRESS}:3000/register`, props)
      router.push('/login')
    } catch (error) {
      setError(true)
    }
  }, [])
  return (
    <FormProvider {...methods}>
      <Form
        ai="center"
        jc={'center'}
        width={Dimensions.get('window').width}
        height={Dimensions.get('window').height}
        space
        onSubmit={methods.handleSubmit(onSubmit)}
        bw={1}
        br="$4"
        bc="$background"
        boc="$borderColor"
        p="$8"
      >
        <YStack space={'$3'}>
          <H1>Ituloh!</H1>
          <YStack width={Dimensions.get('window').width - 30} space={'$8'}>
            {formError ? (
              <Stack>
                <Paragraph theme={'red'}>
                  There was a problem with loading the form. Please try again later.
                </Paragraph>
              </Stack>
            ) : (
              <>
                <YStack space={'$4'} theme={'alt2'}>
                  <TextInput
                    name="username"
                    label="Username"
                    placeholder="johndoe"
                    setFormError={setError}
                    rules={{ required: 'Username is required!' }}
                  />
                  <TextInput
                    name="password"
                    label="Password"
                    secureTextEntry
                    placeholder="**********"
                    rules={{ required: 'Password is required!' }}
                    setFormError={setError}
                  />
                </YStack>
                <Paragraph onPress={() => router.back()}>Already have an account?</Paragraph>
              </>
            )}
            <Form.Trigger asChild>
              <Button icon={methods.formState.isSubmitting ? () => <Spinner /> : undefined}>
                Register
              </Button>
            </Form.Trigger>
          </YStack>
        </YStack>
      </Form>
    </FormProvider>
  )
}

export default Register
