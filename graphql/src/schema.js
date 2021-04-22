const {
  intArg,
  makeSchema,
  nonNull,
  objectType,
  stringArg,
  inputObjectType,
  arg,
  asNexusMethod,
  enumType,
} = require('nexus')
const { GraphQLDateTime } = require('graphql-iso-date')

const DateTime = asNexusMethod(GraphQLDateTime, 'date')

const Query = objectType({
  name: 'Query',
  definition(t) {
    t.nonNull.list.nonNull.field('allUsers', {
      type: 'User',
      resolve: (_parent, _args, context) => {
        return context.prisma.user.findMany()
      },
    })

    t.nullable.field('postById', {
      type: 'Post',
      args: {
        id: intArg(),
      },
      resolve: (_parent, args, context) => {
        return context.prisma.post.findUnique({
          where: { id: args.id || undefined },
        })
      },
    })

/*     t.nonNull.list.nonNull.field('feed', {
      type: 'Post',
      args: {
        searchString: stringArg(),
        skip: intArg(),
        take: intArg(),
        orderBy: arg({
          type: 'PostOrderByUpdatedAtInput',
        }),
      },
      resolve: (_parent, args, context) => {
        const or = args.searchString
          ? {
              OR: [
                { title: { contains: args.searchString } },
                { content: { contains: args.searchString } },
              ],
            }
          : {}

        return context.prisma.post.findMany({
          where: {
            published: true,
            ...or,
          },
          take: args.take || undefined,
          skip: args.skip || undefined,
          orderBy: args.orderBy || undefined,
        })
      },
    })

    t.list.field('draftsByUser', {
      type: 'Post',
      args: {
        userUniqueInput: nonNull(
          arg({
            type: 'UserUniqueInput',
          }),
        ),
      },
      resolve: (_parent, args, context) => {
        return context.prisma.user
          .findUnique({
            where: {
              id: args.userUniqueInput.id || undefined,
              email: args.userUniqueInput.email || undefined,
            },
          })
          .posts({
            where: {
              published: false,
            },
          })
      },
    }) */
  },
})

const Mutation = objectType({
  name: 'Mutation',
  definition(t) {
    t.nonNull.field('createGameUser', {
      type: 'GameUser',
      args: {
        data: nonNull(
          arg({
            type: 'GameUserCreateInput',
          }),
        ),
      },
      resolve: (_, args, context) => {
        return context.prisma.gameUser.create({
          data: {
            name: args.data.name,
            email: args.data.email,
          },
        })
      },
    })

    t.field('createGame', {
      type: 'Game',
      args: {
        data: nonNull(
          arg({
            type: 'GameCreateInput',
          }),
        ),
        gameUserEmail: nonNull(stringArg()),
      },
      resolve: (_, args, context) => {
        return context.prisma.post.create({
          data: {
            title: args.data.title,
            steamAppID: args.data.steamAppID,
          },
        })
      },
    })

    /*t.field('togglePublishPost', {
      type: 'Post',
      args: {
        id: nonNull(intArg()),
      },
      resolve: async (_, args, context) => {
        const post = await context.prisma.post.findUnique({
          where: { id: args.id || undefined },
          select: {
            published: true,
          },
        })

        if (!post) {
          throw new Error(
            `Post with ID ${args.id} does not exist in the database.`,
          )
        }

        return context.prisma.post.update({
          where: { id: args.id || undefined },
          data: { published: !post.published },
        })
      },
    })

    t.field('incrementPostViewCount', {
      type: 'Post',
      args: {
        id: nonNull(intArg()),
      },
      resolve: (_, args, context) => {
        return context.prisma.post.update({
          where: { id: args.id || undefined },
          data: {
            viewCount: {
              increment: 1,
            },
          },
        })
      },
    }) */

    t.field('deleteGame', {
      type: 'Game',
      args: {
        id: nonNull(intArg()),
      },
      resolve: (_, args, context) => {
        return context.prisma.game.delete({
          where: { id: args.id },
        })
      },
    })
  },
})

const gameUser = objectType({
  name: 'gameUser',
  definition(t) {
    t.nonNull.int('id')
    t.string('name')
    t.nonNull.string('email')
    t.nonNull.list.nonNull.field('games', {
      type: 'Game',
      resolve: (parent, _, context) => {
        return context.prisma.gameUser
          .findUnique({
            where: { id: parent.id || undefined },
          })
          .posts()
      },
    })
  },
})

const Game = objectType({
  name: 'Game',
  definition(t) {
    t.nonNull.int('id')
    t.nonNull.field('createdAt', { type: 'DateTime' })
    t.nonNull.field('updatedAt', { type: 'DateTime' })
    t.nonNull.string('title')
    t.string('steamAppID')
    t.string('thumb')
    t.field('gameUser', {
      type: 'gameUser',
      resolve: (parent, _, context) => {
        return context.prisma.post
          .findUnique({
            where: { id: parent.id || undefined },
          })
          .gameUser()
      },
    })
  },
})

/*const SortOrder = enumType({
  name: 'SortOrder',
  members: ['asc', 'desc'],
})

const PostOrderByUpdatedAtInput = inputObjectType({
  name: 'PostOrderByUpdatedAtInput',
  definition(t) {
    t.nonNull.field('updatedAt', { type: 'SortOrder' })
  },
})

const UserUniqueInput = inputObjectType({
  name: 'UserUniqueInput',
  definition(t) {
    t.int('id')
    t.string('email')
  },
}) */

const GameCreateInput = inputObjectType({
  name: 'GameCreateInput',
  definition(t) {
    t.nonNull.string('title')
    t.string('steamAppID')
  },
})

const GameUserCreateInput = inputObjectType({
  name: 'GameUserCreateInput',
  definition(t) {
    t.nonNull.string('email')
    t.string('name')
    t.list.nonNull.field('posts', { type: 'PostCreateInput' })
  },
})

const schema = makeSchema({
  types: [
    Query,
    Mutation,
    Game,
    GameUser,
    //UserUniqueInput,
    GameUserCreateInput,
    GameCreateInput,
    //SortOrder,
    //PostOrderByUpdatedAtInput,
    DateTime,
  ],
  outputs: {
    schema: __dirname + '/../schema.graphql',
    typegen: __dirname + '/generated/nexus.ts',
  },
  sourceTypes: {
    modules: [
      {
        module: '@prisma/client',
        alias: 'prisma',
      },
    ],
  },
})

module.exports = {
  schema: schema,
}
