import React, { Component } from 'react'

// Styles
import { styles } from './PhraseViewer.styles'

// Components
import { Logo, Phrases, PhraseType } from '../../index'

// Packages
import withStyles, { WithStyles } from 'react-jss'

interface Props extends WithStyles<typeof styles> {
  phraseType: PhraseType,
  phraseDelay?: number
}

class _PhraseViewer extends Component<Props> {
  render() {
    const { phraseType, phraseDelay } = this.props

    return (
      <>
        <Logo />
        <Phrases phraseType={phraseType} phraseDelay={phraseDelay} />
      </>
    )
  }
}

export const PhraseViewer = withStyles(styles)(_PhraseViewer)
