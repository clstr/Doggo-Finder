import React from 'react'
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"

import "./login.css"

const Login = ({
  handleCredentials
}) => {
  return (
    <Form onSubmit={handleCredentials} className={"form-signin text-center"}>
      <p style={{ fontSize: "72px" }} ><span role="img" aria-label="dogface">🐶</span></p>
      <h1>Doggo Finder</h1>
      <Form.Group controlId="AuthFormUsername">
        <Form.Label>API Key</Form.Label>
        <Form.Control size="lg" type="text" placeholder="API Key" autoFocus required />
        <Form.Text className="text-muted"><a href={"https://www.petfinder.com/developers/v2/docs/"} target={"_blank"} rel={"noreferrer noopener"}>Petfinder API Documentation</a></Form.Text>
      </Form.Group>

      <Form.Group controlId="AuthFormPassword">
        <Form.Label>API Secret</Form.Label>
        <Form.Control size="lg" type="password" placeholder="API Secret" required />
      </Form.Group>

      <Button size={"lg"} variant="dark" type="submit" className={"btn-block"}>Authenticate</Button>
      <p className="mt-5 mb-3 text-muted">
        <a href={"https://sergiop.dev"} target={"_blank"} rel={"noreferrer noopener"}>Sergio Palomino</a> | API by <a href={"http://petfinder.com"} target={"_blank"} rel={"noreferrer noopener"}>Petfinder</a>
      </p>
    </Form>
  )
}
export default Login;