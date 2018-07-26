import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { graphql, compose } from 'react-apollo'
import  { gql } from 'apollo-boost'

class CreatePage extends Component {
  state = {
    title: '',
    opponent: undefined
  }
  static getDerivedStateFromProps(props, state) {
    if (!state.opponent) {
      return {
        opponent: props.usersQuery.users ? props.usersQuery.users[0].id : undefined
      }
    }
    return null
  }

  render() {
    return (
      <div className="pa4 flex justify-center bg-white">
        <form onSubmit={this.handleSubmit}>
          <h1>Create Game</h1>
          <input
            autoFocus
            className="w-100 pa2 mv2 br2 b--black-20 bw1"
            onChange={e => this.setState({ title: e.target.value })}
            placeholder="Title"
            type="text"
            value={this.state.title}
          />
          <p><strong>Player 1</strong></p>
          <select>
            <option>{this.props.meQuery.me ? this.props.meQuery.me.name : 'No current user found.'}</option>
          </select>
          <p><strong>Player 2</strong></p>
          <select
            value={this.state.opponent}
            onChange={e => this.setState({ opponent: e.target.value })}
          >
            {this.props.usersQuery.users &&
              this.props.usersQuery.users.map(user => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
          <p>
            <input
              style={{ marginRight: '1em'}}
              className={`pa3 bg-black-10 bn ${(this.state.player1 && this.state.opponent) &&
                this.state.title &&
                'dim pointer'}`}
              disabled={(!this.state.player1 && !this.state.opponent) || !this.state.title}
              type="submit"
              value="Create"
            />
            <a className="f6 pointer" onClick={this.props.history.goBack}>
              or cancel
            </a>
          </p>
        </form>
      </div>
    )
  }

  handleSubmit = async e => {
    e.preventDefault()
    const { title, opponent } = this.state
    console.log(this.state)
    await this.props.createGameMutation({
      variables: { title, opponent }
    })
    this.props.history.replace('/')
  }
}

const ME_QUERY = gql`
  query MeQuery {
    me {
      id
      email
      name
    }
  }
`

const USERS_QUERY = gql`
  query UsersQuery {
    users {
      id
      email
      name
    }
  }
`

const CREATE_GAME_MUTATION = gql`
  mutation CreateGameMutation($title: String!, $opponent: ID!) {
    createGame(title: $title, opponent: $opponent) {
      id
      title
    }
  }
`

const CreatePageWithMutation = compose(
  graphql(ME_QUERY, {
    name: 'meQuery'
  }),
  graphql(USERS_QUERY, {
    name: 'usersQuery'
  }),
  graphql(CREATE_GAME_MUTATION, {
    name: 'createGameMutation',
  })
)(CreatePage)

export default withRouter(CreatePageWithMutation)
