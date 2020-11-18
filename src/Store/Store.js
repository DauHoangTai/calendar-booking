import Api from '../Reducer/Api'
import AlertReducer from '../Reducer/Alert'



import { createStore, combineReducers  } from 'redux'

const AllReducer = combineReducers({
    Api,
    AlertReducer
})
const store = createStore(AllReducer);

export default store;