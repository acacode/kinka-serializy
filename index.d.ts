import { KinkaInstance } from 'kinka'
import { ModelWrapper } from 'serializy'

declare type KinkaSerializy = (instance: KinkaInstance) => (void | (errorModel: ModelWrapper) => any)

export default KinkaSerializy