import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import reportWebVitals from './reportWebVitals';
import './index.css';
import 'antd/dist/reset.css';

import App from './App';
import GlobalStyles from './components/GlobalStyles';
import { store } from '~/store';
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: 'AIzaSyC_Y1klBqPPQdChld8elZi6eXo8f1QgqKM',
    authDomain: 'trainwordbook.firebaseapp.com',
    projectId: 'trainwordbook',
    storageBucket: 'trainwordbook.appspot.com',
    messagingSenderId: '448958157982',
    appId: '1:448958157982:web:434b0f63f618983763d78f',
    measurementId: 'G-4ED0YMK2JX',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <GlobalStyles>
                <App />
            </GlobalStyles>
        </Provider>
    </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
