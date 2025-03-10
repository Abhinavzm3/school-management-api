import { Router } from 'express';
import { body, query, validationResult } from 'express-validator';
import { addSchool, listSchools } from '../controllers/schoolController.js';

const router = Router();

router.post('/addSchool', 
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('address').notEmpty().withMessage('Address is required'),
        body('latitude').isFloat({ min: -90, max: 90 }).withMessage('Invalid latitude'),
        body('longitude').isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude')
    ],
    addSchool
);

router.get('/listSchools',
    [
        query('latitude').isFloat({ min: -90, max: 90 }).withMessage('Invalid latitude'),
        query('longitude').isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude')
    ],
    listSchools
);

export default router;