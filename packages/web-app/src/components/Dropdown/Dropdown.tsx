import type { FC } from 'react'
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

export type DropdownStylesConfig = StylesConfig<DropdownOption | '', false, GroupBase<DropdownOption | ''>>

export interface Props extends WithStyles<typeof styles> {
  customStyles?: DropdownStylesConfig
  options?: DropdownOption[]
  value?: string
  onChange?: (value?: any) => void
}

const _Dropdown: FC<Props> = ({ classes, customStyles, options, value, onChange }) => {
  const selectedValue = value && options?.find((option) => option.value === value)

  const defaultStyles: DropdownStylesConfig = {
    control: (baseStyles: CSSObjectWithLabel) => ({
      ...baseStyles,
      backgroundColor: DefaultTheme.darkBlue,
      borderRadius: 0,
    }),
    menu: (baseStyles: CSSObjectWithLabel) => ({
      ...baseStyles,
      color: DefaultTheme.lightGreen,
      backgroundColor: DefaultTheme.darkBlue,
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
  }

  return (
    <Select
      className={classes.container}
      value={selectedValue}
      options={options}
      onChange={onChange}
      defaultValue={options && options[0]}
      styles={customStyles ?? defaultStyles}
    />
  )
}

export const Dropdown = withStyles(styles)(_Dropdown)
