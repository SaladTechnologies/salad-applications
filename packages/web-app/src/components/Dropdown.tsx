import type { FC } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import type { CSSObjectWithLabel, GroupBase, StylesConfig } from 'react-select'
import Select from 'react-select'
import { DefaultTheme, type SaladTheme } from '../SaladTheme'

const styles = (theme: SaladTheme) => ({
  container: {
    fontFamily: theme.fontGroteskBook19,
    fontSize: 12,
  },
})
interface Option {
  label: string
  value: string
}
interface Props extends WithStyles<typeof styles> {
  customStyles?: StylesConfig<Option | '', false, GroupBase<Option | ''>>
  options?: Option[]
  value?: string
  onChange?: (value?: any) => void
}

const _Dropdown: FC<Props> = ({ classes, customStyles, options, value, onChange }) => {
  const selectedValue = value && options?.find((option) => option.value === value)

  const defaultStyles = {
    control: (provided: CSSObjectWithLabel) => ({
      ...provided,
      backgroundColor: DefaultTheme.darkBlue,
      borderRadius: 0,
    }),
    menu: (provided: CSSObjectWithLabel) => ({
      ...provided,
      color: DefaultTheme.lightGreen,
      backgroundColor: DefaultTheme.darkBlue,
    }),
    option: (provided: CSSObjectWithLabel, state: { isSelected: boolean; isFocused: boolean }) => {
      let backgroundColor = DefaultTheme.darkBlue
      if (state.isSelected) {
        backgroundColor = DefaultTheme.lightGreen
      } else if (state.isFocused) {
        backgroundColor = DefaultTheme.darkGreen
      }

      return {
        ...provided,
        backgroundColor,
        color: state.isSelected ? DefaultTheme.darkBlue : DefaultTheme.lightGreen,
        cursor: 'pointer',
      }
    },
    singleValue: (provided: CSSObjectWithLabel, state: { isDisabled: boolean }) => ({
      ...provided,
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
