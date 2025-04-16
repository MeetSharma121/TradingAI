class AuthService {
    constructor() {
        this.token = localStorage.getItem('token');
        this.user = JSON.parse(localStorage.getItem('user'));
    }

    async login(email, password) {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to login');
            }

            this.token = data.token;
            this.user = data.user;
            localStorage.setItem('token', this.token);
            localStorage.setItem('user', JSON.stringify(this.user));

            return data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    async signup(userData) {
        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to create account');
            }

            this.token = data.token;
            this.user = data.user;
            localStorage.setItem('token', this.token);
            localStorage.setItem('user', JSON.stringify(this.user));

            return data;
        } catch (error) {
            console.error('Signup error:', error);
            throw error;
        }
    }

    logout() {
        this.token = null;
        this.user = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
    }

    isAuthenticated() {
        return !!this.token;
    }

    getUser() {
        return this.user;
    }

    getToken() {
        return this.token;
    }

    async getProfile() {
        try {
            const response = await fetch('/api/auth/profile', {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            if (response.ok) {
                this.user = await response.json();
                return this.user;
            }
            throw new Error('Failed to fetch profile');
        } catch (error) {
            console.error('Profile fetch error:', error);
            throw error;
        }
    }

    async addFavoriteStock(symbol) {
        try {
            const response = await fetch('/api/auth/favorites', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify({ symbol })
            });

            if (response.ok) {
                return await response.json();
            }
            throw new Error('Failed to add favorite stock');
        } catch (error) {
            console.error('Add favorite error:', error);
            throw error;
        }
    }

    async removeFavoriteStock(symbol) {
        try {
            const response = await fetch(`/api/auth/favorites/${symbol}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            if (response.ok) {
                return await response.json();
            }
            throw new Error('Failed to remove favorite stock');
        } catch (error) {
            console.error('Remove favorite error:', error);
            throw error;
        }
    }

    async getPredictionHistory() {
        try {
            const response = await fetch('/api/auth/predictions', {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            if (response.ok) {
                return await response.json();
            }
            throw new Error('Failed to fetch prediction history');
        } catch (error) {
            console.error('Prediction history error:', error);
            throw error;
        }
    }
}

// Create a global instance
const authService = new AuthService();

// Export for use in other files
window.authService = authService;