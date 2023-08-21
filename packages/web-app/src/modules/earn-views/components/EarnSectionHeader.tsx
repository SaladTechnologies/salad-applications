import type { FunctionComponent, ReactNode } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import type { SaladTheme } from '../../../SaladTheme'

const styles = (theme: SaladTheme) => ({
  header: {
    fontFamily: theme.fontGroteskLight09,
    fontSize: 56,
    color: theme.green,
    textShadow: '0px 0px 24px rgba(178, 213, 48, 0.70)',
    fontWeight: 300,
    lineHeight: 1,
  },
})

interface Props extends WithStyles<typeof styles> {
  children?: ReactNode
}

const _EarnSectionHeader: FunctionComponent<Props> = ({ children, classes }) => (
  <div className={classes.header}>{children}</div>
)

export const EarnSectionHeader = withStyles(styles)(_EarnSectionHeader)
