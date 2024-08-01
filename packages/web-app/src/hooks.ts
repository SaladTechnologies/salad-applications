import { useEffect, useState } from 'react'

const isDeviceSupportPasskey = async (): Promise<boolean> => {
  // Availability of `window.PublicKeyCredential` means WebAuthn is usable.
  // `isUserVerifyingPlatformAuthenticatorAvailable` means the feature detection is usable.
  // `​​isConditionalMediationAvailable` means the feature detection is usable.
  if (
    window.PublicKeyCredential &&
    typeof PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === 'function' &&
    typeof PublicKeyCredential.isConditionalMediationAvailable === 'function'
  ) {
    try {
      const [isAuthenticatorAvailable, isMediationAvailable] = await Promise.all([
        PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable(),
        PublicKeyCredential.isConditionalMediationAvailable(),
      ])

      return isAuthenticatorAvailable && isMediationAvailable
    } catch (error) {
      console.error('Error checking passkey support:', error)
      return false
    }
  }

  return false
}

export const usePasskeySupport = (): boolean => {
  const [isPasskeySupported, setIsPasskeySupported] = useState<boolean>(false);

  useEffect(() => {
    const checkPasskeySupport = async () => {
      try {
        const isSupported = await isDeviceSupportPasskey();
        setIsPasskeySupported(isSupported);
      } catch (error) {
        console.error('Error checking passkey support:', error);
        setIsPasskeySupported(false);
      }
    };

    checkPasskeySupport();
  }, []);

  return isPasskeySupported;
};
