const { getUserId } = require('../../utils')

const game = {
  async createGame(parent, { title, users }, ctx, info) {
    return ctx.db.mutation.createGame(
      {
        data: {
          title,
          users
        },
      },
      info
    )
  },

  async chooseWinner(parent, { id }, ctx, info) {
    const userId = getUserId(ctx)
    const gameExists = await ctx.db.exists.Game({
      id,
      users: [{ id: userId }],
    })
    if (!gameExists) {
      throw new Error(`Game not found or you're not a participant`)
    }

    return ctx.db.mutation.updateGame(
      {
        where: { id },
        data: { winner: userId },
      },
      info,
    )
  },

  async deleteGame(parent, { id }, ctx, info) {
    const userId = getUserId(ctx)
    const gameExists = await ctx.db.exists.Game({
      id,
      users: [{ id: userId }],
    })
    if (!gameExists) {
      throw new Error(`Game not found or you're not a participant`)
    }

    return ctx.db.mutation.deleteGame({ where: { id } })
  },
}

module.exports = { game }
