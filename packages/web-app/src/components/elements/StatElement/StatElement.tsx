import React, { ReactNode } from 'react'

// Packages
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'
import { InfoButton } from '../..'

const styles = (theme: SaladTheme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    paddingTop: '.5rem',
    userSelect: 'none',
  },
  textContainer: {
    textTransform: 'uppercase',
    fontFamily: theme.fontGroteskBook25,
    fontSize: theme.small,
    textAlign: 'right',
    letterSpacing: '1.5px',
  },
  title: {
    color: theme.mediumGreen,
  },
  value: {
    color: theme.lightGreen,
  },
})

interface Props extends WithStyles<typeof styles> {
  title?: string
  values?: string[]
  showInfo?: boolean
  infoText?: string
  infoTooltip?: ReactNode
}

// Define the component using these styles and pass it the 'classes' prop.
// Use this to assign scoped class names.
const _StatElement = ({ title, values, showInfo, infoText, infoTooltip, classes }: Props) => (
  <div className={classes.container}>
    <div className={classes.textContainer}>
      <div className={classes.title}>{title}</div>
      {values &&
        values.map(value => (
          <div key={value} className={classes.value}>
            {value}
          </div>
        ))}
    </div>
    <div>{showInfo && <InfoButton text={infoText} tooltip={infoTooltip} />}</div>
  </div>
)

// Finally, inject the stylesheet into the component.
export const StatElement = withStyles(styles)(_StatElement)
