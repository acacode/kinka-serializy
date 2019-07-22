import { KinkaInstance, MiddlewareFunction } from 'kinka'
import { ModelWrapper } from 'serializy/src/model_wrapper'

declare interface SerializyConfiguration {
    errorModel?: ModelWrapper<any>
}

declare type KinkaSerializy =
    MiddlewareFunction |
    ((configuration: SerializyConfiguration) => MiddlewareFunction)

export default KinkaSerializy
