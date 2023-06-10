import authDirective from './auth.directive';
import adminDirective from './admin.directive';

export const directiveTransformers = [
  authDirective('auth').authDirectiveTransformer,
  adminDirective('admin').adminDirectiveTransformer,
];

export const directives = [
  authDirective('auth').authDirectiveTypeDefs,
  adminDirective('admin').adminDirectiveTypeDefs,
];
