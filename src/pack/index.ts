import { existsSync, readFileSync, writeFileSync } from 'fs'
import { emptyDirSync } from 'fs-extra'
import lodash from 'lodash'
import { extname, join, resolve } from 'path'
import { zip } from 'zip-a-folder'
import { exists, fileHash, listChildren } from '../util.js'
import { getConfig } from './config.js'
import { Mergers } from './merger/index.js'
import ModelMerger from './merger/ModelMerger.js'
import ArchiveResolver from './resolver/ArchiveResolver.js'
import FolderResolver from './resolver/FolderResolver.js'

async function run() {
   const resourcesDir = resolve('resources')
   if (!existsSync(resourcesDir)) throw new Error('no resources directory found')

   const config = getConfig(resourcesDir)
   const packs = listChildren(resourcesDir)
      .map(it => ({ ...it, config: config.packs[it.name] }))
      .filter(it => !it.config?.disabled)

   function resolversOf({ path, name, info, config }: typeof packs[0]) {
      const paths = config?.paths ?? ['.']
      return paths
         .map(relativePath => {
            const realPath = join(path, relativePath)
            if (info.isFile() && ['.zip', '.jar'].includes(extname(name))) return new ArchiveResolver(realPath)
            if (info.isDirectory() && existsSync(join(realPath, 'assets'))) return new FolderResolver(realPath)
            return null
         })
         .filter(exists)
   }

   const resolvers = lodash
      .orderBy(packs, it => it.config?.priority ?? 0)
      .flatMap(file => resolversOf(file).map(resolver => ({ ...file, resolver })))
      .filter(exists)

   console.log(`Found ${resolvers.length} resource packs`)

   const tempDir = resolve('tmp')
   emptyDirSync(tempDir)

   const mergers = new Mergers({
      'assets/*/models/**/*.json': ModelMerger,
   })

   const acceptor = mergers.createAcceptor(tempDir)

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
