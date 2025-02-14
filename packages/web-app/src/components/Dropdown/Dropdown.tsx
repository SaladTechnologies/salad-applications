import { type FC } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import type { CSSObjectWithLabel, GroupBase, StylesConfig } from 'react-select'
import Select from 'react-select'
import { DefaultTheme, type SaladTheme } from '../../SaladTheme'

const styles = (theme: SaladTheme) => ({
  container: {
    fontFamily: theme.fontGroteskBook19,
    fontSize: 12,
  },
})
export interface DropdownOption {
  label: string
  value: string
}

export type DropdownStylesConfig = StylesConfig<DropdownOption, false, GroupBase<DropdownOption>>

export interface Props extends WithStyles<typeof styles> {
  control?: JSX.Element
  customStyles?: DropdownStylesConfig
  options?: DropdownOption[]
  value?: string
  allowUnselectedClick?: boolean

  onChange?: (value?: any) => void
}

const _Dropdown: FC<Props> = ({
  classes,
  control,
  customStyles,
  allowUnselectedClick = false,
  options,
  value,
  onChange,
}) => {
  const selectedValue = value ? options?.find((option) => option.value === value) : undefined

  const defaultStyles: DropdownStylesConfig = {
    control: (baseStyles: CSSObjectWithLabel) => ({
      ...baseStyles,
      backgroundColor: control ? 'transparent' : DefaultTheme.darkBlue,
      borderRadius: 0,
      ...(control && {
        cursor: 'pointer',
        border: 'none',
        outline: 'none',
        boxShadow: 'none',
        '& input': {
          position: 'absolute',
        },
        '&:hover svg': {
          color: DefaultTheme.green,
        },
      }),
    }),
    menu: (baseStyles: CSSObjectWithLabel) => ({
      ...baseStyles,
      color: DefaultTheme.lightGreen,
      backgroundColor: DefaultTheme.darkBlue,
      ...(control && { width: '150px' }),
    }),
    option: (baseStyles: CSSObjectWithLabel, state: { isSelected: boolean; isFocused: boolean }) => {
      let backgroundColor = DefaultTheme.darkBlue
      if (state.isSelected) {
        backgroundColor = DefaultTheme.lightGreen
      } else if (state.isFocused) {
        backgroundColor = DefaultTheme.darkGreen
      }

      return {
        ...baseStyles,
        backgroundColor,
        color: state.isSelected ? DefaultTheme.darkBlue : DefaultTheme.lightGreen,
        cursor: 'pointer',
      }
    },
    singleValue: (baseStyles: CSSObjectWithLabel, state: { isDisabled: boolean }) => ({
      ...baseStyles,
      opacity: state.isDisabled ? 0.5 : 1,
      transition: 'opacity 300ms',
      color: DefaultTheme.lightGreen,
    }),
    placeholder: (baseStyles: CSSObjectWithLabel) => ({
      ...baseStyles,
      ...(control && { color: DefaultTheme.lightGreen }),
    }),
    menuList: (baseStyles: CSSObjectWithLabel) => ({
      ...baseStyles,
      ...(control && { textAlign: 'left' }),
    }),
    input: (baseStyles: CSSObjectWithLabel) => ({
      ...baseStyles,
      ...(control && { '& > input': { cursor: 'pointer' } }),
    }),
  }

  return (
    <Select
      className={classes.container}
      value={allowUnselectedClick ? null : selectedValue}
      options={options}
      onChange={onChange}
      defaultValue={control ? undefined : options && options[0]}
      styles={customStyles ?? defaultStyles}
      {...(control && {
        components: {
          IndicatorSeparator: () => null,
          DropdownIndicator: () => null,
          SingleValue: () => control,
        },
      })}
      placeholder={control}
    />
  )
}

export const Dropdown = withStyles(styles)(_Dropdown)
