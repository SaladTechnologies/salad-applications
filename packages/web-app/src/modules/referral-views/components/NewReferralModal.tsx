import React, { Component } from 'react'
import { SaladTheme } from '../../../SaladTheme'
import withStyles, { WithStyles } from 'react-jss'
import { Modal, ModalPage, TextField, Button } from '../../../components'
import { Form, Field } from 'react-final-form'

const styles = (theme: SaladTheme) => ({
  contentContainer: {
    color: theme.darkBlue,
    padding: '.25rem',
  },
  title: {
    fontFamily: 'SharpGroteskLight09',
    fontSize: theme.xLarge,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textTransform: 'uppercase',
  },
  description: {
    fontFamily: 'sharpGroteskBook19',
    fontSize: theme.small,
  },
  detailsContainer: {
    color: theme.lightGrey,
    textAlign: 'center',
    fontFamily: 'sharpGroteskBook19',
    fontSize: theme.small,
    padding: '2rem 0',
  },
  detailButton: {
    cursor: 'not-allowed',
  },
  lineBreak: {
    borderBottom: `solid 0.5px ${theme.lightGrey}`,
    padding: '.25rem 0',
  },
  logoutButton: {
    display: 'inline-block',
    padding: '.25rem 1rem',
    backgroundColor: theme.darkBlue,
    color: theme.lightGreen,
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
  onSend?: (email: string) => void
  sending?: boolean
}

interface FormTypes {
  email?: string
}

class _NewReferralModal extends Component<Props> {
  onSubmit = (values: {}) => {
    const { onSend } = this.props
    let v = values as FormTypes
    if (onSend && v.email) onSend(v.email)
  }

  validate = (values: {}) => {
    let v = values as FormTypes

    const errors: FormTypes = {}
    if (v.email === undefined || v.email.length === 0) {
      errors.email = 'Required'
    } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v.email)) {
      errors.email = 'Invalid email'
    }

    return errors
  }

  render() {
    const { sending, onCloseClicked, classes } = this.props
    return (
      <ModalPage onCloseClicked={onCloseClicked}>
        <Modal onCloseClicked={onCloseClicked}>
          <div className={classes.contentContainer}>
            <div className={classes.title}>$5.00 Bonus by referring a friend!</div>
            <p className={classes.description}>
              Be wise in your candidate, as you only get the bonus after your friend hits 720 XP. If their GPU doesn't
              have 4GB+ VRAM, or they don't have enough idle time to run the app, you might miss out. The longer they’re
              chopping salad, the faster you’ll get your bonus.
            </p>
            <p className={classes.description}>
              Once referred, your friend has 7 days to get choppin' - so be sure to bug them to hit that XP total. Don't
              forget to mention that they'll get a $5.00 alpha tester bonus upon reaching 720 XP as well! Just so make
              sure your selection is a fit for Salad, and you're good to go!
            </p>
          </div>

          <Form
            onSubmit={this.onSubmit}
            validate={this.validate}
            render={({ handleSubmit }) => {
              return (
                <form onSubmit={handleSubmit}>
                  <Field name="email" type="email">
                    {({ input, meta }) => (
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          paddingTop: '1rem',
                        }}
                      >
                        <TextField
                          {...input}
                          dark
                          placeholder="Email Address"
                          errorText={meta.error && meta.touched && meta.error}
                        />
                        <Button type="submit" dark loading={sending} disabled={sending}>
                          BOMBS AWAY
                        </Button>
                      </div>
                    )}
                  </Field>
                </form>
              )
            }}
          />
        </Modal>
      </ModalPage>
    )
  }
}

export const NewReferralModal = withStyles(styles)(_NewReferralModal)
