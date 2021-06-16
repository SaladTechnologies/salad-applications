import { AvatarSelectionForm, Text } from '@saladtechnologies/garden-components'
import { FunctionComponent } from 'react'
import { Avatar } from '../../../profile/models'
import { useState } from 'react'

interface AvatarProps {
  avatars?: Avatar[]
  onSelectAvatar:(id: string) => void
  selectedAvatar?: Avatar
  errorAvatarId?: string
  clearAvatarError:() => void
}

export const AvatarSelect: FunctionComponent<AvatarProps> = ({ avatars, clearAvatarError,  onSelectAvatar, selectedAvatar }) => {
  const [activeAvatar, setActiveAvatar] = useState<string | undefined>(undefined)
  const [submitting, toggleSubmittingState] = useState<boolean>(false)
  const handleClearError = () => {
    clearAvatarError()
  }
  const handleAvatarSelect = (id: string) => {
    activeAvatar !== id &&
    onSelectAvatar(id)
    setActiveAvatar(id)
    toggleSubmittingState(true)
    setTimeout(function () {
      toggleSubmittingState(false)
    }, 3000)
  }

  const avatarList  = avatars?.map((avatar) => ({
    alt: avatar.description,
    src: avatar.imageUrl,
    id: avatar.id,
    errorMessage: avatar.errorMessage,
    selected: selectedAvatar?.id === avatar.id ? true : false,
  }))
  const emptyAvatar = [{ alt: '', src: '', id: '' }]

  return (
   <><Text as="p">Avatar</Text> <AvatarSelectionForm
      onSelect={handleAvatarSelect}
      isSubmitting={submitting}
      onClearError={handleClearError}
      avatars={avatarList ? avatarList : emptyAvatar}
    ></AvatarSelectionForm>
</>
  )
}

export default AvatarSelect
