import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { useAuth0 } from '@auth0/auth0-react';

const styles = () => ({
  header: {
    fontWeight: 900,
    minWidth: 0,
    fontSize: 18,
  },
  grow: {
    flexGrow: 1,
  }
});

const HeaderEx = ({ classes }) => {
  const { loginWithRedirect } = useAuth0();

  return (
  <>
    <Typography noWrap color={'textSecondary'} className={classes.header}>
      TitanUC
    </Typography>
    <div className={classes.grow} />
    <div >
      <Button
          variant="outlined"
          onClick={() => loginWithRedirect({})}>
          Log In
        </Button>
    </div>
  </>)
};

HeaderEx.propTypes = {
  classes: PropTypes.shape({}).isRequired,
};

export default withStyles(styles)(HeaderEx);
