import React from 'react'
import styled from 'styled-components'
import { BaseDateTimePickerProps, DateTimePicker } from '@material-ui/pickers'
import { TextField } from '@material-ui/core'
import DateFnsAdapter from '@material-ui/pickers/adapter/date-fns'
import { Control, UseFormMethods, FieldError, Controller } from 'react-hook-form'

import { TradeFormData } from './TradeWidget'
import { FormInputError } from './TradeWidget/FormMessage'
import { BATCH_TIME, BATCH_TIME_IN_MS } from 'const'

interface DateTimePickerControlProps<T> extends BaseDateTimePickerProps {
  control: Control<T>
  onClose?: () => void
  customOnChange: (date: Date, keyboardInputValue?: string | undefined) => void
  formValues: {
    value: string | null
    setValue: UseFormMethods['setValue']
    errors?: FieldError
    inputName: keyof T
  }
}

const DateTimePickerControl: React.FC<DateTimePickerControlProps<TradeFormData>> = ({
  control,
  formValues,
  minDateTime = Date.now() + BATCH_TIME_IN_MS * 2,
  customOnChange,
  ...restProps
}) => {
  const memoizedDateAdapter = React.useMemo(() => {
    return new DateFnsAdapter()
  }, [])

  const currentError = formValues.errors
  return (
    <Controller
      control={control}
      name={formValues.inputName}
      render={(): JSX.Element => (
        <DateTimePicker
          {...restProps}
          dateAdapter={memoizedDateAdapter}
          value={formValues.value}
          onChange={customOnChange}
          disablePast
          showTodayButton
          minutesStep={BATCH_TIME / 60}
          inputFormat="yyyy/MM/dd HH:mm a"
          ampm={false}
          minDateTime={minDateTime}
          renderInput={(props): JSX.Element => (
            <TextField
              {...props}
              label="Set custom date"
              name={formValues.inputName}
              error={!!currentError}
              helperText={currentError && <FormInputError errorMessage={currentError.message} />}
            />
          )}
        />
      )}
    />
  )
}

const DateTimePickerWrapper = styled.div<{ $customDateSelected?: boolean }>`
  position: relative;
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  align-items: center;
  height: auto;

  > .MuiFormControl-root,
  .MuiTextField-root {
    min-width: max-content;
  }

  > .MuiFormControl-root {
    > .MuiInputBase-root,
    > .MuiInputLabel-formControl {
      color: inherit;
      font-weight: inherit;
      text-align: center;
    }

    > .MuiInput-underline {
      &:before {
        border-color: var(--color-background-button-hover);
      }
      &:after {
        border-color: transparent;
      }
    }
  }

  ${({ $customDateSelected = false }): string | false =>
    $customDateSelected &&
    `
      > .MuiFormControl-root {
        // when selected only
        background: var(--color-background-validation-warning);
        padding: 0.6rem 0.6rem 0 0.6rem;
        border-bottom: 0.3rem solid var(--color-background-CTA);

        

        > .MuiInputLabel-formControl {
          // only when selected
          top: 0.6rem;
          left: 0.6rem;

        }

        > .MuiInput-formControl {
          > input {
            font-weight: bold;
          }
        }

        > .MuiInput-underline:before, > .MuiInput-underline:after {
          // when selected only
          content: none;
        }
      }
  `}
`

export { DateTimePickerWrapper, DateTimePickerControl as default }
