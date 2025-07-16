// smithy-typescript generated code
import { serializeFrameworkException } from "../protocols/Aws_restJson1";
import {
  CreateUser,
  CreateUserSerializer,
  CreateUserServerInput,
} from "./operations/CreateUser";
import {
  DeleteUser,
  DeleteUserSerializer,
  DeleteUserServerInput,
} from "./operations/DeleteUser";
import {
  ListUser,
  ListUserSerializer,
  ListUserServerInput,
} from "./operations/ListUser";
import {
  ReadUser,
  ReadUserSerializer,
  ReadUserServerInput,
} from "./operations/ReadUser";
import {
  UpdateUser,
  UpdateUserSerializer,
  UpdateUserServerInput,
} from "./operations/UpdateUser";
import {
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
  UnknownOperationException as __UnknownOperationException,
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

export type UserMgmtServiceOperations = "CreateUser" | "DeleteUser" | "ListUser" | "ReadUser" | "UpdateUser";
export interface UserMgmtService<Context> {
  CreateUser: CreateUser<Context>
  DeleteUser: DeleteUser<Context>
  ListUser: ListUser<Context>
  ReadUser: ReadUser<Context>
  UpdateUser: UpdateUser<Context>
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
export class UserMgmtServiceHandler<Context> implements __ServiceHandler<Context> {
  private readonly service: UserMgmtService<Context>;
  private readonly mux: __Mux<"UserMgmt", UserMgmtServiceOperations>;
  private readonly serializerFactory: <T extends UserMgmtServiceOperations>(operation: T) => __OperationSerializer<UserMgmtService<Context>, T, __ServiceException>;
  private readonly serializeFrameworkException: (e: __SmithyFrameworkException, ctx: __ServerSerdeContext) => Promise<__HttpResponse>;
  private readonly validationCustomizer: __ValidationCustomizer<UserMgmtServiceOperations>;
  /**
   * Construct a UserMgmtService handler.
   * @param service The {@link UserMgmtService} implementation that supplies the business logic for UserMgmtService
   * @param mux The {@link __Mux} that determines which service and operation are being invoked by a given {@link __HttpRequest}
   * @param serializerFactory A factory for an {@link __OperationSerializer} for each operation in UserMgmtService that
   *                          handles deserialization of requests and serialization of responses
   * @param serializeFrameworkException A function that can serialize {@link __SmithyFrameworkException}s
   * @param validationCustomizer A {@link __ValidationCustomizer} for turning validation failures into {@link __SmithyFrameworkException}s
   */
  constructor(
    service: UserMgmtService<Context>,
    mux: __Mux<"UserMgmt", UserMgmtServiceOperations>,
    serializerFactory:<T extends UserMgmtServiceOperations>(op: T) => __OperationSerializer<UserMgmtService<Context>, T, __ServiceException>,
    serializeFrameworkException: (e: __SmithyFrameworkException, ctx: __ServerSerdeContext) => Promise<__HttpResponse>,
    validationCustomizer: __ValidationCustomizer<UserMgmtServiceOperations>
  ) {
    this.service = service;
    this.mux = mux;
    this.serializerFactory = serializerFactory;
    this.serializeFrameworkException = serializeFrameworkException;
    this.validationCustomizer = validationCustomizer;
  }
  async handle(request: __HttpRequest, context: Context): Promise<__HttpResponse> {
    const target = this.mux.match(request);
    if (target === undefined) {
      return this.serializeFrameworkException(new __UnknownOperationException(), serdeContextBase);
    }
    switch (target.operation) {
      case "CreateUser" : {
        return handle(request, context, "CreateUser", this.serializerFactory("CreateUser"), this.service.CreateUser, this.serializeFrameworkException, CreateUserServerInput.validate, this.validationCustomizer);
      }
      case "DeleteUser" : {
        return handle(request, context, "DeleteUser", this.serializerFactory("DeleteUser"), this.service.DeleteUser, this.serializeFrameworkException, DeleteUserServerInput.validate, this.validationCustomizer);
      }
      case "ListUser" : {
        return handle(request, context, "ListUser", this.serializerFactory("ListUser"), this.service.ListUser, this.serializeFrameworkException, ListUserServerInput.validate, this.validationCustomizer);
      }
      case "ReadUser" : {
        return handle(request, context, "ReadUser", this.serializerFactory("ReadUser"), this.service.ReadUser, this.serializeFrameworkException, ReadUserServerInput.validate, this.validationCustomizer);
      }
      case "UpdateUser" : {
        return handle(request, context, "UpdateUser", this.serializerFactory("UpdateUser"), this.service.UpdateUser, this.serializeFrameworkException, UpdateUserServerInput.validate, this.validationCustomizer);
      }
    }
  }
}

export const getUserMgmtServiceHandler = <Context>(service: UserMgmtService<Context>): __ServiceHandler<Context, __HttpRequest, __HttpResponse> => {
  const mux = new httpbinding.HttpBindingMux<"UserMgmt", keyof UserMgmtService<Context>>([
    new httpbinding.UriSpec<"UserMgmt", "CreateUser">(
      'POST',
      [
        { type: 'path_literal', value: "user" },
      ],
      [
      ],
      { service: "UserMgmt", operation: "CreateUser" }),
    new httpbinding.UriSpec<"UserMgmt", "DeleteUser">(
      'DELETE',
      [
        { type: 'path_literal', value: "user" },
        { type: 'path' },
      ],
      [
      ],
      { service: "UserMgmt", operation: "DeleteUser" }),
    new httpbinding.UriSpec<"UserMgmt", "ListUser">(
      'GET',
      [
        { type: 'path_literal', value: "user" },
      ],
      [
      ],
      { service: "UserMgmt", operation: "ListUser" }),
    new httpbinding.UriSpec<"UserMgmt", "ReadUser">(
      'GET',
      [
        { type: 'path_literal', value: "user" },
        { type: 'path' },
      ],
      [
      ],
      { service: "UserMgmt", operation: "ReadUser" }),
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
  const serFn: (op: UserMgmtServiceOperations) => __OperationSerializer<UserMgmtService<Context>, UserMgmtServiceOperations, __ServiceException> = (op) => {
    switch (op) {
      case "CreateUser": return new CreateUserSerializer();
      case "DeleteUser": return new DeleteUserSerializer();
      case "ListUser": return new ListUserSerializer();
      case "ReadUser": return new ReadUserSerializer();
      case "UpdateUser": return new UpdateUserSerializer();
    }
  };
  const customizer: __ValidationCustomizer<UserMgmtServiceOperations> = (ctx, failures) => {
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
  return new UserMgmtServiceHandler(service, mux, serFn, serializeFrameworkException, customizer);
}
