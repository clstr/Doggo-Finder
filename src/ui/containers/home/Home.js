import React, { Component } from 'react'
import Row from "react-bootstrap/Row"
import Button from "react-bootstrap/Button"
import ButtonToolbar from "react-bootstrap/ButtonToolbar"

import Badge from "react-bootstrap/Badge"
import Spinner from "react-bootstrap/Spinner"
import moment from "moment/moment"
import { ToastContainer, toast } from 'react-toastify'
import axios from 'axios'

import DisplayAnimals from "../../../components/displayAnimals/displayAnimals"
import Login from "../login/login"
import { API_URI } from "../../utils/consts"


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
    if (time_token_last_generated !== null && !moment(timeNow).isAfter(tokenExpires)) {
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

  Logoff() {
    localStorage.clear()
    this.resetState()
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
          !isAuthenticated && <Login handleCredentials={this.handleCredentials}/>
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

        <Row>{ !animalsLoading && <DisplayAnimals animals={animals}/> }</Row>

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
            <Button disabled={animals.pagination.current_page === animals.pagination.total_pages} className={"mr-1"} variant="outline-dark" onClick={this.fetchNextPage.bind(this, animals.pagination, true)} >Load more furry friends</Button>
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