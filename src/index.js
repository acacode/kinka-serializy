/**
 * Copyright (c) acacode, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict'

/**
 * @name KinkaSerializy - kinka middleware
 *
 * @description This middleware provides ability to serialize server side structures via serializy
 *
 * @param {object} data - serializy configuration
 * @param {object} data.errorModel - error model class referrence which created via model() function. It will serialize server side error message
 */
function KinkaSerializy(data) {
  if (!data) {
    data = {}
  }

  let errorModel = null

  const serializyMiddleware = instance => {
    const requestInspector = instance.inspectors.request
    const responseInspector = instance.inspectors.response

    instance.inspectors.request = (url, method, options) => {
      if (requestInspector) {
        const newOptions = requestInspector(url, method, options)

        if (newOptions) {
          options = newOptions
        }
      }

      if (options.model && options.data && typeof options.data === 'object') {
        if (!options.model.deserialize) {
          throw new Error(
            `Property "model" for request ${method.toUpperCase()}:${url} is not valid`
          )
        }
        options.data =
          options.data instanceof Array
            ? options.data.map(options.model.deserialize)
            : options.model.deserialize(options.data)
      }

      return options
    }

    instance.inspectors.response = (url, method, response, options) => {
      if (responseInspector) {
        const newResponse = responseInspector(url, method, response, options)

        if (newResponse) {
          response = newResponse
        }
      }

      if (options.model) {
        if (!options.model.serialize) {
          throw new Error(
            `Property "model" for request ${method.toUpperCase()}:${url} is not valid`
          )
        }

        if (response.isError) {
          if (errorModel) response.data = errorModel.serialize(response.data)
        } else {
          response.data =
            response.data instanceof Array
              ? response.data.map(options.model.serialize)
              : options.model.serialize(options.data)
        }
      }

      return response
    }
  }

  if (data.baseURL && data.create) {
    return serializyMiddleware(data)
  }

  errorModel = data.errorModel

  return serializyMiddleware
}

export default KinkaSerializy
