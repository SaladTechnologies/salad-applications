import { useSyncExternalStore } from 'react'
import type { ExternalState } from '../app/external-state.ts'
import { createExternalState } from '../app/external-state.ts'

/** How the last change to the protection of reward redemptions went. */
export type ProtectRewardsRedemptionStatus = 'success' | 'failure' | 'loading' | 'unknown'

/** An avatar the user can pick. */
export interface ProfileAvatar {
  /** The avatar's name. */
  name: string
  /** What the avatar shows. */
  description: string
  /** The avatar's id. */
  id: string
  /** Where the avatar's image is. */
  imageUrl: string
}

/** The account page's state around the profile: avatars, the forms' statuses, the Google account, and the reminder. */
export interface ProfileState {
  /**
   * The avatar the App API has selected for the user, or the default avatar when loading it failed, or `undefined`
   * before it has loaded and after sign-out.
   */
  currentSelectedAvatar: string | undefined
  /** The avatar whose selection failed, and why. */
  avatarError: { avatar: string; message: string } | undefined
  /** The avatars the user can pick, the default first. */
  avatars: ProfileAvatar[] | undefined
  /** The avatar being selected. */
  submittingAvatar: string | undefined
  /** The avatar the page shows as selected, which a selection shows before the App API answers. */
  selectedAvatar: string | undefined
  /** Whether a username change is being saved. */
  isUserNameSubmitting: boolean
  /** Whether the last username change was saved. */
  isUserNameSubmitSuccess: boolean
  /** Whether a Minecraft username change is being saved. */
  isMinecraftUserNameSubmitting: boolean
  /** Whether the last Minecraft username change was saved. */
  isMinecraftUserNameSubmitSuccess: boolean
  /** The email of the user's connected Google account. */
  connectedGoogleAccountEmail: string | undefined
  /** Whether loading the connected Google account failed. */
  isLoadConnectedGoogleAccountEmailError: boolean
  /** Whether the user closed the install reminder, which the browser remembers. */
  isInstallReminderClosed: boolean
  /** How the last protect-redemption change went. */
  protectRewardsRedemptionStatus: ProtectRewardsRedemptionStatus
}

/** Creates the profile state, with nothing loaded; `isInstallReminderClosed` is what the browser remembers. */
export const createProfileState = (isInstallReminderClosed: boolean): ExternalState<ProfileState> =>
  createExternalState<ProfileState>({
    currentSelectedAvatar: undefined,
    avatarError: undefined,
    avatars: undefined,
    submittingAvatar: undefined,
    selectedAvatar: undefined,
    isUserNameSubmitting: false,
    isUserNameSubmitSuccess: false,
    isMinecraftUserNameSubmitting: false,
    isMinecraftUserNameSubmitSuccess: false,
    connectedGoogleAccountEmail: undefined,
    isLoadConnectedGoogleAccountEmailError: false,
    isInstallReminderClosed,
    protectRewardsRedemptionStatus: 'unknown',
  })

/**
 * The avatar the user has selected, or `undefined` before the avatars or the selected avatar have loaded, and after
 * sign-out.
 */
export const profileAvatarOf = (state: ProfileState): ProfileAvatar | undefined =>
  state.avatars?.find((avatar) => avatar.id === state.currentSelectedAvatar)

/** Where the profile state is kept: the profile store. */
export interface ProfileStateSource {
  /** Returns the current state. */
  getState: () => ProfileState
  /** Calls `listener` after each change, and returns a function that stops that. */
  subscribe: (listener: () => void) => () => void
}

/** Returns the profile state, and re-renders when it changes. Call it in a container. */
export const useProfileState = (source: ProfileStateSource): ProfileState =>
  useSyncExternalStore(source.subscribe, source.getState)
