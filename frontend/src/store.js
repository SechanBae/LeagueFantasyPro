import {combineReducers,applyMiddleware,createStore} from 'redux';
import thunk from 'redux-thunk';
import {composeWithDevTools} from "redux-devtools-extension";
const reducer=combineReducers({

});

const initialState={}

const middleWare=[thunk];

const store=createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleWare))
);
export default store;