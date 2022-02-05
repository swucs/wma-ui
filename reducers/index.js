import { combineReducers } from "redux";
import customerStore from "./customerStore";
import itemStore from "./itemStore";
import warehousingStore from "./warehousingStore";
import storageFeeStore from "./storageFeeStore";

const rootReducer = combineReducers({
	customerStore,
	itemStore,
	warehousingStore,
	storageFeeStore,
});

export default rootReducer;