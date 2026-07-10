import React from 'react';
import ReactDOM from 'react-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import {ThemeProvider} from '@material-ui/core/styles';
import App from './App';
import theme from './theme';
// Only the weights MUI actually uses (light/regular/medium/bold) instead of the
// full @fontsource/roboto set (all 12 weight+italic variants).
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {BrowserRouter} from 'react-router-dom';

ReactDOM.render(
    <ThemeProvider theme={theme}>
        <BrowserRouter>
            <CssBaseline />
            <App />
        </BrowserRouter>
    </ThemeProvider>,
    document.querySelector('#root'),
);
