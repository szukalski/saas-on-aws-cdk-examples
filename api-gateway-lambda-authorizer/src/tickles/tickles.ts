import { HelloInput, HelloOutput, TicklesService } from '../smithy/Tickles/typescript-ssdk-codegen/src';

export interface TicklesServiceContext {
  tenant_id: string;
  role: string;
}

export class TicklesServiceImpl implements TicklesService<TicklesServiceContext> {
  Hello = async (
    input: HelloInput,
    context: TicklesServiceContext,
  ): Promise<HelloOutput> => {
    return {
      message: 'Hello, '+context.role+' for '+context.tenant_id+'!',
    };
  };
}