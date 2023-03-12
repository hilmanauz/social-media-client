import React from 'react'
import { useController, useFormContext, ControllerProps, UseControllerProps } from 'react-hook-form'
import { YStack, Paragraph, Input, InputProps, TextArea } from 'tamagui'

interface TextInputProps extends InputProps, UseControllerProps {
  label: string
  name: string
  defaultValue?: string
  setFormError: Function
  type?: 'input' | 'textarea'
}

const ControlledInput = (props: TextInputProps) => {
  const formContext = useFormContext()
  const { formState } = formContext

  const { name, label, rules, defaultValue, ...inputProps } = props

  const { field } = useController({ name, rules, defaultValue })

  const hasError = Boolean(formState?.errors[name])

  return (
    <YStack>
      {label && <Paragraph>{label}</Paragraph>}
      {props.type === 'textarea' ? (
        <TextArea
          size="$4"
          borderWidth={2}
          autoCapitalize="none"
          textAlign="left"
          onChangeText={field.onChange}
          onBlur={field.onBlur}
          value={field.value}
          {...inputProps}
        />
      ) : (
        <Input
          size="$4"
          borderWidth={2}
          autoCapitalize="none"
          textAlign="left"
          onChangeText={field.onChange}
          onBlur={field.onBlur}
          value={field.value}
          {...inputProps}
        />
      )}
      {hasError && <Paragraph theme={'red_alt1'}>{formState.errors[name]?.message}</Paragraph>}
    </YStack>
  )
}

export const TextInput = (props: TextInputProps) => {
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
