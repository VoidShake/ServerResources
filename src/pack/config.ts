import { existsSync, readFileSync } from 'fs'
import { join } from 'path'

export type Config = {
   packs: Record<string, PackConfig | undefined>
}

export interface PackConfig {
   path?: string
   priority?: number
}

export function getConfig(dir: string): Config {
   const path = join(dir, 'config.json')
   if (!existsSync(path)) return { packs: {} }
   const raw = readFileSync(path).toString()
   return JSON.parse(raw)
}