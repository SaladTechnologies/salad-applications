import React, { Component } from 'react'

// Styles
import { styles } from './Phrases.styles'

// Components
import { H4 } from '../../../index'

// Packages
import withStyles, { WithStyles } from 'react-jss'
import classnames from 'classnames'

export enum PhraseType {
  loading = 'loading',
  bonus = 'bonus',
  all = 'all',
}

interface Props extends WithStyles<typeof styles> {
  className?: string
  phraseType: PhraseType
  phraseDelay?: number
}

class _Phrases extends Component<Props> {
  state = {
    phrase: 'Loading Salad',
    lastPhraseIndex: 0,
  }

  loadingPhrases: string[] = [
    `Look at that little progress bar go!`,
    `Salad is loading. This is your chance to pee.`,
    `Checking for a pulse...`,
    `Are you gonna be our Top Chopper today?`,
    `POSTURE CHECK!`,
    `Greetings from Utah!`,
    `By the time you finish reading this, Salad will be done loading... right?`,
    `People expecting actual salad will be disappointed.`,
    `Does anyone else smell burnt toast?`,
    `Alexa, how do I make funny loading screens?`,
    `This is a loading message. What else did you expect?`,
    `Do you ever wonder why we're here?`,
  ]
  bonusPhrases: string[] = [
    `My brother got to be on a Taco Sauce packet...`,
    `You look good while waiting.`,
    `This Salad is being tossed!... wait a minute...`,
    `Achievement Unlocked: Loading Salad.`,
    `We should kiss, just to break the tension.`,
    `You can be my player 2 anytime.`,
    `Beep Boop I'm a loading screen.`,
    `We've been expecting you...`,
  ]
  allPhrases: string[] = this.loadingPhrases.concat(this.bonusPhrases)

  getPhraseDelay = () => {
    const { phraseDelay } = this.props
    return phraseDelay || 4000
  }

  getRandomNumber = (phraseType: PhraseType): number => {
    let length = 0

    switch (phraseType) {
      case PhraseType.loading:
        length = this.loadingPhrases.length
        break
      case PhraseType.bonus:
        length = this.bonusPhrases.length
        break
      case PhraseType.all:
        length = this.allPhrases.length
        break
    }

    let random = Math.floor(Math.random() * length)

    return random
  }

  setPhrase = () => {
    const { phraseType } = this.props

    let index: number = this.getRandomNumber(phraseType)

    if (index === this.state.lastPhraseIndex) this.phraseTimer

    this.setState({
      lastPhraseIndex: index,
    })

    switch (phraseType) {
      case PhraseType.loading:
        this.setState({
          phrase: this.loadingPhrases[index],
        })
        break
      case PhraseType.bonus:
        this.setState({
          phrase: this.bonusPhrases[index],
        })
        break
      case PhraseType.all:
        this.setState({
          phrase: this.allPhrases[index],
        })
        break
    }
  }

  phraseTimer = () => {
    return setInterval(() => {
      this.setPhrase()
    }, this.getPhraseDelay())
  }

  componentDidMount() {
    this.setPhrase()
    this.phraseTimer()
  }

  componentWillUnmount() {
    clearInterval(this.phraseTimer())
  }

  render() {
    const { className } = this.props

    return (
      <div className={classnames(className)}>
        <H4>{this.state.phrase}</H4>
      </div>
    )
  }
}

export const Phrases = withStyles(styles)(_Phrases)
