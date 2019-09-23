import React, { Component } from 'react'
import Spinner from "react-bootstrap/Spinner"
import Media from "react-bootstrap/Media"
import Col from "react-bootstrap/Col"
import Row from "react-bootstrap/Row"
import { ToastContainer, toast } from 'react-toastify'
import axios from 'axios'
import dompurify from "dompurify"

const token = `eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjE4YWQ3YTlkYWIwMTQ0MjMzOWU3ODMzYzc3Mjk5MmY5NzlhMTUwODEyNTQ2Yzc3NTQ0Y2Q3Mzc2MDhiMzZiZTgwNWE5NzE3ZjYyMWYxNzU3In0.eyJhdWQiOiJCMUtndlhNbEg3cUN4bnM2N0huZ1ZYWnpVT1M0eG1PQTBXa05MemFNb2ZDdFZHeGpBciIsImp0aSI6IjE4YWQ3YTlkYWIwMTQ0MjMzOWU3ODMzYzc3Mjk5MmY5NzlhMTUwODEyNTQ2Yzc3NTQ0Y2Q3Mzc2MDhiMzZiZTgwNWE5NzE3ZjYyMWYxNzU3IiwiaWF0IjoxNTY5MjQyODU0LCJuYmYiOjE1NjkyNDI4NTQsImV4cCI6MTU2OTI0NjQ1NCwic3ViIjoiIiwic2NvcGVzIjpbXX0.QUvH8j0zTXd0MpnQ8ofNkMwCrfX3Tu39f4Bi7KaKSwCZG_w7eELVB3nNmTJ_gMO8xtg_1vSrWVUfupTB0JkIxC5cYpGrxDEGJPKx4ob9qM3MPv4m5ieYQVtAFcVJiDk7x3ZToEo51MbgAsxGHmmn8zWsTHA1MhUwlioAhcFJLxibCi0rxWVmTKefS-xaD5QkM2fr51n-Pb9uGH17_OyJDsuFj_LsTNzbzWio-ZMOjJs_LdkUv5_PbPYFNvmil0D-yN2pI4rQz_XCNuKDpc1hjkmuLUk0cDLMeBremjczzLE-6cWjbt2ccxNhCSeGBGE9OfBqa05crJwOMwzET8fySw`
const API_URI = "https://api.petfinder.com/v2/animals"

const sanitizer = dompurify.sanitize
const noImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN0/Q8AAY8BRg2Bt48AAAAASUVORK5CYII="

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
        <Col key={a.id} md={"4"}>
          <Media>
            <img width={64} height={64} className="mr-3" src={a.photos[0] ? a.photos[0].small : noImage} alt={"alt"} />
            <Media.Body>
              <h5><a href={a.url} target={"_blank"}>{a.name}</a></h5>
              <sub>{a.breeds.primary}{a.breeds.mixed ? " - Mixed" : null}</sub>
              <div dangerouslySetInnerHTML={{ __html: this.htmlDecode(sanitizer(a.description)) }} />
            </Media.Body>
          </Media>
        </Col>
      )
    )
  }

  htmlDecode(input) {
    var e = document.createElement('div');
    e.innerHTML = input;
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
  }

  render() {
    const {
      animals,
      animalsLoading
    } = this.state

    let renderAnimals = animalsLoading ?
      <Spinner animation={"border"} role="status"><span className="sr-only">Loading...</span></Spinner> :
      this.displayAnimals(animals)

    return (
      <>
        <ToastContainer
          position="top-right" autoClose={2000} hideProgressBar={true} newestOnTop={false}
          closeOnClick rtl={false} pauseOnVisibilityChange draggable pauseOnHover
        />
        <h1>Dogs</h1>
        <hr />

        <Row>{renderAnimals}</Row>

        <hr />
      </>
    )
  }
}
