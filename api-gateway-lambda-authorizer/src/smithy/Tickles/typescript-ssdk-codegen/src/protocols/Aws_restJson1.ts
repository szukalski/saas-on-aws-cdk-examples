// smithy-typescript generated code
import {
  InternalServerError,
  ValidationException,
  ValidationExceptionField,
} from "../models/models_0";
import {
  HelloServerInput,
  HelloServerOutput,
} from "../server/operations/Hello";
import {
  loadRestJsonErrorCode,
  parseJsonBody as parseBody,
  parseJsonErrorBody as parseErrorBody,
} from "@aws-sdk/core";
import {
  ServerSerdeContext,
  ServiceException as __BaseException,
  NotAcceptableException as __NotAcceptableException,
  SmithyFrameworkException as __SmithyFrameworkException,
  UnsupportedMediaTypeException as __UnsupportedMediaTypeException,
  acceptMatches as __acceptMatches,
} from "@aws-smithy/server-common";
import {
  HttpRequest as __HttpRequest,
  HttpResponse as __HttpResponse,
} from "@smithy/protocol-http";
import {
  _json,
  collectBody,
  isSerializableHeaderValue,
  map,
  take,
} from "@smithy/smithy-client";
import {
  Endpoint as __Endpoint,
  ResponseMetadata as __ResponseMetadata,
  SerdeContext as __SerdeContext,
} from "@smithy/types";
import { calculateBodyLength } from "@smithy/util-body-length-node";

export const deserializeHelloRequest = async(
  output: __HttpRequest,
  context: __SerdeContext
): Promise<HelloServerInput> => {
  const contentTypeHeaderKey: string | undefined = Object.keys(output.headers).find(key => key.toLowerCase() === 'content-type');
  if (contentTypeHeaderKey != null) {
    const contentType = output.headers[contentTypeHeaderKey];
    if (contentType !== undefined && contentType !== "application/json") {
      throw new __UnsupportedMediaTypeException();
    };
  };
  const acceptHeaderKey: string | undefined = Object.keys(output.headers).find(key => key.toLowerCase() === 'accept');
  if (acceptHeaderKey != null) {
    const accept = output.headers[acceptHeaderKey];
    if (!__acceptMatches(accept, "application/json")) {
      throw new __NotAcceptableException();
    };
  };
  const contents: any = map({
  });
  await collectBody(output.body, context);
  return contents;
}

export const serializeHelloResponse = async(
  input: HelloServerOutput,
  ctx: ServerSerdeContext
): Promise<__HttpResponse> => {
  const context: __SerdeContext = {
    ...ctx,
    endpoint: () => Promise.resolve({
      protocol: '',
      hostname: '',
      path: '',
    }),
  }
  let statusCode: number = 200
  let headers: any = map({}, isSerializableHeaderValue, {
    'content-type': 'application/json',
  });
  let body: any;
  body = JSON.stringify(take(input, {
    'message': [],
  }));
  if (body && Object.keys(headers).map((str) => str.toLowerCase()).indexOf('content-length') === -1) {
    const length = calculateBodyLength(body);
    if (length !== undefined) {
      headers = { ...headers, 'content-length': String(length) };
    }
  }
  return new __HttpResponse({
    headers,
    body,
    statusCode,
  });
}

export const serializeFrameworkException = async(
  input: __SmithyFrameworkException,
  ctx: ServerSerdeContext
): Promise<__HttpResponse> => {
  const context: __SerdeContext = {
    ...ctx,
    endpoint: () => Promise.resolve({
      protocol: '',
      hostname: '',
      path: '',
    }),
  }
  switch (input.name) {
    case "InternalFailure": {
      const statusCode: number = 500
      let headers: any = map({}, isSerializableHeaderValue, {
        'x-amzn-errortype': "InternalFailure",
        'content-type': 'application/json',
      });
      let body: any;
      body = "{}";
      return new __HttpResponse({
        headers,
        body,
        statusCode,
      });
    }
    case "NotAcceptableException": {
      const statusCode: number = 406
      let headers: any = map({}, isSerializableHeaderValue, {
        'x-amzn-errortype': "NotAcceptableException",
        'content-type': 'application/json',
      });
      let body: any;
      body = "{}";
      return new __HttpResponse({
        headers,
        body,
        statusCode,
      });
    }
    case "SerializationException": {
      const statusCode: number = 400
      let headers: any = map({}, isSerializableHeaderValue, {
        'x-amzn-errortype': "SerializationException",
        'content-type': 'application/json',
      });
      let body: any;
      body = "{}";
      return new __HttpResponse({
        headers,
        body,
        statusCode,
      });
    }
    case "UnknownOperationException": {
      const statusCode: number = 404
      let headers: any = map({}, isSerializableHeaderValue, {
        'x-amzn-errortype': "UnknownOperationException",
        'content-type': 'application/json',
      });
      let body: any;
      body = "{}";
      return new __HttpResponse({
        headers,
        body,
        statusCode,
      });
    }
    case "UnsupportedMediaTypeException": {
      const statusCode: number = 415
      let headers: any = map({}, isSerializableHeaderValue, {
        'x-amzn-errortype': "UnsupportedMediaTypeException",
        'content-type': 'application/json',
      });
      let body: any;
      body = "{}";
      return new __HttpResponse({
        headers,
        body,
        statusCode,
      });
    }
  }
}

export const serializeInternalServerErrorError = async(
  input: InternalServerError,
  ctx: ServerSerdeContext
): Promise<__HttpResponse> => {
  const context: __SerdeContext = {
    ...ctx,
    endpoint: () => Promise.resolve({
      protocol: '',
      hostname: '',
      path: '',
    }),
  }
  const statusCode: number = 500
  let headers: any = map({}, isSerializableHeaderValue, {
    'x-amzn-errortype': "InternalServerError",
    'content-type': 'application/json',
  });
  let body: any;
  body = JSON.stringify(take(input, {
    'message': [],
  }));
  return new __HttpResponse({
    headers,
    body,
    statusCode,
  });
}

export const serializeValidationExceptionError = async(
  input: ValidationException,
  ctx: ServerSerdeContext
): Promise<__HttpResponse> => {
  const context: __SerdeContext = {
    ...ctx,
    endpoint: () => Promise.resolve({
      protocol: '',
      hostname: '',
      path: '',
    }),
  }
  const statusCode: number = 400
  let headers: any = map({}, isSerializableHeaderValue, {
    'x-amzn-errortype': "ValidationException",
    'content-type': 'application/json',
  });
  let body: any;
  body = JSON.stringify(take(input, {
    'fieldList': _ => se_ValidationExceptionFieldList(_, context),
    'message': [],
  }));
  return new __HttpResponse({
    headers,
    body,
    statusCode,
  });
}

/**
 * serializeAws_restJson1ValidationExceptionField
 */
const se_ValidationExceptionField = (
  input: ValidationExceptionField,
  context: __SerdeContext
): any => {
  return take(input, {
    'message': [],
    'path': [],
  });
}

/**
 * serializeAws_restJson1ValidationExceptionFieldList
 */
const se_ValidationExceptionFieldList = (
  input: (ValidationExceptionField)[],
  context: __SerdeContext
): any => {
  return input.filter((e: any) => e != null).map(entry => {
    return se_ValidationExceptionField(entry, context);
  });
}

const deserializeMetadata = (output: __HttpResponse): __ResponseMetadata => ({
  httpStatusCode: output.statusCode,
  requestId: output.headers["x-amzn-requestid"] ?? output.headers["x-amzn-request-id"] ?? output.headers["x-amz-request-id"],
  extendedRequestId: output.headers["x-amz-id-2"],
  cfId: output.headers["x-amz-cf-id"],
});

// Encode Uint8Array data into string with utf-8.
const collectBodyString = (streamBody: any, context: __SerdeContext): Promise<string> => collectBody(streamBody, context).then(body => context.utf8Encoder(body))
