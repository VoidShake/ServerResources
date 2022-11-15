import { createResolvers } from '@pssbletrngle/pack-resolver'
import { createDefaultMergers } from '@pssbletrngle/resource-merger'

async function zipDatapacks() {
   const resolvers = createResolvers({
      from: 'datapacks',
   })

   const merger = createDefaultMergers({ output: 'server-data.zip', includeData: true })

   await merger.run(resolvers)
}

zipDatapacks()
