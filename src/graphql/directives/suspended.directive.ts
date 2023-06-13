import { MapperKind, getDirective, mapSchema } from '@graphql-tools/utils';
import { GraphQLError, GraphQLSchema, defaultFieldResolver } from 'graphql';

export default (directiveName: string) => {
  return {
    suspendedDirectiveTypeDefs: `directive @${directiveName} on OBJECT | FIELD_DEFINITION`,
    suspendedDirectiveTransformer: (schema: GraphQLSchema) =>
      mapSchema(schema, {
        [MapperKind.OBJECT_FIELD](fieldConfig) {
          const suspendedDirective = getDirective(
            schema,
            fieldConfig,
            directiveName,
          )?.[0];
          if (suspendedDirective) {
            const originalResolver =
              fieldConfig.resolve || defaultFieldResolver;

            fieldConfig.resolve = (source, args, context, info) => {
              const user = context.authenticatedUser;
              if (user && user.suspended()) {
                throw new GraphQLError('Your account has been suspended', {
                  extensions: {
                    code: 'UNAUTHORISED',
                    http: { status: 403 },
                  },
                });
              }
              return originalResolver(source, args, context, info);
            };

            return fieldConfig;
          }
        },
      }),
  };
};
