console.log('Testing nodemailer...');
const nodemailer = require('nodemailer');
console.log('Loaded nodemailer');
console.log('Type:', typeof nodemailer);
console.log('Has createTransporter:', typeof nodemailer.createTransporter);
console.log('Keys:', Object.keys(nodemailer));
