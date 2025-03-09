type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface FetchOptions extends RequestInit {
    method: RequestMethod;
    headers?: HeadersInit;
    body?: any;
}

// Base fetch client with interceptor-like functionality
const fetchClient = async (url: string, options: FetchOptions = { method: 'GET' }) => {
    // Request interceptor
    const requestInterceptor = async (options: FetchOptions) => {
        // Add default headers
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...options.headers as Record<string, string>,
        };

        // Add auth token if exists
        const token = localStorage.getItem('token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        // Handle request body
        if (options.body) {
            options.body = JSON.stringify(options.body);
        }

        return { ...options, headers };
    };

    // Response interceptor
    const responseInterceptor = async (response: Response) => {
        if (!response.ok) {
            // Handle specific error status
            if (response.status === 401) {
                // Handle unauthorized
                window.location.href = '/login';
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    };

    try {
        // Apply request interceptor
        const interceptedOptions = await requestInterceptor(options);

        // Make the fetch call
        const response = await fetch(`${import.meta.env.VITE_API_URL}${url}`, interceptedOptions);

        // Apply response interceptor
        return await responseInterceptor(response);
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
};

// Helper methods
export const api = {
    get: (url: string) => fetchClient(url),

    post: (url: string, body: any) => fetchClient(url, {
        method: 'POST',
        body
    }),

    put: (url: string, body: any) => fetchClient(url, {
        method: 'PUT',
        body
    }),

    delete: (url: string) => fetchClient(url, {
        method: 'DELETE'
    })
};

export default api; 