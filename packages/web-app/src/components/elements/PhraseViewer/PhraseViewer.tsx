import React, { Component } from 'react'

// Styles
import { styles } from './PhraseViewer.styles'

// Componentes
import { Logo } from '../Logo/Logo'
import { Phrases, PhraseType } from './Phrases/Phrases'

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
