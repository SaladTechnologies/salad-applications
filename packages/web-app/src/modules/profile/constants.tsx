import type { NotificationMessage } from '../notifications/models'
import { NotificationMessageCategory } from '../notifications/models'

export const novuSignaturesEndpointPath = '/api/v2/novu-signatures'
export const avatarsEndpointPath = '/api/v2/avatars'
export const avatarsSelectedEndpointPath = '/api/v2/avatars/selected'
export const profileEndpointPath = '/api/v1/profile'
export const paypalUsersEndpointPath = '/api/v2/paypal/users'
export const authenticationExternalEndpointPath = '/api/v2/authentication/external'
export const protectRewardsRedemptionEndpointPath = '/api/v1/profile/redemptions/tfa'

export const paypalSuccessNotification: NotificationMessage = {
  category: NotificationMessageCategory.PayPalSuccess,
  title: 'Congratulations!',
  message: 'You have successfully linked your PayPal account to Salad.',
}

export const paypalRetryNotification: NotificationMessage = {
  category: NotificationMessageCategory.PayPalRetry,
  title: `Oops! Let's fix that`,
  message:
    'You managed to log in to PayPal, but your browser appears to have prevented us from linking your account to Salad. Check out our support guide for help with this issue.',
  type: 'error',
  onClick: () =>
    window.open(
      'https://support.salad.com/article/226-i-cant-connect-my-paypal-account?_gl=1*30ymmm*_gcl_au*MjAzODc4MDA4MS4xNzI1NTUwOTE2',
      '_blank',
      'noopener, noreferrer',
    ),
}

export const paypalFailureNotification: NotificationMessage = {
  category: NotificationMessageCategory.PayPalFailure,
  title: `Let's try that again`,
  message: `We weren't able to connect your PayPal account to Salad. Feel free to try again whenever you like. If the problem persists, please contact Salad Support.`,
  type: 'error',
  onClick: () =>
    window.open(
      'https://support.salad.com/?_gl=1*mtbbt7*_gcl_au*MjAzODc4MDA4MS4xNzI1NTUwOTE2',
      '_blank',
      'noopener, noreferrer',
    ),
}

export const paypalAccountInUseNotification: NotificationMessage = {
  category: NotificationMessageCategory.PayPalAccountInUse,
  title: `Let's try that again`,
  message: 'This PayPal account cannot be linked to this Salad account. Learn More.',
  type: 'error',
  onClick: () =>
    window.open(
      'https://support.salad.com/article/228-faq-on-paypal-rewards?_gl=1*8ttjos*_gcl_au*MjAzODc4MDA4MS4xNzI1NTUwOTE2',
      '_blank',
      'noopener, noreferrer',
    ),
}
