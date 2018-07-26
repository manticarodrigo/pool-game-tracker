const { getUserId } = require('../utils')

const Query = {
  games(parent, args, ctx, info) {
    return ctx.db.query.games({ orderBy: 'createdAt_DESC' }, info)
  },

  game(parent, { id }, ctx, info) {
    return ctx.db.query.game({ where: { id } }, info)
  },

  me(parent, args, ctx, info) {
    const id = getUserId(ctx)
    return ctx.db.query.user({ where: { id } }, info)
  },

  users(parent, args, ctx, info) {
    const id = getUserId(ctx)
    return ctx.db.query.users({ where : { id_not: id } }, info)
  }
}

module.exports = { Query }
