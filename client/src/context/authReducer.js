const authReducer = (state, action) => {
    switch (action.type) {
      case 'LOGIN_START':
        return {
          ...state,
          loading: true,
          error: null,
        };
      case 'LOGIN_SUCCESS':
        return {
          ...state,
          user: action.payload,
          loading: false,
          error: null,
        };
      case 'LOGIN_FAIL':
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
      case 'LOGOUT':
        return {
          ...state,
          user: null,
          loading: false,
          error: null,
        };
      default:
        return state;
    }
  };
  
  export default authReducer;