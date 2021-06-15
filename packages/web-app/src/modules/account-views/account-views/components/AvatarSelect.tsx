import {  AvatarSelectionForm } from '@saladtechnologies/garden-components'
import { FunctionComponent } from 'react'
import { Avatar } from '../../../profile/models'
import { useState } from 'react'



interface AvatarProps  {
  avatars?: Avatar[]
}

export const AvatarSelect: FunctionComponent<AvatarProps> =({
  avatars,

}) => {

  const [activeAvatar, setActiveAvatar] = useState<string | undefined>(undefined)
  const [submitting, toggleSubmittingState] = useState<boolean>(false)
  const [avatarWithError, setAvatarWithError] = useState<string | undefined>(undefined)

  const handleClearError = () => {
    setAvatarWithError(undefined)
  }

  const handleAvatarSelect = (id: string) => {
    setActiveAvatar(id)
    toggleSubmittingState(true)
    setTimeout(function () {
      toggleSubmittingState(false)
    }, 3000)
  }

  if (activeAvatar && avatars) {
    avatars.forEach((avatar) => {
      if (avatar.selected === true && avatar.id !== activeAvatar) {
        avatar.selected = undefined
      } else if (avatar.id === activeAvatar) {
        avatar.selected = true
      }
    })
  } // need to hookup avatarSelect to an action in the store??

  avatars?.forEach((avatar) => {
    if (avatar.id === avatarWithError) {
      avatar.errorMessage = 'Unable to select avatar'
    } else {
      avatar.errorMessage = undefined
    }
  })

  const avatarList = avatars?.map(avatar => ({alt: avatar.description, src: avatar.imageUrl, id: avatar.id, errorMessage: undefined, selected: false}))
  const emptyAvatar = [{alt: '', src: '', id: ''}]

  return (
    <AvatarSelectionForm onSelect={handleAvatarSelect} isSubmitting={submitting} onClearError={handleClearError} avatars={avatarList ? avatarList : emptyAvatar} >

    </AvatarSelectionForm>
  )
}

export default AvatarSelect

