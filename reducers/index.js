import { combineReducers } from "redux";
import customerStore from "./customerStore";
import itemStore from "./itemStore";

const rootReducer = combineReducers({
	customerStore,
	itemStore,
});

export default rootReducer;