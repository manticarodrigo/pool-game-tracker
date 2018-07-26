const { getUserId } = require('../utils')

const Query = {
  games(parent, args, ctx, info) {
    const id = getUserId(ctx)
    const where = {
      users: [{
        id
      }]
    }

    return ctx.db.query.games({ where }, info)
  },

  game(parent, { id }, ctx, info) {
    return ctx.db.query.game({ where: { id } }, info)
  },

  me(parent, args, ctx, info) {
    const id = getUserId(ctx)
    return ctx.db.query.user({ where: { id } }, info)
  },

  users(parent, args, ctx, info) {
    return ctx.db.query.user({}, info)
  }
}

module.exports = { Query }
