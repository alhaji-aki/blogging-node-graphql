import authDirective from './auth.directive';
import adminDirective from './admin.directive';
import suspendedDirective from './suspended.directive';

export const directiveTransformers = [
  authDirective('auth').authDirectiveTransformer,
  adminDirective('admin').adminDirectiveTransformer,
  suspendedDirective('suspended').suspendedDirectiveTransformer,
];

export const directives = [
  authDirective('auth').authDirectiveTypeDefs,
  adminDirective('admin').adminDirectiveTypeDefs,
  suspendedDirective('suspended').suspendedDirectiveTypeDefs,
];
