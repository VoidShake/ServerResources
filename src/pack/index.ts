import { existsSync, readFileSync, writeFileSync } from 'fs'
import { emptyDirSync, ensureDirSync } from 'fs-extra'
import lodash from 'lodash'
import { dirname, extname, join, resolve } from 'path'
import { zip } from 'zip-a-folder'
import { exists, fileHash, listChildren } from '../util.js'
import { getConfig } from './config.js'
import ArchiveResolver from './resolver/ArchiveResolver.js'
import FolderResolver from './resolver/FolderResolver.js'
import { Acceptor } from './resolver/IResolver.js'

async function run() {
   const resourcesDir = resolve('resources')
   if (!existsSync(resourcesDir)) throw new Error('no resources directory found')

   const config = getConfig(resourcesDir)
   const packs = listChildren(resourcesDir).map(it => ({ ...it, config: config.packs[it.name] }))

   function resolverOf({ path, name, info, config }: typeof packs[0]) {
      const realPath = config?.path ? join(path, config.path) : path
      if (info.isFile() && ['.zip', '.jar'].includes(extname(name))) return new ArchiveResolver(realPath)
      if (info.isDirectory() && existsSync(join(realPath, 'assets'))) return new FolderResolver(realPath)
      return null
   }

   const resolvers = lodash
      .orderBy(packs, it => it.config?.priority ?? 0)
      .map(file => {
         const resolver = resolverOf(file)
         return resolver && { ...file, resolver }
      })
      .filter(exists)

   console.log(`Found ${resolvers.length} resource packs`)

   const tempDir = resolve('tmp')
   emptyDirSync(tempDir)

   const acceptor: Acceptor = (path, content) => {
      if (!path.startsWith('assets')) return

      const out = join(tempDir, path)
      ensureDirSync(dirname(out))

      if (existsSync(out)) {
         console.warn(`File is overwritten: '${path}'`)
      }

      writeFileSync(out, content)
   }

   console.group('Extracting resources...')
   await Promise.all(
      resolvers.map(async ({ resolver, name }) => {
         console.log(name)
         await resolver.extract(acceptor)
      })
   )
   console.groupEnd()

   const packData = {
      pack: {
         description: `Server Resources - generated ${new Date().toLocaleDateString()}`,
         pack_format: 8,
      },
   }
   writeFileSync(join(tempDir, 'pack.mcmeta'), JSON.stringify(packData, null, 2))

   console.log('Creating ZIP File...')
   await zip(tempDir, 'server-resources.zip')

   const hash = fileHash(readFileSync('server-resources.zip'), 'sha1')
   console.log(`SHA256: ${hash}`)
}

run()
