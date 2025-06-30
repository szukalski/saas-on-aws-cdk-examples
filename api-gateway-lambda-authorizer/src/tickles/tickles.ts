import { HelloInput, HelloOutput, TicklesService } from '../smithy/Tickles/typescript-ssdk-codegen/src';

export interface TicklesServiceContext {
  tenantId: string;
  role: string;
}

export class TicklesServiceImpl implements TicklesService<TicklesServiceContext> {
  Hello = async (
    input: HelloInput,
    context: TicklesServiceContext,
  ): Promise<HelloOutput> => {
    return {
      message: 'Hello, '+context.role+' for '+context.tenantId+'!',
    };
  };
}