import React, { Component, Fragment } from 'react'
import {
  NavLink,
  Link,
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom'
import AboutPage from './AboutPage'
import GamesPage from './GamesPage'
import LeaderboardsPage from './LeaderboardsPage'
import CreatePage from './CreatePage'
import DetailPage from './DetailPage'
import LoginPage from './LoginPage'
import SignupPage from './SignupPage'
import PageNotFound from './PageNotFound'
import LogoutPage from './LogoutPage'
import { AUTH_TOKEN } from '../constant'
import { isTokenExpired } from '../helper/jwtHelper'
import { graphql } from 'react-apollo'
import  { gql } from 'apollo-boost'

import Logo from '../assets/pool-logo.png'

const ProtectedRoute = ({ component: Component, token, ...rest }) => {
  return token ? (
    <Route {...rest} render={matchProps => <Component {...matchProps} />} />
  ) : (
    <Redirect to="/login" />
  )
}

class RootContainer extends Component {
  constructor(props) {
    super(props)
    this.refreshTokenFn = this.refreshTokenFn.bind(this)

    this.state = {
      token: props.token,
    }
  }

  refreshTokenFn(data = {}) {
    const token = data.AUTH_TOKEN

    if (token) {
      localStorage.setItem(AUTH_TOKEN, token)
    } else {
      localStorage.removeItem(AUTH_TOKEN)
    }

    this.setState({
      token: data.AUTH_TOKEN,
    })
  }

  bootStrapData() {
    try {
      const token = localStorage.getItem(AUTH_TOKEN)
      if (token !== null && token !== undefined) {
        const expired = isTokenExpired(token)
        if (!expired) {
          this.setState({ token: token })
        } else {
          localStorage.removeItem(AUTH_TOKEN)
          this.setState({ token: null })
        }
      }
    } catch (e) {
      console.log('')
    }
  }

  //verify localStorage check
  componentDidMount() {
    this.bootStrapData()
  }

  render() {
    return (
      <Router>
        <Fragment>
          {this.renderNavBar()}
          {this.renderRoute()}
        </Fragment>
      </Router>
    )
  }

  renderNavBar() {
    return (
      <nav className="pa3 pa4-ns" style={{ textAlign: 'top' }}>
        <NavLink
          className="link"
          exact={true}
          to="/"
          title="Home"
        >
          <img
            src={Logo}
            alt="Pool Game Tracker Logo"
            style={{
              display: 'inline-block',
              maxWidth: '80px',
              marginRight: '2em',
              marginBottom: '-1em'
            }}
          />
        </NavLink>
        <NavLink
          className="link dim f6 f5-ns dib mr3 black"
          activeClassName="gray"
          exact={true}
          to="/"
          title="Games"
        >
          Games
        </NavLink>
        <NavLink
          className="link dim f6 f5-ns dib mr3 black"
          activeClassName="gray"
          exact={true}
          to="/about"
          title="About">
          About
        </NavLink>
        {this.props.data &&
          this.props.data.me &&
          this.props.data.me.email &&
          this.state.token && (
            <NavLink
              className="link dim f6 f5-ns dib mr3 black"
              activeClassName="gray"
              exact={true}
              to="/leaderboards"
              title="Leaderboards"
            >
              Leaderboards
            </NavLink>
          )}
        {this.state.token ? (
          <div
            onClick={() => {
              this.refreshTokenFn &&
                this.refreshTokenFn({
                  [AUTH_TOKEN]: null,
                })
              window.location.href = '/'
            }}
            className="f6 link dim br1 ba ph3 pv2 fr mb2 dib black"
          >
            Logout
          </div>
        ) : (
          <Link
            to="/login"
            className="f6 link dim br1 ba ph3 pv2 fr mb2 dib black login"
          >
            Login
          </Link>
        )}
        {this.props.data &&
          this.props.data.me &&
          this.props.data.me.email &&
          this.state.token && (
            <Link
              to="/create"
              className="f6 link dim br1 ba ph3 pv2 fr mb2 dib black"
              style={{ marginRight: '1em' }}
            >
              + Create Game
            </Link>
          )}
      </nav>
    )
  }

  renderRoute() {
    return (
      <div className="fl w-100 pl4 pr4">
        <Switch>
          <Route exact path="/" component={GamesPage} />
          <Route exact path="/about" component={AboutPage} />
          <ProtectedRoute
            token={this.state.token}
            path="/leaderboards"
            component={LeaderboardsPage}
          />
          <ProtectedRoute
            token={this.state.token}
            path="/create"
            component={CreatePage}
          />
          <Route path="/game/:id" component={DetailPage} />
          <Route
            token={this.state.token}
            path="/login"
            render={props => <LoginPage refreshTokenFn={this.refreshTokenFn} />}
          />
          <Route
            token={this.state.token}
            path="/signup"
            render={props => (
              <SignupPage refreshTokenFn={this.refreshTokenFn} />
            )}
          />
          <Route path="/logout" component={LogoutPage} />
          <Route component={PageNotFound} />
        </Switch>
      </div>
    )
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

export default graphql(ME_QUERY, {
  options: {
    errorPolicy: 'all',
  },
})(RootContainer)
