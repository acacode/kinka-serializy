/**
 * Copyright (c) acacode, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
'use strict'

import {
  deserializeRequestData,
  serializeResponseData,
} from 'http-helpers-serializy'

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

      const { data } = deserializeRequestData(options.model, options.data, {
        method,
        url,
      })

      options.data = data

      return options
    }

    instance.inspectors.response = (url, method, response, options) => {
      if (responseInspector) {
        const newResponse = responseInspector(url, method, response, options)

        if (newResponse) {
          response = newResponse
        }
      }

      const { data, error } = serializeResponseData(
        options.model,
        response.data,
        {
          method,
          url,
          isError: response.isError,
          errorModel,
          error: response.err,
        }
      )

      response.data = data
      response.err = error

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
