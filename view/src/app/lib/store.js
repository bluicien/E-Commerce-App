import { configureStore } from '@reduxjs/toolkit';
import authenticateReducer from './features/authenticate/authenticateSlice';

export const makeStore = () => {
    return configureStore({
        reducer: {
            authenticate: authenticateReducer
        }
    })
}

