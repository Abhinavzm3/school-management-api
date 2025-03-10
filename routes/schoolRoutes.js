require('dotenv').config()

const express = require('express')
const cors=require('cors')
const schoolRoutes = require('./routes/schoolRoutes');

const app=express()

app.use(cors())

app.use(express.json())

app.use('/api/v1/schools',schoolRoutes)

const PORT=process.env.PORT || 3000

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})