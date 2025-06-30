import { convertEvent, convertVersion1Response } from '@aws-smithy/server-apigateway';
import { APIGatewayAuthorizerResultContext, APIGatewayProxyResult, APIGatewayProxyWithLambdaAuthorizerEvent, APIGatewayProxyWithLambdaAuthorizerHandler } from 'aws-lambda';
import { TicklesServiceContext, TicklesServiceImpl } from './tickles';
import { getTicklesServiceHandler } from '../smithy/Tickles/typescript-ssdk-codegen/src';

const serviceHandler = getTicklesServiceHandler(new TicklesServiceImpl());

interface MultiTenantAuthContext extends APIGatewayAuthorizerResultContext, TicklesServiceContext {}

export const handler: APIGatewayProxyWithLambdaAuthorizerHandler<MultiTenantAuthContext> = async (
  event: APIGatewayProxyWithLambdaAuthorizerEvent<MultiTenantAuthContext>,
): Promise<APIGatewayProxyResult> => {
  console.log(`Received event: ${JSON.stringify(event)}`);

  const context: TicklesServiceContext = {
    tenantId: event.requestContext.authorizer.tenantId,
    role: event.requestContext.authorizer.role,
  };

  // Convert apigateway's lambda event to an HttpRequest
  const convertedEvent = convertEvent(event);

  // Call the service handler
  let rawResponse = await serviceHandler.handle(convertedEvent, context);

  // Convert the HttpResponse to apigateway's expected format
  const convertedResponse = convertVersion1Response(rawResponse);
  console.log(`Returning response: ${JSON.stringify(convertedResponse)}`);
  return convertedResponse;
};