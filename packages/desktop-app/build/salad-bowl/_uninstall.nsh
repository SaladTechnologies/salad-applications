SimpleSC::ExistsService "SaladBowl"
Pop $0
${If} $0 == 0
  uninstall_retry:
    SimpleSC::RemoveService "SaladBowl"
    Pop $0
    ${If} $0 <> 0
      MessageBox MB_RETRYCANCEL|MB_ICONEXCLAMATION "Failed to uninstall the Salad Bowl service." /SD IDCANCEL IDRETRY uninstall_retry IDCANCEL uninstall_cancel
    ${EndIf}
    Goto uninstall_continue

  uninstall_cancel:
    DetailPrint "Failed to uninstall the Salad Bowl service. Aborting."
    Abort

  uninstall_continue:
${EndIf}

RMDir /r "$LocalAppData\Salad"
