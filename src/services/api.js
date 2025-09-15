const DATABASE_URL = 'http://10.3.10.98:5000';

export async function getLayoutData() {
    const response = await fetch(`${DATABASE_URL}/layout-data`);
    if (!response.ok) {
        // Return mock data if API is not available
        return {
            desks: [
                {
                    id: 1,
                    x: 20,
                    y: 30,
                    w: 8,
                    h: 6,
                    occupant: 'John Smith',
                    breaks: '10:30, 15:00',
                    department: 'Re-Engagement',
                    sales: '0',
                    teamLead: 'Jane Doe',
                    color: '#3b82f6'
                }
            ],
            darkMode: false,
            layoutWidth: 90,
            zoom: 100,
            aspectRatio: '16/9',
            imageVisible: false,
            backgroundImage: ''
        };
    }
    return response.json();
}

export async function saveLayoutData(layoutData) {
    const response = await fetch(`${DATABASE_URL}/layout-data`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(layoutData)
    });
    
    if (!response.ok) {
        throw new Error('Failed to save layout data');
    }
    
    return response.json();
}

export async function loginUser(username, password) {
    const response = await fetch(`${DATABASE_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
    });
    
    if (!response.ok) {
        throw new Error('Login failed');
    }
    
    return response.json();
}

