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

    return (
      <Fragment>
        <h1 className="f3 black-80 fw4 lh-solid">{game.title}</h1>
        <p className="black-80 fw3">{game.text}</p>
        {action}
      </Fragment>
    )
  }

  _renderAction = ({ id, winner }) => {
    if (!winner) {
      return (
        <Fragment>
          <a
            className="f6 dim br1 ba ph3 pv2 mb2 dib black pointer"
            onClick={() => this.publishDraft(id)}
          >
            Publish
          </a>{' '}
          <a
            className="f6 dim br1 ba ph3 pv2 mb2 dib black pointer"
            onClick={() => this.deleteGame(id)}
          >
            Delete
          </a>
        </Fragment>
      )
    }
    return (
      <a
        className="f6 dim br1 ba ph3 pv2 mb2 dib black pointer"
        onClick={() => this.deleteGame(id)}
      >
        Delete
      </a>
    )
  }

  deleteGame = async id => {
    await this.props.deleteGame({
      variables: { id },
    })
    this.props.history.replace('/')
  }

  publishDraft = async id => {
    await this.props.publishDraft({
      variables: { id },
    })
    this.props.history.replace('/')
  }
}

const POST_QUERY = gql`
  query GameQuery($id: ID!) {
    game(id: $id) {
      id
      title
      users
      winner
    }
  }
`

const PUBLISH_MUTATION = gql`
  mutation publish($id: ID!) {
    publish(id: $id) {
      id
      isPublished
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
  graphql(POST_QUERY, {
    name: 'gameQuery',
    options: props => ({
      variables: {
        id: props.match.params.id,
      },
    }),
  }),
  graphql(PUBLISH_MUTATION, {
    name: 'publishDraft',
  }),
  graphql(DELETE_MUTATION, {
    name: 'deleteGame',
  }),
  withRouter,
)(DetailPage)
