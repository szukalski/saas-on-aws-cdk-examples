import {
  AdminCreateUserCommand, AdminCreateUserCommandInput,
  AdminSetUserPasswordCommand, AdminSetUserPasswordCommandInput,
  AdminDeleteUserCommand, AdminDeleteUserCommandInput,
  AdminGetUserCommand, AdminGetUserCommandInput,
  AdminUpdateUserAttributesCommand, AdminUpdateUserAttributesCommandInput,
  ListUsersCommand, ListUsersCommandInput,
  CognitoIdentityProviderClient,
  UserNotFoundException,
} from '@aws-sdk/client-cognito-identity-provider';
import { AwsCredentialIdentity } from 'saas-on-aws-cdk';
import {
  CreateUser, CreateUserInput, CreateUserOutput,
  DeleteUser, DeleteUserInput, DeleteUserOutput,
  ListUser, ListUserInput, ListUserOutput,
  ReadUser, ReadUserInput, ReadUserOutput,
  UpdateUser, UpdateUserInput, UpdateUserOutput,
  InternalServerError, ResourceNotFoundError, UserMgmtService, UserSchema,
} from '../smithy/UserMgmt/typescript-ssdk-codegen/src';

export interface UserMgmtContext extends AwsCredentialIdentity {
  tenant_id: string;
  userPoolId: string;
}

export class UserMgmtServiceImpl implements UserMgmtService<UserMgmtContext> {
  CreateUser = async (
    input: CreateUserInput,
    context: UserMgmtContext,
  ): Promise<CreateUserOutput> => {
    const client = new CognitoIdentityProviderClient({ credentials: context });
    const createInput: AdminCreateUserCommandInput = {
      UserPoolId: context.userPoolId,
      Username: input.username,
      MessageAction: 'SUPPRESS',
      UserAttributes: [
        { Name: 'email', Value: input.username },
        { Name: 'custom:tenant_id', Value: context.tenant_id },
        { Name: 'custom:role', Value: input.role },
      ],
    };
    const createUserCommand = new AdminCreateUserCommand(createInput);
    const passwordInput: AdminSetUserPasswordCommandInput = {
      UserPoolId: context.userPoolId,
      Username: input.username,
      Password: input.password,
      Permanent: true,
    };
    const setUserPasswordCommand = new AdminSetUserPasswordCommand(passwordInput);
    try {
      await client.send(createUserCommand);
      await client.send(setUserPasswordCommand);
      return {
        username: input.username,
        role: input.role,
      };
    } catch (error) {
      console.error('Error during create user:', error);
      throw new InternalServerError({
        message: 'Error: ' + error,
      });
    }
  };

  DeleteUser = async (
    input: DeleteUserInput,
    context: UserMgmtContext,
  ): Promise<DeleteUserOutput> => {
    const client = new CognitoIdentityProviderClient({ credentials: context });
    const deleteInput: AdminDeleteUserCommandInput = {
      UserPoolId: context.userPoolId,
      Username: input.username,
    };
    const deleteUserCommand = new AdminDeleteUserCommand(deleteInput);

    try {
      await client.send(deleteUserCommand);
      return {};
    } catch (error) {
      console.error('Error during delete user:', error);
      if (error instanceof UserNotFoundException) {
        throw new ResourceNotFoundError({
          message: `User ${input.username} not found`,
        });
      }
      throw new InternalServerError({
        message: 'Error: ' + error,
      });
    }
  };

  ReadUser = async (
    input: ReadUserInput,
    context: UserMgmtContext,
  ): Promise<ReadUserOutput> => {
    const client = new CognitoIdentityProviderClient({ credentials: context });
    const getUserInput: AdminGetUserCommandInput = {
      UserPoolId: context.userPoolId,
      Username: input.username,
    };
    const getUserCommand = new AdminGetUserCommand(getUserInput);

    try {
      const response = await client.send(getUserCommand);

      // Extract custom attributes
      const tenantIdAttr = response.UserAttributes?.find(attr => attr.Name === 'custom:tenant_id');
      const roleAttr = response.UserAttributes?.find(attr => attr.Name === 'custom:role');

      // Ensure user belongs to the same tenant
      if (tenantIdAttr?.Value !== context.tenant_id) {
        throw new ResourceNotFoundError({
          message: `User ${input.username} not found in tenant ${context.tenant_id}`,
        });
      }

      return {
        username: response.Username,
        role: roleAttr?.Value as any,
        tenant_id: tenantIdAttr?.Value,
      };
    } catch (error) {
      console.error('Error during read user:', error);
      if (error instanceof UserNotFoundException) {
        throw new ResourceNotFoundError({
          message: `User ${input.username} not found`,
        });
      }
      if (error instanceof ResourceNotFoundError) {
        throw error;
      }
      throw new InternalServerError({
        message: 'Error: ' + error,
      });
    }
  };

  UpdateUser = async (
    input: UpdateUserInput,
    context: UserMgmtContext,
  ): Promise<UpdateUserOutput> => {
    const client = new CognitoIdentityProviderClient({ credentials: context });

    // First, verify the user exists and belongs to this tenant
    try {
      await this.ReadUser({ username: input.username }, context);
    } catch (error) {
      throw error; // Re-throw the error from ReadUser
    }

    // Update user attributes if role is provided
    if (input.role) {
      const updateInput: AdminUpdateUserAttributesCommandInput = {
        UserPoolId: context.userPoolId,
        Username: input.username,
        UserAttributes: [
          { Name: 'custom:role', Value: input.role },
        ],
      };
      const updateUserCommand = new AdminUpdateUserAttributesCommand(updateInput);

      try {
        await client.send(updateUserCommand);
      } catch (error) {
        console.error('Error during update user:', error);
        throw new InternalServerError({
          message: 'Error: ' + error,
        });
      }
    }

    return {
      username: input.username,
      role: input.role,
    };
  };

  ListUser = async (
    input: ListUserInput,
    context: UserMgmtContext,
  ): Promise<ListUserOutput> => {
    const client = new CognitoIdentityProviderClient({ credentials: context });
    const listInput: ListUsersCommandInput = {
      UserPoolId: context.userPoolId,
      Limit: input.maxResults || 50,
      PaginationToken: input.nextToken,
      Filter: `custom:tenant_id = "${context.tenant_id}"${input.role ? ` AND custom:role = "${input.role}"` : ''}`,
    };
    const listUsersCommand = new ListUsersCommand(listInput);

    try {
      const response = await client.send(listUsersCommand);

      const users: UserSchema[] = response.Users?.map(user => {
        const tenantIdAttr = user.Attributes?.find(attr => attr.Name === 'custom:tenant_id');
        const roleAttr = user.Attributes?.find(attr => attr.Name === 'custom:role');

        return {
          username: user.Username!,
          role: roleAttr?.Value as any,
          tenant_id: tenantIdAttr?.Value,
        };
      }) || [];

      return {
        items: users,
        nextToken: response.PaginationToken,
      };
    } catch (error) {
      console.error('Error during list users:', error);
      throw new InternalServerError({
        message: 'Error: ' + error,
      });
    }
  };
}