import React from 'react'
import { Link } from 'react-router-dom'

const AboutPage = () => (
  <div>
    <h1>About</h1>
    <p>This app allows you to create pool games and keep the scores.</p>
    <p>Create a game, publish it, and begin submitting scores.</p>
    <p>You can choose a winner or delete an ongoing game in the detail page (click on a game in the games page).</p>
    <Link to="/">Go to Games</Link>
  </div>
)

export default AboutPage
