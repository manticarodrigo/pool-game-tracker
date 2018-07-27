const { getUserId } = require('../../utils')

const game = {
  async createGame(parent, { title, opponent }, ctx, info) {
    const userId = getUserId(ctx)
    const players = { connect: [ { id: userId }, { id: opponent }] }
    return ctx.db.mutation.createGame(
      {
        data: {
          title,
          players
        },
      },
      info,
    )
  },

  async chooseWinner(parent, { id, winnerId }, ctx, info) {

    const userId = getUserId(ctx)
    const gameExists = await ctx.db.exists.Game({
      id,
      players_some: { id: userId }
    })
    if (!gameExists) {
      throw new Error(`Game not found or you're not a participant`)
    }

    return ctx.db.mutation.updateGame(
      {
        where: { id },
        data: { winner: { connect: { id: winnerId } } },
      },
      info,
    )
  },

  async deleteGame(parent, { id }, ctx, info) {
    const userId = getUserId(ctx)
    const gameExists = await ctx.db.exists.Game({
      id,
      players_some: { id: userId }
    })
    if (!gameExists) {
      throw new Error(`Game not found or you're not a participant`)
    }

    return ctx.db.mutation.deleteGame({ where: { id } })
  },
}

module.exports = { game }
