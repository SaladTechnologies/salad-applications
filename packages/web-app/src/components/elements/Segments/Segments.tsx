import classnames from 'classnames'
import type CSS from 'csstype'
import { useState } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import type { SaladTheme } from '../../../SaladTheme'

const styles: (theme: SaladTheme) => Record<string, CSS.Properties> = (theme: SaladTheme) => ({
  btn: {
    border: '1px solid ' + theme.green,
    color: theme.green,
    display: 'inline-block',
    padding: '6px 12px',
    position: 'relative',
    textAlign: 'center',
    transition: 'background 600ms ease, color 600ms ease',
    userSelect: 'none',
    fontFamily: 'Mallory',
    fontSize: '16px',
    minWidth: '50px',
    lineHeight: '20px',
  },
  active: {
    backgroundColor: theme.green,
    color: theme.darkBlue,
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    cursor: 'default',
    transition: 'color 200ms',
  },
  inactive: {
    cursor: 'pointer',
  },
  disabled: {
    boxShadow: 'none',
    opacity: '0.5',
    color: theme.lightGreen,
    cursor: 'not-allowed',
  },
})

interface Option {
  name: string
  action: () => void
  disabled?: boolean
}

interface Props extends WithStyles<typeof styles> {
  options: Option[]
}

const _Segments = ({ classes, options }: Props) => {
  const [selectedOptionName, setSelectedOptionName] = useState<string>(options[0]?.name || '')

  const handleSelect = (action: () => void, name: string, disabled?: boolean) => {
    if (disabled) return
    setSelectedOptionName(name)
    action()
  }

  return (
    <>
      {options.map((option, index) => (
        <label
          className={classnames(
            classes.btn,
            selectedOptionName === option.name ? classes.active : classes.inactive,
            option.disabled && classes.disabled,
          )}
          onClick={() => handleSelect(option.action, option.name, option.disabled)}
          key={index}
        >
          {option.name}
        </label>
      ))}
    </>
  )
}

export const Segments = withStyles(styles)(_Segments)
