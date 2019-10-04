// Framework Lib
import React from 'react';

// Bootstrap
import Col from "react-bootstrap/Col"
import Badge from "react-bootstrap/Badge"
import Media from "react-bootstrap/Media"
import moment from "moment/moment"

// Consts
import { noImage } from "../../ui/utils/consts"

// Helpers
import { htmlDecode } from "../../ui/utils/helpers"

const DisplayAnimals = ({
  animals
}) => {
  return (
    animals.animals.map(pet =>
      <Col key={pet.id} md={"5"} className="shadow p-3 mb-5 mr-auto ml-auto bg-white rounded">
        <Media>
          <img width={100} height={100} className="mr-3 rounded-circle" src={pet.photos[0] ? pet.photos[0].large : noImage} alt={"Doggo"} />
          <Media.Body>
            <h5><a href={pet.url} target={"_blank"} className={"text-decoration-none"} rel={"noreferrer noopener"}>{pet.name}</a></h5>
            <Badge pill variant="light">{pet.breeds.primary}</Badge>
            <Badge pill variant="light">{pet.breeds.secondary}</Badge>
            <Badge pill variant="light">{pet.breeds.mixed ? "Mixed" : null}</Badge>
            <Badge pill variant="light">{moment(pet.published_at).format("MM/DD/YYYY hh:MM A")}</Badge>
            <Badge pill variant="light">{pet.gender}</Badge>
            <Badge pill variant="light">{pet.age}</Badge>
            <Badge pill variant="light">{pet.organization_id}</Badge>
            <div dangerouslySetInnerHTML={{ __html: htmlDecode(pet.description) }} />
          </Media.Body>
        </Media>
      </Col>
    )
  )
};

export default DisplayAnimals;