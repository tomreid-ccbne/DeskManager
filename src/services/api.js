const DATABASE_URL = 'http://10.3.10.98:5000';

export async function getLayoutData() {
    const response = await fetch(`${DATABASE_URL}/layout-data`);
    if (!response.ok) {
        throw new Error('Failed to fetch layout data');
    }
    return response.json();
}

// We will add more functions here later for logging in, saving data, etc.

