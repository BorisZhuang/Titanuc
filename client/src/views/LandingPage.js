import React from 'react';
import styled from 'styled-components';
import { StylesProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import {
  ContentMockUp,
  FooterMockUp,
} from '@mui-treasury/mockup/layout';
import {
  Root,
  getHeader,
  getContent,
  getFooter,
  getContentBasedScheme
} from '@mui-treasury/layout';
import HeaderEx from '../components/HeaderEx';

const Header = getHeader(styled);
const Content = getContent(styled);
const Footer = getFooter(styled);

const contentBasedScheme = getContentBasedScheme();

const LandingPage = () => {
  return (
    <StylesProvider injectFirst>
      <CssBaseline />
      <Root scheme={contentBasedScheme}>
        {() => (
          <>
            <Header>
              <Toolbar>
                <HeaderEx />
              </Toolbar>
            </Header>
            <Content>
              <ContentMockUp />
            </Content>
            <Footer>
              <FooterMockUp />
            </Footer>
          </>
        )}
      </Root>
    </StylesProvider>
  );
};


export default LandingPage;
