import { createContext, useReducer, useContext } from 'react';

const initialState = {
    user: null,
    token: null,
};

const UserContext = createContext();

function userReducer(state, action) {
    switch (action.type) {
        case 'LOGIN':
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token
            };
        case 'LOGOUT':
            return { ...state, user: null, token: null };
        default:
            return state;
    }
}

export function UserProvider({ children }) {
    const [state, dispatch] = useReducer(userReducer, initialState, () => {
        const user = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (user && token) {
            return { user: JSON.parse(user), token: token };
        } else {
            return initialState;
        }
    });

    const login = (userData, token) => {
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', token);
        dispatch({ type: 'LOGIN', payload: { user: userData, token: token } });
    };

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        dispatch({ type: 'LOGOUT' });
    };

    return (
        <UserContext.Provider value={{
            user: state.user,
            token: state.token,
            login,
            logout
        }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}
