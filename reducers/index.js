import { combineReducers } from "redux";
import customerStore from "./customerStore";
import itemStore from "./itemStore";
import warehousingStore from "./warehousingStore";
import storageFeeStore from "./storageFeeStore";
import customerItemTermStore from "./customerItemTermStore";

const rootReducer = combineReducers({
	customerStore,
	itemStore,
	warehousingStore,
	storageFeeStore,
	customerItemTermStore,
});

export default rootReducer;