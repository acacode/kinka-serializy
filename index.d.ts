import { KinkaInstance, MiddlewareFunction } from 'kinka'
import { ModelWrapper } from 'serializy/src/model_wrapper'

export declare interface SerializyConfiguration {
    errorModel?: ModelWrapper<any>
}

export declare type KinkaSerializy =
    MiddlewareFunction |
    ((configuration: SerializyConfiguration) => MiddlewareFunction)

export default KinkaSerializy
