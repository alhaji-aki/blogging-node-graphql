import { MapperKind, getDirective, mapSchema } from '@graphql-tools/utils';
import { GraphQLError, GraphQLSchema, defaultFieldResolver } from 'graphql';

export default (directiveName: string) => {
  return {
    adminDirectiveTypeDefs: `directive @${directiveName} on OBJECT | FIELD_DEFINITION`,
    adminDirectiveTransformer: (schema: GraphQLSchema) =>
      mapSchema(schema, {
        [MapperKind.OBJECT_FIELD](fieldConfig) {
          const adminDirective = getDirective(
            schema,
            fieldConfig,
            directiveName,
          )?.[0];

          if (adminDirective) {
            const originalResolver =
              fieldConfig.resolve || defaultFieldResolver;

            fieldConfig.resolve = (source, args, context, info) => {
              const user = context.authenticatedUser;
              if (!user || !user.is_admin) {
                throw new GraphQLError(
                  "You don't have the required permissions to perform this action or access this data",
                  {
                    extensions: {
                      code: 'UNAUTHORISED',
                      http: { status: 403 },
                    },
                  },
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
