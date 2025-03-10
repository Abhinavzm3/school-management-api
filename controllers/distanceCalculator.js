import pool from '../config/db.js';

// Helper function to calculate distance using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius in km
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
        
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return R * c;
}

function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

export const addSchool = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { name, address, latitude, longitude } = req.body;
        const connection = await pool.getConnection();
        
        const [result] = await connection.query(
            'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)',
            [name, address, latitude, longitude]
        );
        
        connection.release();
        res.status(201).json({
            message: 'School added successfully',
            schoolId: result.insertId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const listSchools = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const userLat = parseFloat(req.query.latitude);
        const userLon = parseFloat(req.query.longitude);
        const connection = await pool.getConnection();
        
        const [schools] = await connection.query('SELECT * FROM schools');
        connection.release();

        const schoolsWithDistance = schools.map(school => ({
            ...school,
            distance: calculateDistance(
                userLat,
                userLon,
                school.latitude,
                school.longitude
            )
        }));

        schoolsWithDistance.sort((a, b) => a.distance - b.distance);
        
        res.json(schoolsWithDistance);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};