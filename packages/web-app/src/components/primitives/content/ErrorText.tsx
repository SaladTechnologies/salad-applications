import classnames from 'classnames'
import type { FC, ReactNode } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import type { SaladTheme } from '../../../SaladTheme'

const styles = (theme: SaladTheme) => ({
  errorText: {
    color: 'rgb(255, 255, 255)',
    fontFamily: theme.fontMallory,
    fontSize: theme.medium,
    padding: '8px 12px',
    background: 'rgb(239, 80, 42)',
    boxShadow: 'rgb(239, 80, 42) 0px 0px 30px',
  },
})

interface Props extends WithStyles<typeof styles> {
  children?: ReactNode
}

const _ErrorText: FC<Props> = ({ children, classes }) => {
  return <div className={classnames(classes.errorText)}>{children}</div>
}

export const ErrorText = withStyles(styles)(_ErrorText)
