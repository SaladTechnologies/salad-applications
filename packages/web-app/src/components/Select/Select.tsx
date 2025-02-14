import type { FC } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import type { CSSObjectWithLabel, GroupBase, StylesConfig } from 'react-select'
import ReactSelect from 'react-select'
import { DefaultTheme, type SaladTheme } from '../../SaladTheme'

const styles = (theme: SaladTheme) => ({
  container: {
    fontFamily: theme.fontGroteskBook19,
    fontSize: 12,
  },
})
export interface SelectOption {
  label: string
  value: string
}

export type SelectStylesConfig = StylesConfig<SelectOption | '', false, GroupBase<SelectOption | ''>>

export interface Props extends WithStyles<typeof styles> {
  customStyles?: SelectStylesConfig
  options?: SelectOption[]
  value?: string
  onChange?: (value?: any) => void
}

const _Select: FC<Props> = ({ classes, customStyles, options, value, onChange }) => {
  const selectedValue = value && options?.find((option) => option.value === value)

  const defaultStyles: SelectStylesConfig = {
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
    <ReactSelect
      className={classes.container}
      value={selectedValue}
      options={options}
      onChange={onChange}
      defaultValue={options && options[0]}
      styles={customStyles ?? defaultStyles}
    />
  )
}

export const Select = withStyles(styles)(_Select)
