SimpleSC::ExistsService "SaladBowl"
Pop $0
${If} $0 == 0
  uninstall_retry:
    SimpleSC::RemoveService "SaladBowl"
    Pop $0
    ${If} $0 <> 0
      MessageBox MB_RETRYCANCEL|MB_ICONEXCLAMATION "Failed to uninstall the Salad Bowl service. The Salad Bowl service must be uninstalled in order to upgrade the Salad app." /SD IDCANCEL IDRETRY uninstall_retry IDCANCEL uninstall_cancel
    ${EndIf}
    Goto uninstall_continue

  uninstall_cancel:
    DetailPrint "Failed to uninstall the Salad Bowl service. Aborting."
    Abort

  uninstall_continue:
${EndIf}

RMDir /r "$LocalAppData\Salad\workload-definitions\gpuz"
RMDir /r "$LocalAppData\Salad\workload-definitions\systeminformation"
SetOutPath "$INSTDIR\SaladBowl"
File /r "${__FILEDIR__}\dist\service\*.*"
SetOutPath "$LocalAppData\Salad\workload-definitions"
File /r "${__FILEDIR__}\dist\workload-definitions\*.*"
SetOutPath "$LocalAppData\Salad\workloads"
File /r "${__FILEDIR__}\dist\workloads\*.*"
SetOutPath $INSTDIR

install_service_retry:
  SimpleSC::InstallService "SaladBowl" "Salad Bowl" "16" "2" "$INSTDIR\SaladBowl\Salad.Bowl.Service.exe" "" "" ""
  Pop $0
  ${If} $0 <> 0
    MessageBox MB_RETRYCANCEL|MB_ICONEXCLAMATION "Failed to install the Salad Bowl service." /SD IDCANCEL IDRETRY install_service_retry IDCANCEL install_cancel
  ${EndIf}
  install_service_description_retry:
    SimpleSC::SetServiceDescription "SaladBowl" "The easiest and most trusted way to manage workloads on your machine."
    Pop $0
    ${If} $0 <> 0
      MessageBox MB_RETRYCANCEL|MB_ICONEXCLAMATION "Failed to install the Salad Bowl service." /SD IDCANCEL IDRETRY install_service_description_retry IDCANCEL install_cancel
    ${EndIf}
    install_service_failure_retry:
      SimpleSC::SetServiceFailure "SaladBowl" "0" "" "" "1" "10000" "1" "30000" "1" "90000"
      Pop $0
      ${If} $0 <> 0
        MessageBox MB_RETRYCANCEL|MB_ICONEXCLAMATION "Failed to install the Salad Bowl service." /SD IDCANCEL IDRETRY install_service_failure_retry IDCANCEL install_cancel
      ${EndIf}
      install_service_failure_flag_retry:
        SimpleSC::SetServiceFailureFlag "SaladBowl" "1"
        Pop $0
        ${If} $0 <> 0
          MessageBox MB_RETRYCANCEL|MB_ICONEXCLAMATION "Failed to install the Salad Bowl service." /SD IDCANCEL IDRETRY install_service_failure_flag_retry IDCANCEL install_cancel
        ${EndIf}
        install_service_delayed_auto_start_retry:
          SimpleSC::SetServiceDelayedAutoStartInfo "SaladBowl" "1"
          Pop $0
          ${If} $0 <> 0
            MessageBox MB_RETRYCANCEL|MB_ICONEXCLAMATION "Failed to install the Salad Bowl service." /SD IDCANCEL IDRETRY install_service_delayed_auto_start_retry IDCANCEL install_cancel
          ${EndIf}
          Goto install_continue

install_cancel:
  DetailPrint "Failed to install the Salad Bowl service. Aborting."
  Abort

install_continue:
  SimpleSC::StartService "SaladBowl" "" 30
  Pop $0
  ${If} $0 <> 0
    SetRebootFlag true
  ${EndIf}
