import create from 'zustand';

interface UserState {
    user: User | null;
    updateUser: (update: (prev: User | null) => User | null) => void;
    setUser: (user: User | null) => void;
    editUser: (newUsername: string) => void;
    removeUser: () => void;
}

const getLocalStorage = (key: string): User | null => {
    const storedValue = window.localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : null;
};

const setLocalStorage = (key: string, value: User | null) => {
    window.localStorage.setItem(key, JSON.stringify(value));
};

const useStore = create<UserState>((set) => ({
    user: getLocalStorage('user'),
    setUser: (user: User | null) => {
        set(() => {
            setLocalStorage('user', user);
            return { user };
        });
    },
    updateUser: (update: (prev: User | null) => User | null) => {
        set((state) => {
            const updatedUser = update(state.user);
            setLocalStorage('user', updatedUser || null);
            return { user: updatedUser };
        });
    },
    editUser: (newUsername: string) => {
        set((state) => {
            if (state.user) {
                const updatedUser = { ...state.user, username: newUsername };
                setLocalStorage('user', updatedUser);
                return { user: updatedUser };
            }
            return state;
        });
    },
    removeUser: () => {
        set(() => {
            setLocalStorage('user', null);
            return { user: null };
        });
    },
}));

export const useUserStore = useStore;
