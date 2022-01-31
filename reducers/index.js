import { combineReducers } from "redux";
import customerStore from "./customerStore";
import itemStore from "./itemStore";
import warehousingStore from "./warehousingStore";

const rootReducer = combineReducers({
	customerStore,
	itemStore,
	warehousingStore,
});

export default rootReducer;