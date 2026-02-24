import { create } from 'zustand';
const apiUrl = import.meta.env.VITE_API_URL;

export const useAuthStore = create((set) => ({

    // Estados iniciales
    userData: null,   
    loading: false,
    error: null,

    // Data usuario
    fetchUserData: async () => {
        set({ loading: true });
        try {
            const response = await apiUrl.get("user");
            set({userData: response.data.user, loading: false,});

        } catch (error) {
            if (error.response && error.response.status === 401) {
                set({userData: null, loading: false, error: null});
            } else {
                set({userData: null, loading: false, error: error.message});
            }
        }
    },

    // Logout
    logout: async () => {
        try {
            await apiUrl.post("logout");
            set({ userData: null });
        } catch (error) {
            console.error("Error during logout:", error);
        }
    }
    
}));

