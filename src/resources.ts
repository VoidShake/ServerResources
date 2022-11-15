import { createResolvers } from '@pssbletrngle/pack-resolver'
import { createDefaultMergers } from '@pssbletrngle/resource-merger'

async function zipResources() {
   const resolvers = createResolvers({
      from: 'resources',
   })

   const merger = createDefaultMergers({ output: 'server-resources.zip', includeAssets: true })

   await merger.run(resolvers)
}

zipResources()
