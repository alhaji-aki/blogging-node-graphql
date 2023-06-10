import authDirective from './auth.directive';

export const directiveTransformers = [
  authDirective('auth').authDirectiveTransformer,
];

export const directives = [authDirective('auth').authDirectiveTypeDefs];
