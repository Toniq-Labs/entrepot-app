import '@fontsource/roboto';
import CssBaseline from '@material-ui/core/CssBaseline';
import {ThemeProvider} from '@material-ui/core/styles';
import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import App from './App';
import theme from './theme';

ReactDOM.render(
    <ThemeProvider theme={theme}>
        <BrowserRouter>
            <CssBaseline />
            <App />
        </BrowserRouter>
    </ThemeProvider>,
    document.querySelector('#root'),
);
