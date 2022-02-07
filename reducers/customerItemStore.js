const initialState = {
    searchWord: {
        customerId: null,
    }, 
	isDetailModalVisible: false,	//상세 Modal창 출력여부
	customerItems: [],				//거래처별품목목록
	customerItemItem: {},			//거래처별품목상세데이터
	isListLoadingBar: false,		//목록 로딩바
	isDetailLoadingBar: false,		//상세 로딩바
};


//Action creator
export const queryCustomerItems = (data) => {
    return {
        type: 'QUERY_CUSTOMER_ITEMS',
        data
    };
};

//거래처별품목목록 출력
export const setCustomerItems = (data) => {
    return {
        type: 'SET_CUSTOMER_ITEMS',
        data
    };
};

//상세 거래처별품목정보 세팅
export const setCustomerItemItem = (data) => {
    return {
        type: 'SET_CUSTOMER_ITEM_ITEM',
        data
    };
};

//목록 로딩바 출력
export const setListLoadingBar = (data) => {
    return {
        type: 'SET_LIST_LOADING_BAR',
        data
    };
};

//상세 MODAL 출력여부
export const setDetailModalVisible = (data) => {
    return {
        type: 'SET_DETAIL_MODAL_VISIBLE',
        data
    };
};

//상세팝업 로딩바 출력
export const setDetailLoadingBar = (data) => {
    return {
        type: 'SET_DETAIL_LOADING_BAR',
        data
    };
};


export const customerItemStore = (state = initialState, action) => {
    switch (action.type) {
        case 'QUERY_CUSTOMER_ITEMS': {
            return {
                ...state,
                searchWord: {
                    customerId: action.data.customerId,
                }
            }
        }
		case 'SET_CUSTOMER_ITEMS': {
            return {
                ...state,
                customerItems: [...action.data],
            }
        }
		case 'SET_LIST_LOADING_BAR': {
			return {
                ...state,
                isListLoadingBar: action.data,
            }
		}
		case 'SET_DETAIL_MODAL_VISIBLE': {
            return {
                ...state,
                isDetailModalVisible: action.data,
            }
        }
		case 'SET_CUSTOMER_ITEM_ITEM': {
            return {
                ...state,
                customerItemItem: {...action.data},
            }
        }
		case 'SET_DETAIL_LOADING_BAR': {
			return {
                ...state,
                isDetailLoadingBar: action.data,
            }
		}
        default: {
            return {
                ...state,
            }
        }
    }
};

export default customerItemStore;