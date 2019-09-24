import React, { Component } from 'react'

import Spinner from "react-bootstrap/Spinner"
import Media from "react-bootstrap/Media"
import Col from "react-bootstrap/Col"
import Row from "react-bootstrap/Row"
import Button from "react-bootstrap/Button"
import ButtonToolbar from "react-bootstrap/ButtonToolbar"
import Badge from "react-bootstrap/Badge"

import Moment from 'react-moment'
import { ToastContainer, toast } from 'react-toastify'
import axios from 'axios'

const token = ``
const API_URI = "https://api.petfinder.com"

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
      const AsyncAnimalsResponse = await axios.get(`${API_URI}/v2/animals?type=dog&status=adoptable&location=33436`, config)
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

  async fetchNextPage(pagination) {
    this.resetState()
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
      const AsyncAnimalsResponse = await axios.get(`${API_URI}${pagination._links.next.href}`, config)
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

  async fetchPreviousPage(pagination) {
    if (pagination.current_page === 1) {
      toast.info("Already on first page")
    } else {
      try {
        this.resetState()
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
        const AsyncAnimalsResponse = await axios.get(`${API_URI}/v2/animals?type=dog&status=adoptable&location=33436&page=${pagination.current_page - 1}`, config)
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
              <Badge pill variant="light"><Moment date={pet.published_at} format={"MM/DD/YYYY hh:MM A"} /></Badge>
              <Badge pill variant="light">{pet.age}</Badge>
              <Badge pill variant="light">{pet.organization_id}</Badge>
              <div dangerouslySetInnerHTML={{ __html: this.htmlDecode(pet.description) }} />
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

    let renderLoadMorePetsButton = animalsLoading ? null :
      <ButtonToolbar>
        <Button className={"mr-1"} variant="outline-dark" onClick={this.fetchPreviousPage.bind(this, animals.pagination, false)} >Back</Button>
        <Button className={"mr-1"} variant="outline-dark" onClick={this.fetchNextPage.bind(this, animals.pagination, true)} >Load more furry friends</Button>
      </ButtonToolbar>

    return (
      <>
        <ToastContainer
          position="top-right" autoClose={2000} hideProgressBar={true} newestOnTop={false}
          closeOnClick rtl={false} pauseOnVisibilityChange draggable pauseOnHover
        />
        <h1 className={"text-center"}>
          <span role="img" aria-label="hotdog">🌭</span>
          <span role="img" aria-label="dog">🐕</span>
          <span role="img" aria-label="dogface">🐶</span>
          Dogs for adoption</h1>
        <hr />

        <Row>{renderAnimals}</Row>

        <hr />
        {!animalsLoading && <Badge variant="dark">Page # {animals.pagination.current_page}</Badge>}
        {renderLoadMorePetsButton}
        <div className={"mb-5"} />
      </>
    )
  }
}
