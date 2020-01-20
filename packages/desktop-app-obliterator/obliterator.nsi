;--------------------------------
;Include Modern UI

  !include "MUI2.nsh"

;--------------------------------
;General

  BrandingText " "
  Name "Salad Obliterator"
  OutFile "Salad Obliterator.exe"
  RequestExecutionLevel admin
  Unicode True

;--------------------------------
;Interface Settings

  VIAddVersionKey "ProductName" "Salad Obliterator"
  VIAddVersionKey "CompanyName" "Salad Technologies, Inc."
  VIAddVersionKey "LegalCopyright" "Copyright © 2020 Salad Technologies, Inc."
  VIAddVersionKey "FileDescription" "Uninstalls broken Salad installations"
  VIAddVersionKey "FileVersion" "1.0.0.0"
  VIAddVersionKey "ProductVersion" "1.0.0"
  VIFileVersion 1.0.0.0
  VIProductVersion 1.0.0.0

;--------------------------------
;Interface Settings

  !define MUI_ABORTWARNING
  !define MUI_HEADERIMAGE_BITMAP "${NSISDIR}\Contrib\Graphics\Header\orange-uninstall-r.bmp"
  !define MUI_ICON "${__FILEDIR__}\..\desktop-app\assets\favicon.ico"
  !define MUI_WELCOMEFINISHPAGE_BITMAP "${NSISDIR}\Contrib\Graphics\Wizard\orange-uninstall.bmp"

;--------------------------------
;Pages

  !define MUI_WELCOMEPAGE_TITLE "Welcome to the Salad Obliterator"
  !define MUI_WELCOMEPAGE_TEXT "YOU SHOULD ONLY USE THIS TOOL IF INSTRUCTED BY SALAD SUPPORT. This wizard will guide you through a forced uninstall of Salad.$\r$\n$\r$\nYOU MUST CLOSE SALAD BEFORE BEGINNING. It is recommend that you check the Task Manager to ensure Salad is closed before continuing.$\r$\n$\r$\nClick Next to continue."
  !insertmacro MUI_PAGE_WELCOME

  !define MUI_PAGE_HEADER_SUBTEXT "Please review the license terms before using the Salad Obliterator"
  !define MUI_LICENSEPAGE_TEXT_BOTTOM "If you accept the terms of the agreement, click I Agree to continue. You must accept the agreement to use the Salad Obliterator."

  !insertmacro MUI_PAGE_LICENSE "D:\Documents\Projects\salad-applications\packages\desktop-app\LICENSE.md"

  !insertmacro MUI_PAGE_INSTFILES

  !define MUI_FINISHPAGE_TITLE "Salad Obliterator Complete"
  !define MUI_FINISHPAGE_TEXT "The Salad Obliterator has done its best, and Salad should now be uninstalled. It is strongly recommended that you restart your computer before installing Salad again.$\r$\n$\r$\nClick Finish to close."
  !insertmacro MUI_PAGE_FINISH

;--------------------------------
;Languages

  !insertmacro MUI_LANGUAGE "English"

;--------------------------------
;Functions

Function GetParent

  Exch $R0
  Push $R1
  Push $R2
  Push $R3

  StrCpy $R1 0
  StrLen $R2 $R0

  loop:
    IntOp $R1 $R1 + 1
    IntCmp $R1 $R2 get 0 get
    StrCpy $R3 $R0 1 -$R1
    StrCmp $R3 "\" get
  Goto loop

  get:
    StrCpy $R0 $R0 -$R1

    Pop $R3
    Pop $R2
    Pop $R1
    Exch $R0

FunctionEnd

;--------------------------------
;Installer Sections

Section Obliterate

  ; Check for per-user installation path
  ClearErrors
  ReadRegStr $0 HKCU "Software\7a0ebc42-7f71-5caa-9738-b7dda7589c77" "InstallLocation"
  IfErrors +2
    RMDir /r /REBOOTOK "$0"

  ; Check for per-user startup entry, use as installation path hint
  ClearErrors
  ReadRegStr $0 HKCU "Software\Microsoft\Windows\CurrentVersion\Run" "Salad"
  IfErrors +5
    Push $0
    Call GetParent
    Pop $0
    RMDir /r /REBOOTOK "$0"

  ; Check for per-machine installation path
  ClearErrors
  ReadRegStr $0 HKLM "SOFTWARE\7a0ebc42-7f71-5caa-9738-b7dda7589c77" "InstallLocation"
  IfErrors +2
    RMDir /r /REBOOTOK "$0"

  ; Check for per-machine startup entry, use as installation path hint
  ClearErrors
  ReadRegStr $0 HKLM "SOFTWARE\Microsoft\Windows\CurrentVersion\Run" "Salad"
  IfErrors +5
    Push $0
    Call GetParent
    Pop $0
    RMDir /r /REBOOTOK "$0"

  ; Common paths
  RMDir /r /REBOOTOK "$APPDATA\Salad"
  RMDir /r /REBOOTOK "$LOCALAPPDATA\salad-updater"
  RMDir /r /REBOOTOK "$LOCALAPPDATA\Programs\Salad"
  RMDir /r /REBOOTOK "$PROGRAMFILES32\Salad"
  RMDir /r /REBOOTOK "$PROGRAMFILES64\Salad"

  Delete "$DESKTOP\Salad.lnk"
  Delete "$SMPROGRAMS\Salad.lnk"
  SetShellVarContext all
  Delete "$DESKTOP\Salad.lnk"
  Delete "$SMPROGRAMS\Salad.lnk"
  SetShellVarContext current

  ; Common registry entries
  DeleteRegKey HKCU "Software\7a0ebc42-7f71-5caa-9738-b7dda7589c77"
  DeleteRegKey HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\7a0ebc42-7f71-5caa-9738-b7dda7589c77"
  DeleteRegValue HKCU "Software\Microsoft\Windows\CurrentVersion\Run" "Salad"
  DeleteRegKey HKLM "SOFTWARE\7a0ebc42-7f71-5caa-9738-b7dda7589c77"
  DeleteRegKey HKLM "SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\7a0ebc42-7f71-5caa-9738-b7dda7589c77"
  DeleteRegValue HKLM "SOFTWARE\Microsoft\Windows\CurrentVersion\Run" "Salad"

SectionEnd
