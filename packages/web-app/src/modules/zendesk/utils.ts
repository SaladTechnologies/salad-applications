import type { Systeminformation as si } from 'systeminformation'
import { AntiVirusSoftware } from './models'
type SystemProcessesData = si.ProcessesData

interface ZendeskAVData {
  id?: number
  name?: AntiVirusSoftware
}

export const getZendeskAVData = (identifier: AntiVirusSoftware | string | number): ZendeskAVData => {
  let zendeskAVData: ZendeskAVData = { id: undefined, name: undefined }

  switch (identifier) {
    case AntiVirusSoftware.Adaware:
    case 360041688612:
      zendeskAVData.id = 360041688612
      zendeskAVData.name = AntiVirusSoftware.Adaware
      break
    case AntiVirusSoftware.AdvancedSystemCareUltimate:
    case 360042137651:
      zendeskAVData.id = 360042137651
      zendeskAVData.name = AntiVirusSoftware.AdvancedSystemCareUltimate
      break
    case AntiVirusSoftware.Avast:
    case 360033487211:
      zendeskAVData.id = 360033487211
      zendeskAVData.name = AntiVirusSoftware.Avast
      break
    case AntiVirusSoftware.AVG:
    case 360041706612:
      zendeskAVData.id = 360041706612
      zendeskAVData.name = AntiVirusSoftware.AVG
      break
    case AntiVirusSoftware.Avira:
    case 360042139651:
      zendeskAVData.id = 360042139651
      zendeskAVData.name = AntiVirusSoftware.Avira
      break
    case AntiVirusSoftware.BitDefender:
    case 360033488151:
      zendeskAVData.id = 360033488151
      zendeskAVData.name = AntiVirusSoftware.BitDefender
      break
    case AntiVirusSoftware.BullGuard:
    case 360041708232:
      zendeskAVData.id = 360041708232
      zendeskAVData.name = AntiVirusSoftware.BullGuard
      break
    case AntiVirusSoftware.Comodo:
    case 360041713452:
      zendeskAVData.id = 360041713452
      zendeskAVData.name = AntiVirusSoftware.Comodo
      break
    case AntiVirusSoftware.EScan:
    case 360041720452:
      zendeskAVData.id = 360041720452
      zendeskAVData.name = AntiVirusSoftware.EScan
      break
    case AntiVirusSoftware.ESETNOD32:
    case 360041721632:
      zendeskAVData.id = 360041721632
      zendeskAVData.name = AntiVirusSoftware.ESETNOD32
      break
    case AntiVirusSoftware.FProt:
    case 360042153731:
      zendeskAVData.id = 360042153731
      zendeskAVData.name = AntiVirusSoftware.FProt
      break
    case AntiVirusSoftware.FSecure:
    case 360042154431:
      zendeskAVData.id = 360042154431
      zendeskAVData.name = AntiVirusSoftware.FSecure
      break
    case AntiVirusSoftware.GData:
    case 360042154771:
      zendeskAVData.id = 360042154771
      zendeskAVData.name = AntiVirusSoftware.GData
      break
    case AntiVirusSoftware.K7:
    case 360041736392:
      zendeskAVData.id = 360041736392
      zendeskAVData.name = AntiVirusSoftware.K7
      break
    case AntiVirusSoftware.Kaspersky:
    case 360042167171:
      zendeskAVData.id = 360042167171
      zendeskAVData.name = AntiVirusSoftware.Kaspersky
      break
    case AntiVirusSoftware.Malwarebytes:
    case 360031870772:
      zendeskAVData.id = 360031870772
      zendeskAVData.name = AntiVirusSoftware.Malwarebytes
      break
    case AntiVirusSoftware.McAfeeSecurity:
    case 360033488271:
      zendeskAVData.id = 360033488271
      zendeskAVData.name = AntiVirusSoftware.McAfeeSecurity
      break
    case AntiVirusSoftware.Norton:
    case 360032211151:
      zendeskAVData.id = 360032211151
      zendeskAVData.name = AntiVirusSoftware.Norton
      break
    case AntiVirusSoftware.Panda:
    case 360033488451:
      zendeskAVData.id = 360033488451
      zendeskAVData.name = AntiVirusSoftware.Panda
      break
    case AntiVirusSoftware.PCMatic:
    case 360042169891:
      zendeskAVData.id = 360042169891
      zendeskAVData.name = AntiVirusSoftware.PCMatic
      break
    case AntiVirusSoftware.Qihoo360:
    case 360042222471:
      zendeskAVData.id = 360042222471
      zendeskAVData.name = AntiVirusSoftware.Qihoo360
      break
    case AntiVirusSoftware.SecureAgeAPEX:
    case 360041801812:
      zendeskAVData.id = 360041801812
      zendeskAVData.name = AntiVirusSoftware.SecureAgeAPEX
      break
    case AntiVirusSoftware.Sophos:
    case 360041802092:
      zendeskAVData.id = 360041802092
      zendeskAVData.name = AntiVirusSoftware.Sophos
      break
    case AntiVirusSoftware.TotalAV:
    case 360041802372:
      zendeskAVData.id = 360041802372
      zendeskAVData.name = AntiVirusSoftware.TotalAV
      break
    case AntiVirusSoftware.TrendMicro:
    case 360042223291:
      zendeskAVData.id = 360042223291
      zendeskAVData.name = AntiVirusSoftware.TrendMicro
      break
    case AntiVirusSoftware.Twister:
    case 360042223891:
      zendeskAVData.id = 360042223891
      zendeskAVData.name = AntiVirusSoftware.Twister
      break
    case AntiVirusSoftware.VIPRE:
    case 360041803732:
      zendeskAVData.id = 360041803732
      zendeskAVData.name = AntiVirusSoftware.VIPRE
      break
    case AntiVirusSoftware.Webroot:
    case 360041804212:
      zendeskAVData.id = 360041804212
      zendeskAVData.name = AntiVirusSoftware.Webroot
      break
    case AntiVirusSoftware.WindowsDefender:
    case 360033124692:
      zendeskAVData.id = 360033124692
      zendeskAVData.name = AntiVirusSoftware.WindowsDefender
      break
    case AntiVirusSoftware.Zillya:
    case 360042225091:
      zendeskAVData.id = 360042225091
      zendeskAVData.name = AntiVirusSoftware.Zillya
      break
  }

  return zendeskAVData
}

export const getAntiVirusSoftware = (processes: SystemProcessesData) => {
  let detectedAntiVirus: AntiVirusSoftware | undefined

  dance: for (const process of processes.list) {
    switch (process.name.toLowerCase()) {
      case 'aswidsagent.exe':
      case 'avastscv.exe':
      case 'avastui.exe':
      case 'overseer.exe':
      case 'wsc_proxy.exe':
        detectedAntiVirus = AntiVirusSoftware.Avast
        break dance
      case 'avgtoolssvc.exe':
      case 'avgui.exe':
      case 'avgsvc.exe':
        detectedAntiVirus = AntiVirusSoftware.AVG
        break dance
      case 'avshadow.exe':
      case 'shed.exe':
      case 'avguard.exe':
      case 'avira.systray.exe':
      case 'avira.optimizerhost.exe':
      case 'protectedservice.exe':
      case 'avira.spotlight.service.exe':
      case 'avira.servicehost.exe':
      case 'avgnt.exe':
      case 'avira.softwareupdater.servicehost.exe':
        detectedAntiVirus = AntiVirusSoftware.Avira
        break dance
      case 'bdservicehost.exe':
      case 'bdagent.exe':
      case 'seccenter.exe':
      case 'bdntwrk.exe':
      case 'bdredline.exe':
      case 'bdwtxag.exe':
        detectedAntiVirus = AntiVirusSoftware.BitDefender
        break dance
      case 'avp.exe':
      case 'avpui.exe':
        detectedAntiVirus = AntiVirusSoftware.Kaspersky
        break dance
      case 'mbamservice.exe':
      case 'mbamtray.exe':
        detectedAntiVirus = AntiVirusSoftware.Malwarebytes
        break dance
      case 'mcshield.exe':
      case 'mcapexe.exe':
      case 'mcuicnt.exe':
      case 'mcinstrutrack.exe':
      case 'mcpvtray.exe':
      case 'mfeavsvc.exe':
      case 'mfemms.exe':
      case 'mfevtps.exe':
      case 'mmsshost.exe':
      case 'modulecoreservice.exe':
      case 'pefservice.exe':
      case 'protectedmodulehost.exe':
      case 'mccspservicehost.exe':
        detectedAntiVirus = AntiVirusSoftware.McAfeeSecurity
        break dance
      case 'nortonsecurity.exe':
      case 'nswscsvc.exe':
      case 'navapsvc.exe':
        detectedAntiVirus = AntiVirusSoftware.Norton
        break dance
      case 'zavaux.exe':
      case 'zavcore.exe':
      case 'zillya.exe':
      case 'zavhips.exe':
      case 'zavnet.exe':
      case 'zavupdater.exe':
      case 'zav.exe':
        detectedAntiVirus = AntiVirusSoftware.Zillya
        break dance
      // Since Windows Defender is always an AV for Windows, we want to make
      // sure this case is evaluated last before all other options.
      case 'msmpeng.exe':
        detectedAntiVirus = AntiVirusSoftware.WindowsDefender
        break dance
    }
  }
  return detectedAntiVirus
}
