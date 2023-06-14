import { MapperKind, getDirective, mapSchema } from '@graphql-tools/utils';
import { GraphQLError, GraphQLSchema, defaultFieldResolver } from 'graphql';

function throwException(message: string, code: string, status: number) {
  throw new GraphQLError(message, {
    extensions: {
      code,
      http: { status },
    },
  });
}

export default (directiveName: string) => {
  return {
    authDirectiveTypeDefs: `directive @${directiveName}(isAdmin: Boolean = false, allowSuspendedUser: Boolean = false) on OBJECT | FIELD_DEFINITION`,
    authDirectiveTransformer: (schema: GraphQLSchema) =>
      mapSchema(schema, {
        [MapperKind.OBJECT_FIELD](fieldConfig) {
          const authDirective = getDirective(
            schema,
            fieldConfig,
            directiveName,
          )?.[0];
          if (authDirective) {
            const { isAdmin, allowSuspendedUser } = authDirective;

            const originalResolver =
              fieldConfig.resolve || defaultFieldResolver;

            fieldConfig.resolve = (source, args, context, info) => {
              const user = context.authenticatedUser;
              if (!user) {
                throwException('Unauthenticated...', 'UNAUTHENTICATED', 401);
              }

              if (isAdmin && !user.is_admin) {
                throwException(
                  "You don't have the required permissions to perform this action or access this data.",
                  'UNAUTHORISED',
                  403,
                );
              }

              if (!allowSuspendedUser && user.suspended()) {
                throwException(
                  'Your account has been suspended.',
                  'UNAUTHORISED',
                  403,
                );
              }
              return originalResolver(source, args, context, info);
            };

            return fieldConfig;
          }
        },
      }),
  };
};
