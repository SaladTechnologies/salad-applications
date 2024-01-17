import classNames from 'classnames'
import type { FC } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import type { OptionProps, OptionsOrGroups } from 'react-select'
import Select from 'react-select'
import type { SaladTheme } from '../SaladTheme'

const styles = (theme: SaladTheme) => ({
  container: {
    color: theme.lightGreen,
  },
  dark: {
    fontFamily: theme.fontGroteskBook19,
    fontSize: 12,
  },
  light: {
    fontFamily: theme.fontMallory,
    fontSize: 16,
  },
})

interface Props extends WithStyles<typeof styles> {
  type?: 'dark' | 'light'
  options?: OptionsOrGroups<any, any>
  onChange?: (value?: any) => void
}

const darkColorsTheme = {
  neutral0: '#0A2133',
  primary25: '#1F4F22',
  primary: '#DBF1C1',
  primary50: '#B2D530',
  neutral20: '#DBF1C1',
}

const lightColorsTheme = {
  primary: 'transparent',
  neutral20: '#0A2133',
  primary25: '#DBF1C1',
  primary50: '#B2D530',
}

const _Dropdown: FC<Props> = ({ classes, type = 'dark', options, onChange }) => {
  const customStyles = {
    option: (styles: any, { isSelected }: OptionProps) => {
      return {
        ...styles,
        color: type === 'dark' ? styles.color : isSelected ? '#53A626' : '#0A2133',
        cursor: 'pointer',
      }
    },
    singleValue: (provided: any, state: any) => {
      const opacity = state.isDisabled ? 0.5 : 1
      const transition = 'opacity 300ms'
      const colorValue = type === 'dark' ? '#DBF1C1' : '#0A2133'

      return { ...provided, opacity, transition, color: colorValue }
    },
  }

  return (
    <Select
      className={classNames(classes.container, {
        [classes.dark]: type === 'dark',
        [classes.light]: type === 'light',
      })}
      options={options}
      onChange={onChange}
      defaultValue={options && options[0]}
      styles={customStyles}
      theme={(selectTheme) => ({
        // TODO: Get the theme data using react-jss
        ...selectTheme,
        borderRadius: 0,
        colors: {
          ...selectTheme.colors,
          ...(type === 'dark' ? darkColorsTheme : lightColorsTheme),
        },
      })}
    />
  )
}

export const Dropdown = withStyles(styles)(_Dropdown)
