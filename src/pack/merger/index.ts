import { existsSync, readFileSync, writeFileSync } from 'fs'
import { ensureDirSync } from 'fs-extra'
import minimatch from 'minimatch'
import { dirname, join } from 'path'
import { Acceptor } from '../resolver/IResolver'

export interface Merger<T> {
   merge(a: T, b: T): T
   decode(encoded: string | Buffer): T
   encode(encoded: T): string | Buffer
}

export class JsonMerger<T> implements Merger<T> {
   constructor(readonly merge: (a: T, b: T) => T) {}

   decode(encoded: string | Buffer): T {
      return JSON.parse(encoded.toString()) as T
   }

   encode(encoded: T): string | Buffer {
      return JSON.stringify(encoded, null, 2)
   }
}

export class Mergers {
   constructor(private readonly mergers: Record<string, Merger<unknown>>) {}

   private handle<T>(merger: Merger<T>, a: Buffer | string, b: Buffer | string) {
      const merged = merger.merge(merger.decode(a), merger.decode(b))
      return merger.encode(merged)
   }

   createAcceptor(tempDir: string): Acceptor {
      return (path, content) => {
         if (!path.startsWith('assets')) return

         const out = join(tempDir, path)
         ensureDirSync(dirname(out))

         if (existsSync(out)) {
            const merger = Object.entries(this.mergers).find(([pattern]) => minimatch(path, pattern))?.[1]
            if (merger != null) {
               const existing = readFileSync(out)
               const merged = this.handle(merger, existing, content)
               console.warn(`   Merged '${path}'`)
               writeFileSync(out, merged)
            } else {
               console.warn(`   File would be overwritten: '${path}'`)
            }
         } else {
            writeFileSync(out, content)
         }
      }
   }
}
