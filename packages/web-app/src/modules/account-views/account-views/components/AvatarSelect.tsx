import { AvatarSelectionForm, Text } from '@saladtechnologies/garden-components'
import { FunctionComponent, useMemo } from 'react'
import { Avatar } from '../../../profile/models'

interface AvatarProps {
  avatars?: Avatar[]
  error?: {
    avatarId: string
    message: string
  }
  isSubmitting: boolean
  onClearError: () => void
  onSelectAvatar: (id: string) => void
  selectedAvatar?: Avatar
}

export const AvatarSelect: FunctionComponent<AvatarProps> = ({
  avatars,
  error,
  isSubmitting,
  onClearError,
  onSelectAvatar,
  selectedAvatar,
}) => {
  const avatarFormItems = useMemo(() => {
    return avatars
      ? avatars.map((avatar) => ({
          alt: avatar.description,
          src: avatar.imageUrl,
          id: avatar.id,
          errorMessage: error && error.avatarId === avatar.id ? error.message : undefined,
          selected: selectedAvatar?.id === avatar.id ? true : false,
        }))
      : []
  }, [avatars, error, selectedAvatar])

  return (
    <>
      <Text as="p">Avatar</Text>{' '}
      <AvatarSelectionForm
        avatars={avatarFormItems}
        isSubmitting={isSubmitting}
        onClearError={onClearError}
        onSelect={onSelectAvatar}
      ></AvatarSelectionForm>
    </>
  )
}

export default AvatarSelect
