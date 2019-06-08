//-- Blacklist
//-- name: Name of process without the .exe
//-- enabled: (default) true- mining will be stopped, false- mining will continue
export class Blacklist {
  name?: string | undefined
  process?: string | undefined
  enabled?: boolean
}
