import lodash from 'lodash'
import { JsonMerger } from './index.js'

export interface ModelDefinition {
   parent: string
   textures: Record<string, string>
   display: Record<string, unknown>
   overrides: Array<{
      model: string
      predicate: Record<string, number>
   }>
}

const ModelMerger = new JsonMerger<ModelDefinition>((a, b) => {
   const overrides = lodash.orderBy(
      [...a.overrides, ...b.overrides],
      ({ predicate }) => predicate.custom_model_data ?? 0
   )
   return { ...a, ...b, overrides }
})

export default ModelMerger
