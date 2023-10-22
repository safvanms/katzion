import React from 'react'
import './Header.css'

export default function Header() {
  return (
    <div className="header">
      <div className="left__head">
        <h2>LOGO</h2>
      </div>
      <div className="right__head">
        <p>Features</p>
        <p>Service</p>
        <p>Blog</p>
        <button className="button">Click here</button>
      </div>
    </div>
  )
}
