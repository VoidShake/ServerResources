import { readdirSync, statSync } from 'fs'
import { join } from 'path'

export function exists<T>(value?: T | null): value is T {
   return (value ?? null) !== null
}

export function listChildren(dir: string) {
   return readdirSync(dir).map(name => {
      const path = join(dir, name)
      const info = statSync(path)
      return { name, path, info }
   })
}
