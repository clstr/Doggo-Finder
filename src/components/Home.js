import React, { Component } from 'react'
import Spinner from "react-bootstrap/Spinner"
import Media from "react-bootstrap/Media"
import Col from "react-bootstrap/Col"
import { ToastContainer, toast } from 'react-toastify'
import axios from 'axios'

const token = ``

const API_URI = "https://api.petfinder.com/v2/animals"

export class Home extends Component {
  displayName = Home.name

  constructor(props) {
    super(props)
    this.state = this.getInitialState()
  }

  getInitialState = () => {
    const initialState = {
      animals: [],
      animalsLoading: true
    }
    return initialState
  }

  resetState = () => { this.setState(this.getInitialState()) }

  async componentDidMount() {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
      const AsyncAnimalsResponse = await axios.get(`${API_URI}?type=dog&status=adoptable&location=33436`, config)
      const isAnimalsResponseOK = AsyncAnimalsResponse && AsyncAnimalsResponse.status === 200

      if (isAnimalsResponseOK) {
        this.setState({
          animals: await AsyncAnimalsResponse.data,
          animalsLoading: false
        })
      }

      if (isAnimalsResponseOK) {
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
      animals.animals.map(a =>
        <Col key={a.id}>
          <Media>
            <img width={64} height={64} className="mr-3" src={"holder.js/64x64"} />
            <Media.Body>
            
              <h5><a href={a.url} target={"_blank"}>{a.name}</a></h5>
              <div dangerouslySetInnerHTML={{__html: a.description}} />
            </Media.Body>
          </Media>
          <hr />
        </Col>
      )
    )
  }

  render() {
    const {
      animals,
      animalsLoading
    } = this.state

    console.log(animalsLoading)

    let renderAnimals = animalsLoading ?
      <Spinner animation={"border"} variant={"info"} role="status"><span className="sr-only">Loading...</span></Spinner> :
      this.displayAnimals(animals)

    return (
      <>
        <ToastContainer
          position="top-right" autoClose={2000} hideProgressBar={true} newestOnTop={false}
          closeOnClick rtl={false} pauseOnVisibilityChange draggable pauseOnHover
        />
        <h1>PETS</h1>
        <hr />
        {renderAnimals}
      </>
    )
  }
}
