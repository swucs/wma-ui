const initialState = {
    searchWord: {
        name: null,
    }, 
	isDetailModalVisible: false,	//상세 Modal창 출력여부
	items: [],					    //품목목록
	detailItem: {},				    //품목상세데이터
	isListLoadingBar: false,		//목록 로딩바
	isDetailLoadingBar: false,		//상세 로딩바
};


//Action creator
export const queryItems = (data) => {
    return {
        type: 'QUERY_ITEMS',
        data
    };
};

//품목목록 출력
export const setItems = (data) => {
    return {
        type: 'SET_ITEMS',
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

//상세 품목정보 세팅
export const setDetailItem = (data) => {
    return {
        type: 'SET_DETAIL_ITEM',
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


export const itemStore = (state = initialState, action) => {
    switch (action.type) {
        case 'QUERY_ITEMS': {
            return {
                ...state,
                searchWord: {
                    name: action.data.name,
                }
            }
        }
		case 'SET_ITEMS': {
            return {
                ...state,
                items: [...action.data],
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
		case 'SET_DETAIL_ITEM': {
            return {
                ...state,
                detailItem: {...action.data},
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

export default itemStore;