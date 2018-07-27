const Subscription = {
  gamesSubscription: {
    subscribe: (parent, args, ctx, info) => {
      return ctx.db.subscription.game({}, info)
    },
  },
  usersSubscription: {
    subscribe: (parent, args, ctx, info) => {
      return ctx.db.subscription.user({}, info)
    },
  }
}

module.exports = { Subscription }
