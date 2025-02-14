import classnames from 'classnames'
import type CSS from 'csstype'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import type { SaladTheme } from '../../../SaladTheme'

const styles: (theme: SaladTheme) => Record<string, CSS.Properties> = (theme: SaladTheme) => ({
  btn: {
    border: '1px solid ' + theme.lightGreen,
    color: theme.lightGreen,
    display: 'inline-block',
    padding: '6px 12px',
    position: 'relative',
    textAlign: 'center',
    userSelect: 'none',
    fontFamily: 'Mallory',
    fontSize: '16px',
    minWidth: '50px',
    lineHeight: '20px',
  },
  active: {
    backgroundColor: theme.lightGreen,
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
  selectedOptionName: string
  onOptionChange: (name: string) => void
}

const _Segments = ({ classes, options, selectedOptionName, onOptionChange }: Props) => {
  return (
    <>
      {options.map((option, index) => (
        <label
          className={classnames(
            classes.btn,
            selectedOptionName === option.name ? classes.active : classes.inactive,
            option.disabled && classes.disabled,
          )}
          onClick={() => !option.disabled && onOptionChange(option.name)}
          key={index}
        >
          {String(option.name)}
        </label>
      ))}
    </>
  )
}

export const Segments = withStyles(styles)(_Segments)
