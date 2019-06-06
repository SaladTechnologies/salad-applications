//-- Blacklist
//-- name: Name of process without the .exe
//-- enabled: (default) true- mining will be stopped, false- mining will continue
export class Blacklist {
  name?: string | undefined
  enabled?: boolean
}
