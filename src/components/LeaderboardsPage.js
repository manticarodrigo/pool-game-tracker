import React, { Component, Fragment } from 'react'
import { graphql, compose } from 'react-apollo'
import  { gql } from 'apollo-boost'

class LeaderboardsPage extends Component {

  componentDidUpdate(prevProps) {
    if (prevProps.location.key !== this.props.location.key) {
      this.props.usersQuery.refetch()
    }
  }

  compare = (a,b) => {
    if (a.gamesWon.length > b.gamesWon.length) {
      return -1
    } else if (b.gamesWon.length > a.gamesWon.length) {
      return 1
    }
    return 0
 }

  render() {
    const users = this.props.usersQuery.users
    const reference = users ? JSON.parse(JSON.stringify(users)) : null
    const rankedUsers = users ? reference.sort(this.compare) : null
    if (this.props.usersQuery.loading) {
      return (
        <div className="flex w-100 h-100 items-center justify-center pt7">
          <div>Loading (from {process.env.REACT_APP_GRAPHQL_ENDPOINT})</div>
        </div>
      )
    }

    return (
      <Fragment>
        <div className="flex justify-between items-center">
          <h1>Leaderboards</h1>
        </div>
        {rankedUsers &&
          rankedUsers.map(user => (
            <p key={user.id}>
              {user.name} has won {user.gamesWon.length} game(s).
            </p>
          ))}
        {this.props.children}
      </Fragment>
    )
  }
}

const USERS_QUERY = gql`
  query UsersQuery {
    users {
      id
      email
      name
      gamesWon {
        id
        title
      }
    }
  }
`

const USERS_SUBSCRIPTION = gql`
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

export default compose(
  graphql(USERS_QUERY, {
    name: 'usersQuery',
    options: {
    fetchPolicy: 'network-only',
  },
  props: props =>
    Object.assign({}, props, {
      subscribeToNewGames: params => {
        return props.usersQuery.subscribeToMore({
          document: USERS_SUBSCRIPTION,
          updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data) {
              return prev
            }
            const newUser = subscriptionData.data.userSubscription.node
            if (prev.users.find(user => user.id === newUser.id)) {
              return prev
            }
            return Object.assign({}, prev, {
              users: [...prev.users, newUser],
            })
          },
        })
      },
    }),
  })
)(LeaderboardsPage)
