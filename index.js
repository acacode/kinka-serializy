/**
 * Copyright (c) acacode, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

'use strict'

const KinkaSerializy = instance => {
  const requestInspector = instance.inspectors.request
  const responseInspector = instance.inspectors.response
  let errorModel = null

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
      options.data = options.model.deserialize(options.data)
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
        response.data = options.model.serialize(response.data)
      }
    }

    return response
  }

  return ErrorModel => (errorModel = ErrorModel)
}

export default KinkaSerializy