import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class Game extends Component {
  render() {
    return (
      <Link className="game-row no-underline ma1" to={`/game/${this.props.game.id}`}>
        <article className="bb b--black-10">
          <div className="flex flex-column flex-row-ns">
            <div className="w-100 w-60-ns pl3-ns">
              <h2 className="f3 fw5 mt0 lh-title">{this.props.game.title}</h2>
              <p className="f6 lh-copy mv0">
                {this.props.game.players[0].name} vs {this.props.game.players[1].name}
              </p>
              <br />
            </div>
          </div>
        </article>
      </Link>
    )
  }
}
