const Subscription = {
  gamesSubscription: {
    subscribe: (parent, args, ctx, info) => {
      return ctx.db.subscription.game({}, info)
    },
  },
}

module.exports = { Subscription }
