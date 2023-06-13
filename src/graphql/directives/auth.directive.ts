import { MapperKind, getDirective, mapSchema } from '@graphql-tools/utils';
import { GraphQLError, GraphQLSchema, defaultFieldResolver } from 'graphql';

export default (directiveName: string) => {
  return {
    authDirectiveTypeDefs: `directive @${directiveName} on OBJECT | FIELD_DEFINITION`,
    authDirectiveTransformer: (schema: GraphQLSchema) =>
      mapSchema(schema, {
        [MapperKind.OBJECT_FIELD](fieldConfig) {
          const authDirective = getDirective(
            schema,
            fieldConfig,
            directiveName,
          )?.[0];
          if (authDirective) {
            const originalResolver =
              fieldConfig.resolve || defaultFieldResolver;

            fieldConfig.resolve = (source, args, context, info) => {
              const user = context.authenticatedUser;
              if (!user) {
                throw new GraphQLError('Unauthenticated...', {
                  extensions: {
                    code: 'UNAUTHENTICATED',
                    http: { status: 401 },
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
