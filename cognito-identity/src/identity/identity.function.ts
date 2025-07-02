import { convertEvent, convertVersion1Response } from '@aws-smithy/server-apigateway';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { IdentityServiceImpl, IdentityServiceContext } from './identity';
import { InternalServerError } from '../smithy/Identity/typescript-ssdk-codegen/src';
import { getIdentityServiceHandler } from '../smithy/Identity/typescript-ssdk-codegen/src/server';

const serviceHandler = getIdentityServiceHandler(new IdentityServiceImpl());

const getContext = async (event: APIGatewayProxyEvent): Promise<IdentityServiceContext> => {
  const userPoolClientId = process.env.USER_POOL_CLIENT_ID ?? '';
  if (!userPoolClientId) {
    throw new InternalServerError({
      message: 'USER_POOL_CLIENT_ID environment variable is required',
    });
  }

  const userPoolId = process.env.USER_POOL_ID ?? '';
  if (!userPoolId) {
    throw new InternalServerError({
      message: 'USER_POOL_ID environment variable is required',
    });
  }

  const context: IdentityServiceContext = {
    userPoolClientId: userPoolClientId,
    userPoolId: userPoolId,
  };
  return context;
};

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  // Not a good idea to output the event to console. It contains username and password..
  const context = await getContext(event);
  const convertedEvent = convertEvent(event);
  let rawResponse = await serviceHandler.handle(convertedEvent, context);
  const convertedResponse = convertVersion1Response(rawResponse);
  return convertedResponse;
};
