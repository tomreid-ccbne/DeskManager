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
                    department: 'Engineering',
                    color: '#3b82f6'
                },
                {
                    id: 2,
                    x: 40,
                    y: 30,
                    w: 8,
                    h: 6,
                    occupant: 'Sarah Johnson',
                    department: 'Design',
                    color: '#10b981'
                },
                {
                    id: 3,
                    x: 60,
                    y: 30,
                    w: 8,
                    h: 6,
                    occupant: 'Vacant',
                    department: 'Available',
                    color: '#a0aec0'
                },
                {
                    id: 4,
                    x: 80,
                    y: 30,
                    w: 8,
                    h: 6,
                    occupant: 'Mike Chen',
                    department: 'Marketing',
                    color: '#f59e0b'
                },
                {
                    id: 5,
                    x: 30,
                    y: 60,
                    w: 8,
                    h: 6,
                    occupant: 'Lisa Wong',
                    department: 'HR',
                    color: '#ec4899'
                },
                {
                    id: 6,
                    x: 50,
                    y: 60,
                    w: 8,
                    h: 6,
                    occupant: 'Vacant',
                    department: 'Available',
                    color: '#a0aec0'
                },
                {
                    id: 7,
                    x: 70,
                    y: 60,
                    w: 8,
                    h: 6,
                    occupant: 'David Park',
                    department: 'Sales',
                    color: '#8b5cf6'
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

// We will add more functions here later for logging in, saving data, etc.

