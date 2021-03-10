import classnames from 'classnames'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'
import { IconArrowDown } from '../../reward-views/components/assets'

const styles = (theme: SaladTheme) => ({
  arrow: {
    marginLeft: 10,
    opacity: 0.5,
    width: 15,
  },
  arrowActive: {
    opacity: 1,
  },
  label: {
    cursor: 'pointer',
    fontFamily: theme.fontGroteskLight25,
    fontSize: theme.mediumLarge,
    lineHeight: theme.mediumLarge,
  },
  tableHeader: {
    cursor: 'pointer',
    display: 'flex',
  },
})

interface Props extends WithStyles<typeof styles> {
  active: boolean
  header: string
  onClick?: () => void
}

const _VaultListHeaderItem = ({ active, header, onClick, classes }: Props) => {
  return (
    <div className={classes.tableHeader} onClick={onClick}>
      <label className={classes.label}>{header}</label>
      <div className={classnames(classes.arrow, { [classes.arrowActive]: active })}>
        <IconArrowDown />
      </div>
    </div>
  )
}

export const VaultListHeaderItem = withStyles(styles)(_VaultListHeaderItem)
