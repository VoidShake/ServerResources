import { existsSync } from 'fs'
import ArchiveResolver from './pack/resolver/ArchiveResolver'

async function compare(reference: string, generated: string) {
   if (!existsSync(reference)) throw new Error('Reference archive missing')

   const referenceMap = new Map<string, string>()

   await new ArchiveResolver(reference).extract((path, content) => {
      referenceMap.set(path, content.toString())
   })

   await new ArchiveResolver(generated).extract((path, content) => {
      if (referenceMap.has(path)) {
         const referenceContent = referenceMap.get(path)
         if (content.toString() !== referenceContent) {
            console.log(`~ '${path}'`)
         }
         referenceMap.delete(path)
      } else {
         console.log(`+ '${path}'`)
      }
   })

   for (const missing of referenceMap.keys()) {
      console.log(`- '${missing}'`)
   }
}

compare('reference.zip', 'server-resources.zip')
