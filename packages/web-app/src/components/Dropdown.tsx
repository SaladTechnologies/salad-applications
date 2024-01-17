import type { FC } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import type { OptionsOrGroups } from 'react-select'
import Select from 'react-select'
import type { SaladTheme } from '../SaladTheme'

const styles = (theme: SaladTheme) => ({
  container: {
    fontFamily: theme.fontGroteskBook19,
    fontSize: 12,
    color: theme.lightGreen,
  },
})

interface Props extends WithStyles<typeof styles> {
  options?: OptionsOrGroups<any, any>
  value?: string
  onChange?: (value?: any) => void
}

const _Dropdown: FC<Props> = ({ classes, options, value, onChange }) => {
  const selectedValue = value
  const selectedOption = selectedValue && options?.find((option) => option.value === selectedValue)

  const customStyles = {
    option: (styles: any) => {
      return {
        ...styles,
        cursor: 'pointer',
      }
    },
    singleValue: (provided: any, state: any) => {
      const opacity = state.isDisabled ? 0.5 : 1
      const transition = 'opacity 300ms'
      const color = '#DBF1C1'

      return { ...provided, opacity, transition, color }
    },
  }

  return (
    <Select
      className={classes.container}
      value={selectedOption}
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
          neutral0: '#0A2133',
          primary25: '#1F4F22',
          primary: '#DBF1C1',
          neutral20: '#DBF1C1',
        },
      })}
    />
  )
}

export const Dropdown = withStyles(styles)(_Dropdown)
