const API_BASE_URL = 'http://localhost:8000';

export const authService = {
    signup: async (signUpDetails) => {
        try{
            const response = await fetch(`${API_BASE_URL}/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(signUpDetails),
            });

            if (!response.ok){
                const error = await response.json();
                throw new Error(error.detail || 'Signup failed');
            }

            return await response.json();   
        }
        catch (error) {
            throw error;
        }
    },

    login: async (loginDetails) => {
        try{
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginDetails),
            });
            if (!response.ok){
                const error = await response.json();
                throw new Error(error.detail || 'Login failed');
            }
            const data = await response.json();
            if (data.token) {
                localStorage.setItem('authToken', data.token); //store token in local storage
            }
            return data;
        }
        catch (error) {
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('authToken'); //remove token from local storage
    },

    getToken: () => {
        return localStorage.getItem('authToken'); //retrieve token from local storage
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('authToken'); //check if token exists
    },

    getProtectedData: async () => {
        const token = authService.getToken();

        try{
            const response = await fetch(`${API_BASE_URL}/protected`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if(!response.ok){
                const error = await response.json();
                throw new Error(error.detail || 'Failed to fetch protected data');
            }
            return await response.json();
        }catch (error) {
            throw error;
        }
    }
};