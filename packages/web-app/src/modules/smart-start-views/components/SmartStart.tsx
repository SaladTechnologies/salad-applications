import React, { Component } from 'react'
import { SaladTheme } from '../../../SaladTheme'
import withStyles, { WithStyles } from 'react-jss'
import { Overlay, OverlayPage } from '../../../components'
import { getStore } from '../../../Store'
import { Blacklist } from '../../machine/models/Blacklist';
import css from './SmartStart.module.scss'
import classnames from 'classnames'

const styles = (theme: SaladTheme) => ({
  container: {
    color: theme.lightGreen,
    fontFamily: 'sharpGroteskBook19',
    fontSize: theme.small,
    padding: '2rem',
  },
  title: {
    borderBottom: 'solid 1px #fff',
    fontFamily: 'SharpGroteskLight09',
    fontSize: theme.xLarge,
    marginTop: '0',
    paddingBottom: '0.5rem',
    marginBottom: '2rem',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textIndent: '1rem'
  },
  description: {
    fontFamily: 'sharpGroteskBook19',
    fontSize: theme.small,
  },

  detailButton: {
    cursor: 'not-allowed',
    padding: '1rem 0',
  },
  lineBreak: {
    borderBottom: `solid 0.5px ${theme.darkBlue}`,
  },
  bugButton: {
    display: 'inline-block',
    padding: '.25rem 1rem',
    backgroundColor: theme.darkBlue,
    color: theme.green,
    marginLeft: '1rem',
    fontFamily: 'sharpGroteskLight25',
    fontSize: theme.small,
    cursor: 'pointer',
    '&:hover': {
      opacity: 0.8,
    },
  },
})

interface Props extends WithStyles<typeof styles> {
  onCloseClicked?: () => void
}

class _SmartStart extends Component<Props> {
  store = getStore()

  blacklistItemHandler = (item: Blacklist) => {
    let update: Blacklist = { 
      name: item.name,
      process: item.process, 
      enabled: !item.enabled 
    }
    
    this.store.smartstart.updateBlacklist(update)
  }

  render() {
    const { onCloseClicked, classes } = this.props
    const blacklist = this.store.native.getBlacklist()
    const list = blacklist
      ? (
        <ul className={classnames(css.list_unstyled, css.blacklist)}>
          {
            blacklist.map((item, index) => {
              return (
                <li key={index} className={css.color_white}>
                  <label>
                    {item.name}
                    <input type="checkbox" defaultChecked={item.enabled} onChange={() => this.blacklistItemHandler(item)} />
                  </label>
                </li>
              )
            })
          }
        </ul>
      )
      : null

    return (
      <OverlayPage onCloseClicked={onCloseClicked}>
        <Overlay onCloseClicked={onCloseClicked}>
          <div id={css.SmartStart}>
            <h1 className={classnames(classes.title, css.color_white)}>Smart Start</h1>

            <p className={classnames(css.beta_copy, css.color_white)}>
              <strong>BETA FEATURE:</strong> Smart start is a way for Salad users automatically have Salad start and stop based 
              on the programs running on your computer. Salad will not run while you are using any of the checked programs below. 
              Send your feedback on this feature to MJ.
            </p>

            {list}
          </div>
        </Overlay>
      </OverlayPage>
    )
  }
}

export const SmartStart = withStyles(styles)(_SmartStart)
