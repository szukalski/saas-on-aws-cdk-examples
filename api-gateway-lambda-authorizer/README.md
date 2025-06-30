# API Gateway + Lambda Authorizer

Uses Smithy to generate the service server code.

API GW -> Lambda Proxy -> Service handler

The Lambda function looks for the following claims in the JWT:

* 'custom:tenantId'
* 'custom:role'
