import React, { Component } from 'react'
import Media from "react-bootstrap/Media"
import Col from "react-bootstrap/Col"
import Row from "react-bootstrap/Row"
import Button from "react-bootstrap/Button"
import ButtonToolbar from "react-bootstrap/ButtonToolbar"
import Form from "react-bootstrap/Form"
import Badge from "react-bootstrap/Badge"
import Spinner from "react-bootstrap/Spinner"
import moment from "moment/moment"
import { ToastContainer, toast } from 'react-toastify'
import axios from 'axios'

import "../CSS/login.css"

const API_URI = "https://api.petfinder.com"
const noImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN0/Q8AAY8BRg2Bt48AAAAASUVORK5CYII="

export class Home extends Component {
  displayName = Home.name

  constructor(props) {
    super(props)
    this.state = this.getInitialState()
    this.handleCredentials = this.handleCredentials.bind(this)
  }

  getInitialState = () => {
    const initialState = {
      auth: [],
      authLoading: true,
      animals: [],
      animalsLoading: true,
      isAuthenticated: false
    }
    return initialState
  }

  resetState = () => { this.setState(this.getInitialState()) }

  async AsyncAuthenticationResponse(apikey, apisecret) {
    return await axios.post(`${API_URI}/v2/oauth2/token`, {
      grant_type: "client_credentials",
      client_id: apikey,
      client_secret: apisecret
    })
  }

  async AsyncGetAnimals(auth, query) {
    return await axios.get(`${API_URI}${query}`,
      {
        headers: {
          Authorization: `Bearer ${auth.access_token}`
        }
      })
  }

  async componentDidMount() {
    const auth = {
      token_type: localStorage.getItem("token_type"),
      expires_in: localStorage.getItem("expires_in"),
      access_token: localStorage.getItem("access_token")
    }

    const time_token_last_generated = localStorage.getItem("token_last_generated")
    const tokenExpires = moment(time_token_last_generated).add(auth.expires_in, 'seconds')
    const timeNow = moment().format()

    console.log("token was last generated: " + moment(time_token_last_generated).format('MMMM Do YYYY, h:mm:ss a'))
    console.log("token expires: " + tokenExpires.format('MMMM Do YYYY, h:mm:ss a'))

    // Check if the date/time is still before the expiration
    if (time_token_last_generated !== null && !moment(timeNow).isAfter(tokenExpires) ) {
      this.setState({
        auth: auth,
        isAuthenticated: true
      })

      //
      // Call our doggos, we might want to eventually move this so we can pick from options since we are logged on.
      //
      const AsyncGetAnimals = await this.AsyncGetAnimals(auth, "/v2/animals?type=dog&status=adoptable&location=33436")
      const isGetAnimalsOK = AsyncGetAnimals && AsyncGetAnimals.status === 200

      if (isGetAnimalsOK) {
        this.setState({
          animals: await AsyncGetAnimals.data,
          animalsLoading: false,
        })

        toast.success("Fetched Animal Data 🐶")
        console.info(this.state.animals)
      }
    }
  }

  async fetchNextPage(pagination) {
    this.setState({
      animals: [],
      animalsLoading: true
    })

    try {
      const AsyncGetAnimals = await this.AsyncGetAnimals(this.state.auth, pagination._links.next.href)
      const isGetAnimalsOK = AsyncGetAnimals && AsyncGetAnimals.status === 200

      if (isGetAnimalsOK) {
        this.setState({
          animals: await AsyncGetAnimals.data,
          animalsLoading: false
        })

        toast.success("Fetched Animal Data 🐶")
        console.info(this.state.animals)
      }
    } catch (err) {
      toast.error(err.message)
      console.error("we fucked up")
    }
  }

  async fetchPreviousPage(pagination) {
    if (pagination.current_page === 1) {
      toast.info("Already on first page")
    } else {
      try {
        this.setState({
          animals: [],
          animalsLoading: true
        })

        const AsyncGetAnimals = await this.AsyncGetAnimals(this.state.auth, `/v2/animals?type=dog&status=adoptable&location=33436&page=${pagination.current_page - 1}`)
        const isGetAnimalsOK = AsyncGetAnimals && AsyncGetAnimals.status === 200

        if (isGetAnimalsOK) {
          this.setState({
            animals: await AsyncGetAnimals.data,
            animalsLoading: false
          })

          toast.success("Fetched Animal Data 🐶")
          console.info(this.state.animals)
        }
      } catch (err) {
        toast.error(err.message)
        console.error("we fucked up")
      }
    }
  }

  async handleCredentials(event) {
    event.preventDefault();

    const apikey = event.target.elements.AuthFormUsername.value
    const apisecret = event.target.elements.AuthFormPassword.value
    try {
      const AsyncAuthenticationResponse = await this.AsyncAuthenticationResponse(apikey, apisecret)
      const isAuthenticationResponseOK = AsyncAuthenticationResponse && AsyncAuthenticationResponse.status === 200

      if (isAuthenticationResponseOK) {
        this.setState({
          auth: await AsyncAuthenticationResponse.data,
          authLoading: false,
          isAuthenticated: true
        })

        //Store token details in userSession
        localStorage.setItem("token_type", this.state.auth.token_type)
        localStorage.setItem("expires_in", this.state.auth.expires_in)
        localStorage.setItem("access_token", this.state.auth.access_token)
        localStorage.setItem("token_last_generated", moment().format())
      }

      //
      // Call our doggos, we might want to eventually move this so we can pick from options since we are logged on.
      //
      const AsyncGetAnimals = await this.AsyncGetAnimals(this.state.auth, "/v2/animals?type=dog&status=adoptable&location=33436")
      const isGetAnimalsOK = AsyncGetAnimals && AsyncGetAnimals.status === 200

      if (isGetAnimalsOK) {
        this.setState({
          animals: await AsyncGetAnimals.data,
          animalsLoading: false,
        })

        toast.success("Fetched Animal Data 🐶")
        console.info(this.state.animals)
      }
    } catch (err) {
      toast.error(err.message)
      console.error("we fucked up")
    }

  }

  displayAnimals = (animals) => {
    return (
      animals.animals.map(pet =>
        <Col key={pet.id} md={"5"} className="shadow p-3 mb-5 mr-auto ml-auto bg-white rounded">
          <Media>
            <img width={100} height={100} className="mr-3 rounded-circle" src={pet.photos[0] ? pet.photos[0].large : noImage} alt={"Doggo"} />
            <Media.Body>
              <h5><a href={pet.url} target={"_blank"} className={"text-decoration-none"}>{pet.name}</a></h5>
              <Badge pill variant="light">{pet.breeds.primary}</Badge>
              <Badge pill variant="light">{pet.breeds.secondary}</Badge>
              <Badge pill variant="light">{pet.breeds.mixed ? "Mixed" : null}</Badge>
              <Badge pill variant="light">{moment(pet.published_at).format("MM/DD/YYYY hh:MM A")}</Badge>
              <Badge pill variant="light">{pet.gender}</Badge>
              <Badge pill variant="light">{pet.age}</Badge>
              <Badge pill variant="light">{pet.organization_id}</Badge>
              <div dangerouslySetInnerHTML={{ __html: this.htmlDecode(pet.description) }} />
            </Media.Body>
          </Media>
        </Col>
      )
    )
  }

  Logoff() {
    localStorage.clear()
    this.resetState()
  }

  htmlDecode(input) {
    var e = document.createElement('div');
    e.innerHTML = input;
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
  }

  render() {
    const {
      auth,
      animals,
      animalsLoading,
      isAuthenticated
    } = this.state

    return (
      <>
        <ToastContainer
          position="top-right" autoClose={2000} hideProgressBar={true} newestOnTop={false}
          closeOnClick rtl={false} pauseOnVisibilityChange draggable pauseOnHover
        />
        {
          !isAuthenticated &&
            <Form onSubmit={this.handleCredentials} className={"form-signin text-center"}>
              <p style={{fontSize: "72px"}} ><span role="img" aria-label="dogface">🐶</span></p>
              <h1>Doggo Finder</h1>
              <Form.Group controlId="AuthFormUsername">
                <Form.Label>API Key</Form.Label>
                <Form.Control size="lg" type="text" placeholder="API Key" autoFocus required />
                <Form.Text className="text-muted"><a href={"https://www.petfinder.com/developers/v2/docs/"} target={"_blank"}>Petfinder API Documentation</a></Form.Text>
              </Form.Group>

              <Form.Group controlId="AuthFormPassword">
                <Form.Label>API Secret</Form.Label>
                <Form.Control size="lg" type="password" placeholder="API Secret" required />
              </Form.Group>

              <Button size={"lg"} variant="dark" type="submit" className={"btn-block"}>Authenticate</Button>
              <p className="mt-5 mb-3 text-muted"><a href={"https://sergiop.dev"} target={"_blank"}>Sergio Palomino</a> | API by <a href={"http://petfinder.com"} target={"_blank"}>Petfinder</a></p>
            </Form>
        }

        {
          isAuthenticated && <Badge pill variant="success">Authenticated</Badge>
        }

        {
          !animalsLoading &&
          <React.Fragment>
            <h1 className={"text-center"}>
              <span role="img" aria-label="hotdog">🌭</span>
              <span role="img" aria-label="dog">🐕</span>
              <span role="img" aria-label="dogface">🐶</span>
              Dogs for adoption</h1>
            <hr />
          </React.Fragment>
        }

        {
          isAuthenticated && animalsLoading &&
          <div>
            <Spinner animation={"border"} role="status"><span className="sr-only">Loading...</span></Spinner>
            <h2>Loading doggos</h2>
          </div>
        }

        <Row>{!animalsLoading && this.displayAnimals(animals)}</Row>

        {
          !animalsLoading &&
          <React.Fragment>
            <hr />
            <Badge variant="dark">Page # {animals.pagination.current_page}</Badge>
          </React.Fragment>
        }

        {
          !animalsLoading &&
            <ButtonToolbar>
              <Button disabled={animals.pagination.current_page === 1} className={"mr-1"} variant="outline-dark" onClick={this.fetchPreviousPage.bind(this, animals.pagination, false)} >Back</Button>
              <Button disabled={animals.pagination.current_page === animals.pagination.total_pages}className={"mr-1"} variant="outline-dark" onClick={this.fetchNextPage.bind(this, animals.pagination, true)} >Load more furry friends</Button>
            </ButtonToolbar>
        }

        {
          !animalsLoading && <p>Token expires in {auth.expires_in} seconds</p>
        }

        {
          isAuthenticated && !animalsLoading && <Button onClick={this.Logoff.bind(this)} variant={"outline-danger"}>Log Off</Button>
        }
        <div className={"mb-5"} />
      </>
    )
  }
}