import type { FunctionComponent } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import { Scrollbar } from '../../../components'

export const styles = () => ({
  pageWrapper: {
    display: 'flex',
    height: '100%',
    width: '100%',
  },
  rewardsWrapper: {
    gap: '32px',
    padding: '70px 0px 0px 70px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  backgroundImage: {
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    height: '1343px',
    flex: 1,
  },
})

interface Props extends WithStyles<typeof styles> {}

const _DemandMonitorPage: FunctionComponent<Props> = ({ classes }) => {
  return (
    <Scrollbar>
      <div className={classes.pageWrapper}>
        <div className={classes.rewardsWrapper}></div>
        <div className={classes.backgroundImage}></div>
      </div>
    </Scrollbar>
  )
}

export const DemandMonitorPage = withStyles(styles)(_DemandMonitorPage)
