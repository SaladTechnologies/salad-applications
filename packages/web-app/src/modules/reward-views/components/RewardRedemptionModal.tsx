import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'
import classnames from 'classnames'
import { ModalPage, Checkbox, Button, TextField } from '../../../components'
import { Reward } from '../../reward/models/Reward'
import { Form, Field } from 'react-final-form'
import { observer } from 'mobx-react'
import { RewardDetailsPanel } from './RewardDetailsPanel'
import { isEmailFormat } from '../../../utils'

//TODO: Move this into a feature flag
const showGiftOption = false

const styles = (theme: SaladTheme) => ({
  container: {
    display: 'flex',
    position: 'relative',
    width: '790px',
    userSelect: 'none',
  },
  lock: {
    position: 'absolute',
    right: '.5rem',
    top: '.5rem',
    cursor: 'pointer',
    '&:hover': {
      opacity: 0.7,
    },
  },
  imageContainer: {
    height: '12rem',
    display: 'inline-block',
    width: '290px',
    backgroundColor: (props: Props) => (props.reward && props.reward.color) || theme.green,
  },
  image: {
    height: '100%',
    width: 'auto',
  },
  rightContainer: {
    width: '37rem',
    padding: '.5rem',
    overflow: 'hidden',
    marginLeft: '.5rem',
    display: 'inline-flex',
    flexDirection: 'column',
    backgroundColor: (props: Props) => (props.reward && props.reward.redeemable ? theme.green : theme.darkGreen),
    color: (props: Props) => (props.reward && props.reward.redeemable ? theme.darkBlue : theme.green),
  },
  logoContainer: {
    paddingTop: '4rem',
  },
  logo: {
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '3rem',
  },
  contentContainer: {
    fontFamily: theme.fontGroteskBook19,
    fontSize: theme.small,
  },
  contentLabel: {
    display: 'inline',
    fontFamily: 'sharpGroteskLight25',
    fontSize: theme.small,
    textTransform: 'uppercase',
  },
  headerContent: {
    fontFamily: 'sharpGroteskLight25',
    fontSize: theme.medium,
  },
  titleContent: {
    fontFamily: 'sharpGroteskLight09',
    fontSize: theme.xLarge,
  },
  descriptionContent: {
    fontFamily: 'sharpGroteskBook19',
    fontSize: theme.medium,
  },
  submitPanel: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginLeft: 'auto',
  },
  giftPanel: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  termText: {
    padding: '.25rem',
    fontStyle: 'italic',
  },
  bottomContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
})

interface Props extends WithStyles<typeof styles> {
  reward?: Reward
  submitting?: boolean
  onClickClose?: () => void
  onClickDone?: () => void
  onRedeem?: (rewardId: string, email?: string) => void
}

interface FormTypes {
  email?: string
  gift?: boolean
}

@observer
class _RewardRedemptionModal extends Component<Props> {
  handleClose = () => {
    const { onClickClose } = this.props

    if (onClickClose) {
      onClickClose()
    }
  }

  Condition = ({ when, children }: any) => (
    <Field name={when} subscription={{ value: true }}>
      {({ input: { value } }) => (!!value ? children : null)}
    </Field>
  )

  handleDone = () => {
    const { onClickDone } = this.props

    if (onClickDone) {
      onClickDone()
    }
  }

  onSubmit = (values: {}) => {
    const { reward, onRedeem } = this.props
    let v = values as FormTypes
    if (reward && onRedeem) onRedeem(reward.id, v.gift ? v.email : undefined)
  }

  validate = (values: {}) => {
    let v = values as FormTypes
    const errors: FormTypes = {}
    if (v.gift) {
      if (v.email === undefined || v.email.length === 0) {
        errors.email = 'Required'
      } else if (!isEmailFormat(v.email)) {
        errors.email = 'Invalid email'
      }
    }
    return errors
  }

  render() {
    const { reward, onClickClose, submitting, classes } = this.props

    return (
      <ModalPage onCloseClicked={this.handleClose}>
        <RewardDetailsPanel reward={reward} onClickClose={onClickClose}>
          <div className={classnames(classes.contentContainer)}>
            <Form
              onSubmit={this.onSubmit}
              validate={this.validate}
              render={({ handleSubmit }) => {
                return (
                  <form onSubmit={handleSubmit}>
                    {reward &&
                      reward.checkoutTerms &&
                      reward.checkoutTerms.map(term => (
                        <div key={term} className={classes.termText}>
                          - {term}
                        </div>
                      ))}
                    <div className={classes.bottomContainer}>
                      {showGiftOption && (
                        <div className={classes.giftPanel}>
                          <Field name={'gift'} type="checkbox">
                            {({ input, meta }) => (
                              <div style={{ padding: '.25rem 0' }}>
                                <Checkbox
                                  {...input}
                                  text={'This item is a gift'}
                                  dark
                                  errorText={meta.error && meta.touched && meta.error}
                                />
                              </div>
                            )}
                          </Field>
                          <this.Condition when="gift" is="true">
                            <Field name="email">
                              {({ input, meta }) => (
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                  <TextField
                                    dark
                                    {...input}
                                    placeholder={'Email'}
                                    errorText={meta.error && meta.touched && meta.error}
                                  />
                                </div>
                              )}
                            </Field>
                          </this.Condition>
                        </div>
                      )}
                      <div className={classes.submitPanel}>
                        <Button type="submit" loading={submitting} disabled={submitting} dark>
                          Bombs Away
                        </Button>
                        <div className={classes.termText}>{`*Salad plays for keeps (no refunds)`}</div>
                      </div>
                    </div>
                  </form>
                )
              }}
            />
          </div>
        </RewardDetailsPanel>
      </ModalPage>
    )
  }
}

export const RewardRedemptionModal = withStyles(styles)(_RewardRedemptionModal)
