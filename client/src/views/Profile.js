import React from "react";
import { Container, Row, Col } from "reactstrap";
import Button from '@material-ui/core/Button';
import Loading from "../components/Loading";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";

export const Profile = () => {
  const { user, logout } = useAuth0();

  const logoutWithRedirect = () =>
    logout({
      returnTo: window.location.origin,
    });

  return (
    <Container className="mb-5" p={2}>
      <Row className="align-items-center profile-header mb-5 text-center text-md-left">
        <Col md={2}>
          <img
            src={user.picture}
            alt="Profile"
            className="rounded-circle img-fluid profile-picture mb-2 mb-md-0"
          />
        </Col>
        <Col md>
          <h3>{user.name}</h3>
          <p className="lead text-muted">{user.email}</p>
        </Col>
      </Row>
      <Row>
        <Button
          variant="contained"
          color="secondary"
          onClick={logoutWithRedirect}>
          Log Out
        </Button>
      </Row>
    </Container>
  );
};

export default withAuthenticationRequired(Profile, {
  onRedirecting: () => <Loading />,
});
