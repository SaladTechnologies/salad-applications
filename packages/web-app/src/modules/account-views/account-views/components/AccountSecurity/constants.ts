import OnePassword from './assets/1Password.svg'
import OnePasswordLight from './assets/1PasswordLight.svg'
import Bitwarden from './assets/Bitwarden.svg'
import BitwardenLight from './assets/BitwardenLight.svg'
import Chrome from './assets/Chrome.svg'
import ChromeLight from './assets/ChromeLight.svg'
import Dashlane from './assets/Dashlane.svg'
import DashlaneLight from './assets/DashlaneLight.svg'
import Edge from './assets/Edge.svg'
import EdgeLight from './assets/EdgeLight.svg'
import Enpass from './assets/Enpass.svg'
import EnpassLight from './assets/EnpassLight.svg'
import GooglePasswordManager from './assets/GooglePasswordManager.svg'
import GooglePasswordManagerLight from './assets/GooglePasswordManagerLight.svg'
import iCloudKeychain from './assets/iCloudKeychain.svg'
import iCloudKeychainLight from './assets/iCloudKeychainLight.svg'
import IDmelon from './assets/IDmelon.svg'
import IDmelonLight from './assets/IDmelonLight.svg'
import iPasswords from './assets/iPasswords.svg'
import iPasswordsLight from './assets/iPasswordsLight.svg'
import KeePassXC from './assets/KeePassXC.svg'
import KeePassXCLight from './assets/KeePassXCLight.svg'
import Keeper from './assets/Keeper.svg'
import KeeperLight from './assets/KeeperLight.svg'
import NordPass from './assets/NordPass.svg'
import NordPassLight from './assets/NordPassLight.svg'
import ProtonPass from './assets/ProtonPass.svg'
import ProtonPassLight from './assets/ProtonPassLight.svg'
import SamsungPass from './assets/SamsungPass.svg'
import SamsungPassLight from './assets/SamsungPassLight.svg'
import Sésame from './assets/Sésame.svg'
import SésameLight from './assets/SésameLight.svg'
import Thales from './assets/Thales.svg'
import ThalesLight from './assets/ThalesLight.svg'
import ToothPic from './assets/ToothPic.svg'
import ToothPicLight from './assets/ToothPicLight.svg'
import WindowsHello from './assets/WindowsHello.svg'
import WindowsHelloLight from './assets/WindowsHelloLight.svg'

export const passkeyVendorIcons: Record<string, { iconDark: string; iconLight: string; alt: string }> = {
  'bada5566-a7aa-401f-bd96-45619a55120d': { iconDark: OnePassword, iconLight: OnePasswordLight, alt: 'OnePassword' },
  'd548826e-79b4-db40-a3d8-11116f7e8349': { iconDark: Bitwarden, iconLight: BitwardenLight, alt: 'Bitwarden' },
  'adce0002-35bc-c60a-648b-0b25f1f05503': { iconDark: Chrome, iconLight: ChromeLight, alt: 'Chrome on Mac' },
  'b5397666-4885-aa6b-cebf-e52262a439a2': { iconDark: Chrome, iconLight: ChromeLight, alt: 'Chromium Browser' },
  '531126d6-e717-415c-9320-3d9aa6981239': { iconDark: Dashlane, iconLight: DashlaneLight, alt: 'Dashlane' },
  '771b48fd-d3d4-4f74-9232-fc157ab0507a': { iconDark: Edge, iconLight: EdgeLight, alt: 'Edge on Mac' },
  'f3809540-7f14-49c1-a8b3-8f813b225541': { iconDark: Enpass, iconLight: EnpassLight, alt: 'Enpass' },
  'ea9b8d66-4d01-1d21-3ce4-b6b48cb575d4': {
    iconDark: GooglePasswordManager,
    iconLight: GooglePasswordManagerLight,
    alt: 'Google Password Manager',
  },
  '39a5647e-1853-446c-a1f6-a79bae9f5bc7': { iconDark: IDmelon, iconLight: IDmelonLight, alt: 'IDmelon' },
  'fdb141b2-5d84-443e-8a35-4698c205a502': { iconDark: KeePassXC, iconLight: KeePassXCLight, alt: 'KeePassXC' },
  '0ea242b4-43c4-4a1b-8b17-dd6d0b6baec6': { iconDark: Keeper, iconLight: KeeperLight, alt: 'Keeper' },
  'b84e4048-15dc-4dd0-8640-f4f60813c8af': { iconDark: NordPass, iconLight: NordPassLight, alt: 'NordPass' },
  '50726f74-6f6e-5061-7373-50726f746f6e': { iconDark: ProtonPass, iconLight: ProtonPassLight, alt: 'Proton Pass' },
  '53414d53-554e-4700-0000-000000000000': { iconDark: SamsungPass, iconLight: SamsungPassLight, alt: 'Samsung Pass' },
  '891494da-2c90-4d31-a9cd-4eab0aed1309': { iconDark: Sésame, iconLight: SésameLight, alt: 'Sésame' },
  '66a0ccb3-bd6a-191f-ee06-e375c50b9846': { iconDark: Thales, iconLight: ThalesLight, alt: 'Thales Bio iOS SDK' },
  '8836336a-f590-0921-301d-46427531eee6': { iconDark: Thales, iconLight: ThalesLight, alt: 'Thales Bio Android SDK' },
  'cd69adb5-3c7a-deb9-3177-6800ea6cb72a': { iconDark: Thales, iconLight: ThalesLight, alt: 'Thales PIN Android SDK' },
  '17290f1e-c212-34d0-1423-365d729f09d9': { iconDark: Thales, iconLight: ThalesLight, alt: 'Thales PIN iOS SDK' },
  'cc45f64e-52a2-451b-831a-4edd8022a202': {
    iconDark: ToothPic,
    iconLight: ToothPicLight,
    alt: 'ToothPic Passkey Provider',
  },
  '08987058-cadc-4b81-b6e1-30de50dcbe96': {
    iconDark: WindowsHello,
    iconLight: WindowsHelloLight,
    alt: 'Windows Hello',
  },
  '9ddd1817-af5a-4672-a2b9-3e3dd95000a9': {
    iconDark: WindowsHello,
    iconLight: WindowsHelloLight,
    alt: 'Windows Hello',
  },
  '6028b017-b1d4-4c02-b4b3-afcdafc96bb2': {
    iconDark: WindowsHello,
    iconLight: WindowsHelloLight,
    alt: 'Windows Hello',
  },
  'dd4ec289-e01d-41c9-bb89-70fa845d4bf2': {
    iconDark: iCloudKeychain,
    iconLight: iCloudKeychainLight,
    alt: 'iCloud Keychain (Managed)',
  },
  'fbfc3007-154e-4ecc-8c0b-6e020557d7bd': {
    iconDark: iCloudKeychain,
    iconLight: iCloudKeychainLight,
    alt: 'iCloud Keychain',
  },
  'bfc748bb-3429-4faa-b9f9-7cfa9f3b76d0': { iconDark: iPasswords, iconLight: iPasswordsLight, alt: 'iPasswords' },
}
