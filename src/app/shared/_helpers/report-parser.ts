import { compile } from 'angular-expressions';
import { LogicalOperand } from '@app/models';

export const reportParser = (tag: string) => {
  return {
    get: (scope: any, context: any) => {
      if (tag === 'isLastItem') {
        return isLastItem(context);
      }

      if (tag === 'isLogicalOperand') {
        return scope instanceof LogicalOperand;
      }

      if (tag === '.') {
        return scope;
      }

      const parsedExpressionFn = compile(tag.replace(/(’|“|”)/g, '\''));

      return parsedExpressionFn(scope);
    },
  };
};

function isLastItem(context: any): boolean {
  const index = context.scopePathItem[context.scopePathItem.length - 1];

  const parent = context.scopeList[context.scopeList.length - 2];
  const iterablePath: string[] = context.scopePath[context.scopePath.length - 1].split('.');

  let iterable = parent;

  iterablePath.forEach((prop) => iterable = iterable[prop]);

  return index === iterable.length - 1;
}
