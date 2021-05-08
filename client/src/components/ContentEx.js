import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const styles = ({ breakpoints, transitions }) => ({
  root: {
    padding: 16,
    transition: transitions.create(),
    [breakpoints.up('sm')]: {
      padding: 24,
      maxWidth: 700,
      margin: 'auto',
    },
    [breakpoints.up('md')]: {
      maxWidth: 960,
    },
  }
});

const ContentEx = ({ classes }) => (
  <div className={classes.root}>
    <Typography variant={'overline'}>INTRODUCING</Typography>
    <Typography weight={'bold'} variant={'h4'} gutterBottom>
      TitanUC
    </Typography>
    <Typography indent={'small'}>
      TitanUC is a web-based application which allows users to have secure peer-to-peer
      communication. This cross-platform solution makes audio/video/text interaction available
      between users on all existing computing platforms.
    </Typography>
    <br />
    <Typography>
      Let's get it started! Click Login button to chat with your friends right away.
    </Typography>
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
  </div>
);

ContentEx.propTypes = {};
ContentEx.defaultProps = {};

export default withStyles(styles)(ContentEx);
