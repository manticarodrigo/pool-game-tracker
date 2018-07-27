import React, { Component, Fragment } from 'react'
import Game from '../components/Game'
import { graphql } from 'react-apollo'
import  { gql } from 'apollo-boost'

class GamesPage extends Component {
  
  componentDidUpdate(prevProps) {
    if (prevProps.location.key !== this.props.location.key) {
      this.props.gamesQuery.refetch()
    }
  }

  componentDidMount() {
    this.props.subscribeToNewGames()
  }

  render() {
    const games = this.props.gamesQuery.games
    const ongoingGames = games ? games.filter(game => !game.winner) : null
    const finishedGames = games ? games.filter(game => game.winner) : null
    if (this.props.gamesQuery.loading) {
      return (
        <div className="flex w-100 h-100 items-center justify-center pt7">
          <div>Loading games...</div>
        </div>
      )
    }

    return (
      <Fragment>
        <h1>Ongoing Games</h1>
        {ongoingGames &&
          ongoingGames.map(game => (
            <Game
              key={game.id}
              game={game}
              refresh={() => this.props.gamesQuery.refetch()}
            />
          ))}
        <h1>Finished Games</h1>
        {finishedGames &&
          finishedGames.map(game => (
            <Game
              key={game.id}
              game={game}
              refresh={() => this.props.gamesQuery.refetch()}
            />
          ))}
        {this.props.children}
      </Fragment>
    )
  }
}

const GAMES_QUERY = gql`
  query GamesQuery {
    games {
      id
      title
      players {
        id
        email
        name
      }
      winner {
        id
        email
        name
      }
    }
  }
`

const GAMES_SUBSCRIPTION = gql`
  subscription GamesSubscription {
    gamesSubscription {
      node {
        id
        title
        players {
          id
          email
          name
        }
        winner {
          id
          email
          name
        }
      }
    }
  }
`

export default graphql(GAMES_QUERY, {
  name: 'gamesQuery', // name of the injected prop: this.props.gamesQuery...
  options: {
    fetchPolicy: 'network-only',
  },
  props: props =>
    Object.assign({}, props, {
      subscribeToNewGames: params => {
        return props.gamesQuery.subscribeToMore({
          document: GAMES_SUBSCRIPTION,
          updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data) {
              return prev
            }
            const newGame = subscriptionData.data.gamesSubscription.node
            if (prev.games.find(game => game.id === newGame.id)) {
              return prev
            }
            return Object.assign({}, prev, {
              games: [...prev.games, newGame],
            })
          },
        })
      },
    }),
})(GamesPage)
