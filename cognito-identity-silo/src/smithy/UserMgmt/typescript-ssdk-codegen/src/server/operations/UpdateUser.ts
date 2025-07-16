// smithy-typescript generated code
import {
  ForbiddenError,
  InternalServerError,
  ResourceNotFoundError,
  UnauthorizedError,
  UpdateUserInput,
  UpdateUserOutput,
  ValidationException,
} from "../../models/models_0";
import {
  deserializeUpdateUserRequest,
  serializeForbiddenErrorError,
  serializeFrameworkException,
  serializeInternalServerErrorError,
  serializeResourceNotFoundErrorError,
  serializeUnauthorizedErrorError,
  serializeUpdateUserResponse,
  serializeValidationExceptionError,
} from "../../protocols/Aws_restJson1";
import { UserMgmtService } from "../UserMgmtService";
import {
  ServerSerdeContext,
  ServiceException as __BaseException,
  InternalFailureException as __InternalFailureException,
  Mux as __Mux,
  Operation as __Operation,
  OperationInput as __OperationInput,
  OperationOutput as __OperationOutput,
  OperationSerializer as __OperationSerializer,
  SerializationException as __SerializationException,
  ServerSerdeContext as __ServerSerdeContext,
  ServiceException as __ServiceException,
  ServiceHandler as __ServiceHandler,
  SmithyFrameworkException as __SmithyFrameworkException,
  ValidationCustomizer as __ValidationCustomizer,
  ValidationFailure as __ValidationFailure,
  generateValidationMessage as __generateValidationMessage,
  generateValidationSummary as __generateValidationSummary,
  isFrameworkException as __isFrameworkException,
  httpbinding,
} from "@aws-smithy/server-common";
import {
  NodeHttpHandler,
  streamCollector,
} from "@smithy/node-http-handler";
import {
  HttpRequest as __HttpRequest,
  HttpResponse as __HttpResponse,
} from "@smithy/protocol-http";
import {
  fromBase64,
  toBase64,
} from "@smithy/util-base64";
import {
  fromUtf8,
  toUtf8,
} from "@smithy/util-utf8";

export type UpdateUser<Context> = __Operation<UpdateUserServerInput, UpdateUserServerOutput, Context>

export interface UpdateUserServerInput extends UpdateUserInput {}
export namespace UpdateUserServerInput {
  /**
   * @internal
   */
  export const validate: (obj: Parameters<typeof UpdateUserInput.validate>[0]) => __ValidationFailure[] = UpdateUserInput.validate;
}
export interface UpdateUserServerOutput extends UpdateUserOutput {}

export type UpdateUserErrors = ResourceNotFoundError | UnauthorizedError | ForbiddenError | ValidationException | InternalServerError

export class UpdateUserSerializer implements __OperationSerializer<UserMgmtService<any>, "UpdateUser", UpdateUserErrors> {
  serialize = serializeUpdateUserResponse;
  deserialize = deserializeUpdateUserRequest;

  isOperationError(error: any): error is UpdateUserErrors {
    const names: UpdateUserErrors['name'][] = ["ResourceNotFoundError", "UnauthorizedError", "ForbiddenError", "ValidationException", "InternalServerError"];
    return names.includes(error.name);
  };

  serializeError(error: UpdateUserErrors, ctx: ServerSerdeContext): Promise<__HttpResponse> {
    switch (error.name) {
      case "ResourceNotFoundError": {
        return serializeResourceNotFoundErrorError(error, ctx);
      }
      case "UnauthorizedError": {
        return serializeUnauthorizedErrorError(error, ctx);
      }
      case "ForbiddenError": {
        return serializeForbiddenErrorError(error, ctx);
      }
      case "ValidationException": {
        return serializeValidationExceptionError(error, ctx);
      }
      case "InternalServerError": {
        return serializeInternalServerErrorError(error, ctx);
      }
      default: {
        throw error;
      }
    }
  }

}

export const getUpdateUserHandler = <Context>(operation: __Operation<UpdateUserServerInput, UpdateUserServerOutput, Context>): __ServiceHandler<Context, __HttpRequest, __HttpResponse> => {
  const mux = new httpbinding.HttpBindingMux<"UserMgmt", "UpdateUser">([
    new httpbinding.UriSpec<"UserMgmt", "UpdateUser">(
      'PUT',
      [
        { type: 'path_literal', value: "user" },
        { type: 'path' },
      ],
      [
      ],
      { service: "UserMgmt", operation: "UpdateUser" }),
  ]);
  const customizer: __ValidationCustomizer<"UpdateUser"> = (ctx, failures) => {
    if (!failures) {
      return undefined;
    }
    return {
      name: "ValidationException",
      $fault: "client",
      message: __generateValidationSummary(failures),
      fieldList: failures.map(failure => ({
        path: failure.path,
        message: __generateValidationMessage(failure)
      }))
    };
  };
  return new UpdateUserHandler(operation, mux, new UpdateUserSerializer(), serializeFrameworkException, customizer);
}

const serdeContextBase = {
  base64Encoder: toBase64,
  base64Decoder: fromBase64,
  utf8Encoder: toUtf8,
  utf8Decoder: fromUtf8,
  streamCollector: streamCollector,
  requestHandler: new NodeHttpHandler(),
  disableHostPrefix: true
};
async function handle<S, O extends keyof S & string, Context>(
  request: __HttpRequest,
  context: Context,
  operationName: O,
  serializer: __OperationSerializer<S, O, __ServiceException>,
  operation: __Operation<__OperationInput<S[O]>, __OperationOutput<S[O]>, Context>,
  serializeFrameworkException: (e: __SmithyFrameworkException, ctx: __ServerSerdeContext) => Promise<__HttpResponse>,
  validationFn: (input: __OperationInput<S[O]>) => __ValidationFailure[],
  validationCustomizer: __ValidationCustomizer<O>
): Promise<__HttpResponse> {
  let input;
  try {
    input = await serializer.deserialize(request, {
      endpoint: () => Promise.resolve(request), ...serdeContextBase
    });
  } catch (error: unknown) {
    if (__isFrameworkException(error)) {
      return serializeFrameworkException(error, serdeContextBase);
    };
    return serializeFrameworkException(new __SerializationException(), serdeContextBase);
  }
  try {
    let validationFailures = validationFn(input);
    if (validationFailures && validationFailures.length > 0) {
      let validationException = validationCustomizer({ operation: operationName }, validationFailures);
      if (validationException) {
        return serializer.serializeError(validationException, serdeContextBase);
      }
    }
    let output = await operation(input, context);
    return serializer.serialize(output, serdeContextBase);
  } catch(error: unknown) {
    if (serializer.isOperationError(error)) {
      return serializer.serializeError(error, serdeContextBase);
    }
    console.log('Received an unexpected error', error);
    return serializeFrameworkException(new __InternalFailureException(), serdeContextBase);
  }
}
export class UpdateUserHandler<Context> implements __ServiceHandler<Context> {
  private readonly operation: __Operation<UpdateUserServerInput, UpdateUserServerOutput, Context>;
  private readonly mux: __Mux<"UserMgmt", "UpdateUser">;
  private readonly serializer: __OperationSerializer<UserMgmtService<Context>, "UpdateUser", UpdateUserErrors>;
  private readonly serializeFrameworkException: (e: __SmithyFrameworkException, ctx: __ServerSerdeContext) => Promise<__HttpResponse>;
  private readonly validationCustomizer: __ValidationCustomizer<"UpdateUser">;
  /**
   * Construct a UpdateUser handler.
   * @param operation The {@link __Operation} implementation that supplies the business logic for UpdateUser
   * @param mux The {@link __Mux} that verifies which service and operation are being invoked by a given {@link __HttpRequest}
   * @param serializer An {@link __OperationSerializer} for UpdateUser that
   *                   handles deserialization of requests and serialization of responses
   * @param serializeFrameworkException A function that can serialize {@link __SmithyFrameworkException}s
   * @param validationCustomizer A {@link __ValidationCustomizer} for turning validation failures into {@link __SmithyFrameworkException}s
   */
  constructor(
    operation: __Operation<UpdateUserServerInput, UpdateUserServerOutput, Context>,
    mux: __Mux<"UserMgmt", "UpdateUser">,
    serializer: __OperationSerializer<UserMgmtService<Context>, "UpdateUser", UpdateUserErrors>,
    serializeFrameworkException: (e: __SmithyFrameworkException, ctx: __ServerSerdeContext) => Promise<__HttpResponse>,
    validationCustomizer: __ValidationCustomizer<"UpdateUser">
  ) {
    this.operation = operation;
    this.mux = mux;
    this.serializer = serializer;
    this.serializeFrameworkException = serializeFrameworkException;
    this.validationCustomizer = validationCustomizer;
  }
  async handle(request: __HttpRequest, context: Context): Promise<__HttpResponse> {
    const target = this.mux.match(request);
    if (target === undefined) {
      console.log('Received a request that did not match com.saasonaws#UserMgmt.UpdateUser. This indicates a misconfiguration.');
      return this.serializeFrameworkException(new __InternalFailureException(), serdeContextBase);
    }
    return handle(request, context, "UpdateUser", this.serializer, this.operation, this.serializeFrameworkException, UpdateUserServerInput.validate, this.validationCustomizer);
  }
}
