import { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import Select, { OptionTypeBase } from 'react-select'
import { SaladTheme } from '../SaladTheme'

const styles = (theme: SaladTheme) => ({
  container: {
    fontFamily: theme.fontGroteskBook19,
    fontSize: 12,
    color: theme.lightGreen,
  },
})

interface Props extends WithStyles<typeof styles> {
  options?: OptionTypeBase[]
  onChange?: (value?: any) => void
}

const customStyles = {
  singleValue: (provided: any, state: any) => {
    const opacity = state.isDisabled ? 0.5 : 1
    const transition = 'opacity 300ms'
    const color = '#DBF1C1'

    return { ...provided, opacity, transition, color }
  },
}

class _Dropdown extends Component<Props> {
  render() {
    const { options, onChange, classes } = this.props

    return (
      <Select
        className={classes.container}
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
}

export const Dropdown = withStyles(styles)(_Dropdown)
