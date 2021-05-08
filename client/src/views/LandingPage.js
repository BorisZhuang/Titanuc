import React from 'react';
import styled from 'styled-components';
import { StylesProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import {
  Root,
  getHeader,
  getContent,
  getFooter,
  getContentBasedScheme
} from '@mui-treasury/layout';
import HeaderEx from '../components/HeaderEx';
import ContentEx from '../components/ContentEx';
import FooterEx from '../components/FooterEx';

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
              <ContentEx />
            </Content>
            <Footer>
              <FooterEx />
            </Footer>
          </>
        )}
      </Root>
    </StylesProvider>
  );
};


export default LandingPage;
