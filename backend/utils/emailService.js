/**
 * Simulated Email Service
 * In a real-world scenario, you would use a library like nodemailer 
 * or a service like SendGrid/Mailchimp here.
 */

const sendWelcomeEmail = async (userEmail, userName) => {
    console.log('\n' + '='.repeat(50));
    console.log('📧 MOCK EMAIL NOTIFICATION');
    console.log('='.repeat(50));
    console.log(`To: ${userEmail}`);
    console.log('Subject: Welcome to HRMS - Your Registration is Successful!');
    console.log('-'.repeat(50));
    console.log(`Hello ${userName},`);
    console.log('\nWelcome to our Employee Leave & Attendance Management System!');
    console.log('Your account has been created successfully. You can now login to:');
    console.log('1. Mark your daily attendance.');
    console.log('2. Apply for leaves.');
    console.log('3. Track your leave balance.');
    console.log('\nWe are glad to have you on board!');
    console.log('\nBest Regards,');
    console.log('HR Team, HRMS');
    console.log('='.repeat(50) + '\n');
};

module.exports = {
    sendWelcomeEmail
};
