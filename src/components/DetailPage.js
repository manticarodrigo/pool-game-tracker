import React, { Component, Fragment } from 'react'
import { graphql, compose } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import  { gql } from 'apollo-boost'

class DetailPage extends Component {
  render() {
    if (this.props.gameQuery.loading) {
      return (
        <div className="flex w-100 h-100 items-center justify-center pt7">
          <div>Loading (from {process.env.REACT_APP_GRAPHQL_ENDPOINT})</div>
        </div>
      )
    }

    const { game } = this.props.gameQuery
    
    let action = this._renderAction(game)
    let createDate = new Date(game.createdAt)
    let updatedDate = new Date(game.updatedAt)
    return (
      <Fragment>
        <h1 className="f3 black-80 fw4 lh-solid">{game.title}</h1>
        <p className="black-80 fw3">{'Started at ' + createDate.toLocaleTimeString()}</p>
        {game.winner && (
          <p className="black-80 fw3">{'Finished at ' + updatedDate.toLocaleTimeString()}</p>
        )}
        <br />
        {!game.winner ? action : null}
      </Fragment>
    )
  }

  _renderAction = ({ id, winner }) => {
    const { game } = this.props.gameQuery
    return (
      <Fragment>
        <p><strong>Choose Winner</strong></p>
        {game.players &&
          game.players.map(user => (
            <p key={user.id}>
              <a
                style={{ minWidth: '150px' }}
                className="f6 dim br1 ba ph3 pv2 mb2 dib black pointer"
                onClick={() => this.chooseWinner(id, user.id)}
              >
                {user.name}
              </a>
            </p>
        ))}
        <p><strong>Delete Game</strong></p>
        <a
          className="delete f6 dim br1 ba ph3 pv2 mb2 dib black pointer"
          onClick={() => this.deleteGame(id)}
        >
          Delete
        </a>
      </Fragment>
    )
  }

  deleteGame = async id => {
    await this.props.deleteGame({
      variables: { id },
    })
    this.props.history.replace('/')
  }

  chooseWinner = async (id, winnerId) => {
    await this.props.chooseWinner({
      variables: { id, winnerId },
    })
    this.props.history.replace('/')
  }
}

const GAME_QUERY = gql`
  query GameQuery($id: ID!) {
    game(id: $id) {
      id
      createdAt
      updatedAt
      title
      players {
        id
        name
      }
      winner {
        id
        name
      }
    }
  }
`

const CHOOSE_WINNER_MUTATION = gql`
  mutation chooseWinner($id: ID!, $winnerId: ID!) {
    chooseWinner(id: $id, winnerId: $winnerId) {
      id
      title
    }
  }
`

const DELETE_MUTATION = gql`
  mutation deleteGame($id: ID!) {
    deleteGame(id: $id) {
      id
    }
  }
`

export default compose(
  graphql(GAME_QUERY, {
    name: 'gameQuery',
    options: props => ({
      variables: {
        id: props.match.params.id,
      },
    }),
  }),
  graphql(CHOOSE_WINNER_MUTATION, {
    name: 'chooseWinner',
  }),
  graphql(DELETE_MUTATION, {
    name: 'deleteGame',
  }),
  withRouter,
)(DetailPage)
