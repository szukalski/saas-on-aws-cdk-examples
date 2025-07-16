// smithy-typescript generated code
import {
  ServiceException as __BaseException,
  CompositeCollectionValidator as __CompositeCollectionValidator,
  CompositeStructureValidator as __CompositeStructureValidator,
  CompositeValidator as __CompositeValidator,
  EnumValidator as __EnumValidator,
  MultiConstraintValidator as __MultiConstraintValidator,
  NoOpValidator as __NoOpValidator,
  RequiredValidator as __RequiredValidator,
  ValidationFailure as __ValidationFailure,
} from "@aws-smithy/server-common";
import { ExceptionOptionType as __ExceptionOptionType } from "@smithy/smithy-client";

/**
 * @public
 */
export class ForbiddenError extends __BaseException {
  readonly name: "ForbiddenError" = "ForbiddenError";
  readonly $fault: "client" = "client";
  constructor(opts: __ExceptionOptionType<ForbiddenError, __BaseException>) {
    super({
      name: "ForbiddenError",
      $fault: "client",
      ...opts
    });
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}

/**
 * An error indicating a resource could not be found
 * @public
 */
export class ResourceNotFoundError extends __BaseException {
  readonly name: "ResourceNotFoundError" = "ResourceNotFoundError";
  readonly $fault: "client" = "client";
  constructor(opts: __ExceptionOptionType<ResourceNotFoundError, __BaseException>) {
    super({
      name: "ResourceNotFoundError",
      $fault: "client",
      ...opts
    });
    Object.setPrototypeOf(this, ResourceNotFoundError.prototype);
  }
}

/**
 * @public
 */
export class UnauthorizedError extends __BaseException {
  readonly name: "UnauthorizedError" = "UnauthorizedError";
  readonly $fault: "client" = "client";
  constructor(opts: __ExceptionOptionType<UnauthorizedError, __BaseException>) {
    super({
      name: "UnauthorizedError",
      $fault: "client",
      ...opts
    });
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

/**
 * @public
 */
export class InternalServerError extends __BaseException {
  readonly name: "InternalServerError" = "InternalServerError";
  readonly $fault: "server" = "server";
  constructor(opts: __ExceptionOptionType<InternalServerError, __BaseException>) {
    super({
      name: "InternalServerError",
      $fault: "server",
      ...opts
    });
    Object.setPrototypeOf(this, InternalServerError.prototype);
  }
}

/**
 * Describes one specific validation failure for an input member.
 * @public
 */
export interface ValidationExceptionField {
  /**
   * A JSONPointer expression to the structure member whose value failed to satisfy the modeled constraints.
   * @public
   */
  path: string | undefined;

  /**
   * A detailed description of the validation failure.
   * @public
   */
  message: string | undefined;
}

export namespace ValidationExceptionField {
  const memberValidators : {
    path?: __MultiConstraintValidator<string>,
    message?: __MultiConstraintValidator<string>,
  } = {};
  /**
   * @internal
   */
  export const validate = (obj: ValidationExceptionField, path: string = ""): __ValidationFailure[] => {
    function getMemberValidator<T extends keyof typeof memberValidators>(member: T): NonNullable<typeof memberValidators[T]> {
      if (memberValidators[member] === undefined) {
        switch (member) {
          case "path": {
            memberValidators["path"] = new __CompositeValidator<string>([
              new __RequiredValidator(),
            ]);
            break;
          }
          case "message": {
            memberValidators["message"] = new __CompositeValidator<string>([
              new __RequiredValidator(),
            ]);
            break;
          }
        }
      }
      return memberValidators[member]!!;
    }
    return [
      ...getMemberValidator("path").validate(obj.path, `${path}/path`),
      ...getMemberValidator("message").validate(obj.message, `${path}/message`),
    ];
  }
}

/**
 * A standard error for input validation failures.
 * This should be thrown by services when a member of the input structure
 * falls outside of the modeled or documented constraints.
 * @public
 */
export class ValidationException extends __BaseException {
  readonly name: "ValidationException" = "ValidationException";
  readonly $fault: "client" = "client";
  /**
   * A list of specific failures encountered while validating the input.
   * A member can appear in this list more than once if it failed to satisfy multiple constraints.
   * @public
   */
  fieldList?: (ValidationExceptionField)[] | undefined;

  constructor(opts: __ExceptionOptionType<ValidationException, __BaseException>) {
    super({
      name: "ValidationException",
      $fault: "client",
      ...opts
    });
    Object.setPrototypeOf(this, ValidationException.prototype);
    this.fieldList = opts.fieldList;
  }
}

/**
 * @public
 * @enum
 */
export const UserRole = {
  ADMIN: "admin",
  USER: "user",
} as const
/**
 * @public
 */
export type UserRole = typeof UserRole[keyof typeof UserRole]

/**
 * @public
 */
export interface CreateUserInput {
  username?: string | undefined;
  role?: UserRole | undefined;
  password?: string | undefined;
}

export namespace CreateUserInput {
  const memberValidators : {
    username?: __MultiConstraintValidator<string>,
    role?: __MultiConstraintValidator<string>,
    password?: __MultiConstraintValidator<string>,
  } = {};
  /**
   * @internal
   */
  export const validate = (obj: CreateUserInput, path: string = ""): __ValidationFailure[] => {
    function getMemberValidator<T extends keyof typeof memberValidators>(member: T): NonNullable<typeof memberValidators[T]> {
      if (memberValidators[member] === undefined) {
        switch (member) {
          case "username": {
            memberValidators["username"] = new __NoOpValidator();
            break;
          }
          case "role": {
            memberValidators["role"] = new __CompositeValidator<string>([
              new __EnumValidator([
                "admin",
                "user",
                ], [
                "admin",
                "user",
              ]),
            ]);
            break;
          }
          case "password": {
            memberValidators["password"] = new __NoOpValidator();
            break;
          }
        }
      }
      return memberValidators[member]!!;
    }
    return [
      ...getMemberValidator("username").validate(obj.username, `${path}/username`),
      ...getMemberValidator("role").validate(obj.role, `${path}/role`),
      ...getMemberValidator("password").validate(obj.password, `${path}/password`),
    ];
  }
}

/**
 * @public
 */
export interface CreateUserOutput {
  username: string | undefined;
  role: UserRole | undefined;
}

export namespace CreateUserOutput {
  const memberValidators : {
    username?: __MultiConstraintValidator<string>,
    role?: __MultiConstraintValidator<string>,
  } = {};
  /**
   * @internal
   */
  export const validate = (obj: CreateUserOutput, path: string = ""): __ValidationFailure[] => {
    function getMemberValidator<T extends keyof typeof memberValidators>(member: T): NonNullable<typeof memberValidators[T]> {
      if (memberValidators[member] === undefined) {
        switch (member) {
          case "username": {
            memberValidators["username"] = new __CompositeValidator<string>([
              new __RequiredValidator(),
            ]);
            break;
          }
          case "role": {
            memberValidators["role"] = new __CompositeValidator<string>([
              new __EnumValidator([
                "admin",
                "user",
                ], [
                "admin",
                "user",
              ]),
              new __RequiredValidator(),
            ]);
            break;
          }
        }
      }
      return memberValidators[member]!!;
    }
    return [
      ...getMemberValidator("username").validate(obj.username, `${path}/username`),
      ...getMemberValidator("role").validate(obj.role, `${path}/role`),
    ];
  }
}

/**
 * @public
 */
export interface DeleteUserInput {
  username: string | undefined;
}

export namespace DeleteUserInput {
  const memberValidators : {
    username?: __MultiConstraintValidator<string>,
  } = {};
  /**
   * @internal
   */
  export const validate = (obj: DeleteUserInput, path: string = ""): __ValidationFailure[] => {
    function getMemberValidator<T extends keyof typeof memberValidators>(member: T): NonNullable<typeof memberValidators[T]> {
      if (memberValidators[member] === undefined) {
        switch (member) {
          case "username": {
            memberValidators["username"] = new __CompositeValidator<string>([
              new __RequiredValidator(),
            ]);
            break;
          }
        }
      }
      return memberValidators[member]!!;
    }
    return [
      ...getMemberValidator("username").validate(obj.username, `${path}/username`),
    ];
  }
}

/**
 * @public
 */
export interface DeleteUserOutput {
}

export namespace DeleteUserOutput {
  const memberValidators : {
  } = {};
  /**
   * @internal
   */
  export const validate = (obj: DeleteUserOutput, path: string = ""): __ValidationFailure[] => {
    function getMemberValidator<T extends keyof typeof memberValidators>(member: T): NonNullable<typeof memberValidators[T]> {
      if (memberValidators[member] === undefined) {
        switch (member) {
        }
      }
      return memberValidators[member]!!;
    }
    return [
    ];
  }
}

/**
 * @public
 */
export interface ListUserInput {
  nextToken?: string | undefined;
  maxResults?: number | undefined;
  role?: UserRole | undefined;
}

export namespace ListUserInput {
  const memberValidators : {
    nextToken?: __MultiConstraintValidator<string>,
    maxResults?: __MultiConstraintValidator<number>,
    role?: __MultiConstraintValidator<string>,
  } = {};
  /**
   * @internal
   */
  export const validate = (obj: ListUserInput, path: string = ""): __ValidationFailure[] => {
    function getMemberValidator<T extends keyof typeof memberValidators>(member: T): NonNullable<typeof memberValidators[T]> {
      if (memberValidators[member] === undefined) {
        switch (member) {
          case "nextToken": {
            memberValidators["nextToken"] = new __NoOpValidator();
            break;
          }
          case "maxResults": {
            memberValidators["maxResults"] = new __NoOpValidator();
            break;
          }
          case "role": {
            memberValidators["role"] = new __CompositeValidator<string>([
              new __EnumValidator([
                "admin",
                "user",
                ], [
                "admin",
                "user",
              ]),
            ]);
            break;
          }
        }
      }
      return memberValidators[member]!!;
    }
    return [
      ...getMemberValidator("nextToken").validate(obj.nextToken, `${path}/nextToken`),
      ...getMemberValidator("maxResults").validate(obj.maxResults, `${path}/maxResults`),
      ...getMemberValidator("role").validate(obj.role, `${path}/role`),
    ];
  }
}

/**
 * @public
 */
export interface UserSchema {
  username: string | undefined;
  role: UserRole | undefined;
  tenant_id?: string | undefined;
}

export namespace UserSchema {
  const memberValidators : {
    username?: __MultiConstraintValidator<string>,
    role?: __MultiConstraintValidator<string>,
    tenant_id?: __MultiConstraintValidator<string>,
  } = {};
  /**
   * @internal
   */
  export const validate = (obj: UserSchema, path: string = ""): __ValidationFailure[] => {
    function getMemberValidator<T extends keyof typeof memberValidators>(member: T): NonNullable<typeof memberValidators[T]> {
      if (memberValidators[member] === undefined) {
        switch (member) {
          case "username": {
            memberValidators["username"] = new __CompositeValidator<string>([
              new __RequiredValidator(),
            ]);
            break;
          }
          case "role": {
            memberValidators["role"] = new __CompositeValidator<string>([
              new __EnumValidator([
                "admin",
                "user",
                ], [
                "admin",
                "user",
              ]),
              new __RequiredValidator(),
            ]);
            break;
          }
          case "tenant_id": {
            memberValidators["tenant_id"] = new __NoOpValidator();
            break;
          }
        }
      }
      return memberValidators[member]!!;
    }
    return [
      ...getMemberValidator("username").validate(obj.username, `${path}/username`),
      ...getMemberValidator("role").validate(obj.role, `${path}/role`),
      ...getMemberValidator("tenant_id").validate(obj.tenant_id, `${path}/tenant_id`),
    ];
  }
}

/**
 * @public
 */
export interface ListUserOutput {
  items?: (UserSchema)[] | undefined;
  nextToken?: string | undefined;
}

export namespace ListUserOutput {
  const memberValidators : {
    items?: __MultiConstraintValidator<Iterable<UserSchema>>,
    nextToken?: __MultiConstraintValidator<string>,
  } = {};
  /**
   * @internal
   */
  export const validate = (obj: ListUserOutput, path: string = ""): __ValidationFailure[] => {
    function getMemberValidator<T extends keyof typeof memberValidators>(member: T): NonNullable<typeof memberValidators[T]> {
      if (memberValidators[member] === undefined) {
        switch (member) {
          case "items": {
            memberValidators["items"] = new __CompositeCollectionValidator<UserSchema>(
              new __NoOpValidator(),
              new __CompositeStructureValidator<UserSchema>(
                new __NoOpValidator(),
                UserSchema.validate
              )
            );
            break;
          }
          case "nextToken": {
            memberValidators["nextToken"] = new __NoOpValidator();
            break;
          }
        }
      }
      return memberValidators[member]!!;
    }
    return [
      ...getMemberValidator("items").validate(obj.items, `${path}/items`),
      ...getMemberValidator("nextToken").validate(obj.nextToken, `${path}/nextToken`),
    ];
  }
}

/**
 * @public
 */
export interface ReadUserInput {
  username: string | undefined;
}

export namespace ReadUserInput {
  const memberValidators : {
    username?: __MultiConstraintValidator<string>,
  } = {};
  /**
   * @internal
   */
  export const validate = (obj: ReadUserInput, path: string = ""): __ValidationFailure[] => {
    function getMemberValidator<T extends keyof typeof memberValidators>(member: T): NonNullable<typeof memberValidators[T]> {
      if (memberValidators[member] === undefined) {
        switch (member) {
          case "username": {
            memberValidators["username"] = new __CompositeValidator<string>([
              new __RequiredValidator(),
            ]);
            break;
          }
        }
      }
      return memberValidators[member]!!;
    }
    return [
      ...getMemberValidator("username").validate(obj.username, `${path}/username`),
    ];
  }
}

/**
 * @public
 */
export interface ReadUserOutput {
  username: string | undefined;
  role: UserRole | undefined;
  tenant_id?: string | undefined;
}

export namespace ReadUserOutput {
  const memberValidators : {
    username?: __MultiConstraintValidator<string>,
    role?: __MultiConstraintValidator<string>,
    tenant_id?: __MultiConstraintValidator<string>,
  } = {};
  /**
   * @internal
   */
  export const validate = (obj: ReadUserOutput, path: string = ""): __ValidationFailure[] => {
    function getMemberValidator<T extends keyof typeof memberValidators>(member: T): NonNullable<typeof memberValidators[T]> {
      if (memberValidators[member] === undefined) {
        switch (member) {
          case "username": {
            memberValidators["username"] = new __CompositeValidator<string>([
              new __RequiredValidator(),
            ]);
            break;
          }
          case "role": {
            memberValidators["role"] = new __CompositeValidator<string>([
              new __EnumValidator([
                "admin",
                "user",
                ], [
                "admin",
                "user",
              ]),
              new __RequiredValidator(),
            ]);
            break;
          }
          case "tenant_id": {
            memberValidators["tenant_id"] = new __NoOpValidator();
            break;
          }
        }
      }
      return memberValidators[member]!!;
    }
    return [
      ...getMemberValidator("username").validate(obj.username, `${path}/username`),
      ...getMemberValidator("role").validate(obj.role, `${path}/role`),
      ...getMemberValidator("tenant_id").validate(obj.tenant_id, `${path}/tenant_id`),
    ];
  }
}

/**
 * @public
 */
export interface UpdateUserInput {
  username: string | undefined;
  role?: UserRole | undefined;
}

export namespace UpdateUserInput {
  const memberValidators : {
    username?: __MultiConstraintValidator<string>,
    role?: __MultiConstraintValidator<string>,
  } = {};
  /**
   * @internal
   */
  export const validate = (obj: UpdateUserInput, path: string = ""): __ValidationFailure[] => {
    function getMemberValidator<T extends keyof typeof memberValidators>(member: T): NonNullable<typeof memberValidators[T]> {
      if (memberValidators[member] === undefined) {
        switch (member) {
          case "username": {
            memberValidators["username"] = new __CompositeValidator<string>([
              new __RequiredValidator(),
            ]);
            break;
          }
          case "role": {
            memberValidators["role"] = new __CompositeValidator<string>([
              new __EnumValidator([
                "admin",
                "user",
                ], [
                "admin",
                "user",
              ]),
            ]);
            break;
          }
        }
      }
      return memberValidators[member]!!;
    }
    return [
      ...getMemberValidator("username").validate(obj.username, `${path}/username`),
      ...getMemberValidator("role").validate(obj.role, `${path}/role`),
    ];
  }
}

/**
 * @public
 */
export interface UpdateUserOutput {
  username: string | undefined;
  role: UserRole | undefined;
}

export namespace UpdateUserOutput {
  const memberValidators : {
    username?: __MultiConstraintValidator<string>,
    role?: __MultiConstraintValidator<string>,
  } = {};
  /**
   * @internal
   */
  export const validate = (obj: UpdateUserOutput, path: string = ""): __ValidationFailure[] => {
    function getMemberValidator<T extends keyof typeof memberValidators>(member: T): NonNullable<typeof memberValidators[T]> {
      if (memberValidators[member] === undefined) {
        switch (member) {
          case "username": {
            memberValidators["username"] = new __CompositeValidator<string>([
              new __RequiredValidator(),
            ]);
            break;
          }
          case "role": {
            memberValidators["role"] = new __CompositeValidator<string>([
              new __EnumValidator([
                "admin",
                "user",
                ], [
                "admin",
                "user",
              ]),
              new __RequiredValidator(),
            ]);
            break;
          }
        }
      }
      return memberValidators[member]!!;
    }
    return [
      ...getMemberValidator("username").validate(obj.username, `${path}/username`),
      ...getMemberValidator("role").validate(obj.role, `${path}/role`),
    ];
  }
}
