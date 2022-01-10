SimpleSC::ExistsService "SaladBowl"
Pop $0
${If} $0 == 0
  stop_retry:
    SimpleSC::ServiceIsStopped "SaladBowl"
    Pop $0
    Pop $1
    ${If} $0 == 0
      ${If} $1 == 0
        SimpleSC::StopService "SaladBowl" 1 60
        Pop $0
        ${If} $0 <> 0
          MessageBox MB_RETRYCANCEL|MB_ICONEXCLAMATION "Failed to stop the Salad Bowl service. The Salad Bowl service must be stopped in order to upgrade the Salad app." /SD IDCANCEL IDRETRY stop_retry IDCANCEL stop_cancel
        ${EndIf}
      ${EndIf}
    ${Else}
      MessageBox MB_RETRYCANCEL|MB_ICONEXCLAMATION "Failed to stop the Salad Bowl service. The Salad Bowl service must be stopped in order to upgrade the Salad app." /SD IDCANCEL IDRETRY stop_retry IDCANCEL stop_cancel
    ${EndIf}
    Goto stop_continue

  stop_cancel:
    DetailPrint "Failed to stop the Salad Bowl service. Aborting."
    Abort

  stop_continue:
${EndIf}
