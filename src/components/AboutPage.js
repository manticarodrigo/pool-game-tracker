import React from 'react'
import { Link } from 'react-router-dom'

const AboutPage = () => (
  <div>
    <p>This app allows you to create pool games and keep the scores.</p>
    <p>Create a game, publish it, and begin submitting scores.</p>
    <p>You can see the score history in the game detail page (click on a game in the games page).</p>
    <Link to="/">Go to Games</Link>
  </div>
)

export default AboutPage
