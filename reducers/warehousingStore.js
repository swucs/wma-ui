import moment from 'moment';

//날짜세팅
const now = new Date();
const beforeWeek = new Date(now);
beforeWeek.setDate(now.getDate() - 7);


const initialState = {
    searchWord: {
        baseDateFrom: moment(beforeWeek),   //moment값
        baseDateTo: moment(now),            //moment값
        customerName: null,
        itemName: null,
        warehousingTypeValue: null,
    }, 
	isDetailModalVisible: false,	    //상세 Modal창 출력여부
    isDetailItemModalVisible: false,    //입출고내역 Modal창 출력여부
	warehousings: [],					//거래처목록
	warehousingItem: {},				//거래처상세데이터
    warehousingDetails: [],             //거래처내역목록
    warehousingDetailItem: {},          //거래처내역상세데이터
	isListLoadingBar: false,		    //목록 로딩바
	isDetailLoadingBar: false,		    //상세 로딩바
};


//Action creator
export const queryWarehousings = (data) => {
    return {
        type: 'QUERY_WAREHOUSINGS',
        data
    };
};

//목록 출력
export const setWarehousings = (data) => {
    return {
        type: 'SET_WAREHOUSINGS',
        data
    };
};

//상세 거래처정보 세팅
export const setWarehousingItem = (data) => {
    return {
        type: 'SET_WAREHOUSING_ITEM',
        data
    };
};

//입출력 내역 목록 출력
export const setWarehousingDetails = (data) => {
    return {
        type: 'SET_WAREHOUSING_DETAILS',
        data
    };
};

//입출력 내역 상세
export const setWarehousingDetailItem = (data) => {
    return {
        type: 'SET_WAREHOUSING_DETAIL_ITEM',
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

//상세 MODAL 출력여부
export const setDetailItemModalVisible = (data) => {
    return {
        type: 'SET_DETAIL_ITEM_MODAL_VISIBLE',
        data
    };
};


export const warehousingStore = (state = initialState, action) => {
    switch (action.type) {
        case 'QUERY_WAREHOUSINGS': {
            return {
                ...state,
                searchWord: {
                    baseDateFrom: action.data.baseDateFrom,
                    baseDateTo: action.data.baseDateTo,
                    customerName: action.data.customerName,
                    itemName: action.data.itemName,
                    warehousingTypeValue: action.data.warehousingTypeValue,
                }
            }
        }
		case 'SET_WAREHOUSINGS': {
            return {
                ...state,
                warehousings: [...action.data],
            }
        }
        case 'SET_WAREHOUSING_DETAILS': {
            return {
                ...state,
                warehousingDetails: [...action.data],
            }
        }
        case 'SET_WAREHOUSING_DETAIL_ITEM': {
            return {
                ...state,
                warehousingDetailItem: {...action.data},
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
		case 'SET_WAREHOUSING_ITEM': {
            return {
                ...state,
                warehousingItem: {...action.data},
            }
        }
		case 'SET_DETAIL_LOADING_BAR': {
			return {
                ...state,
                isDetailLoadingBar: action.data,
            }
		}
        case 'SET_DETAIL_ITEM_MODAL_VISIBLE': {
            return {
                ...state,
                isDetailItemModalVisible: action.data,
            }
        }
        default: {
            return {
                ...state,
            }
        }
    }
};

export default warehousingStore;