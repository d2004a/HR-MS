const User = require('../models/User');

/**
 * Accrue monthly leave for a single user.
 * Each employee gets 1 leave per month. If they haven't been accrued
 * for the current month, add 1 to their balance.
 */
const accrueMonthlyLeave = async (userId) => {
    const user = await User.findById(userId);
    if (!user || user.role === 'admin') return user;

    const now = new Date();
    const currentMonth = now.getMonth(); // 0-11
    const currentYear = now.getFullYear();

    // First, check year-end lapse
    if (user.leaveYear && user.leaveYear < currentYear) {
        // Lapse all leaves from previous year and reset
        console.log(`[ACCRUAL] Year-end lapse for ${user.fullName}: ${user.leaveBalance} days lapsed`);
        user.leaveBalance = 0;
        user.leaveYear = currentYear;
        user.lastLeaveAccrualDate = null; // Reset so current year accrual starts fresh
    }

    // Check if already accrued for this month
    if (user.lastLeaveAccrualDate) {
        const lastAccrual = new Date(user.lastLeaveAccrualDate);
        if (lastAccrual.getMonth() === currentMonth && lastAccrual.getFullYear() === currentYear) {
            // Already accrued this month
            return user;
        }
    }

    // Accrue: add 1 leave for each missed month since last accrual
    let monthsToAccrue = 1;
    
    if (user.lastLeaveAccrualDate) {
        const lastAccrual = new Date(user.lastLeaveAccrualDate);
        // Calculate number of months missed
        const monthsDiff = (currentYear - lastAccrual.getFullYear()) * 12 + (currentMonth - lastAccrual.getMonth());
        monthsToAccrue = Math.max(monthsDiff, 1);
    }

    // Cap at 12 months max accrual per year
    monthsToAccrue = Math.min(monthsToAccrue, 12);
    
    // Max balance cannot exceed 12 (1 per month for the year)
    const maxBalance = 12;
    const newBalance = Math.min(user.leaveBalance + monthsToAccrue, maxBalance);
    
    console.log(`[ACCRUAL] ${user.fullName}: +${monthsToAccrue} leave(s), balance: ${user.leaveBalance} → ${newBalance}`);
    
    user.leaveBalance = newBalance;
    user.lastLeaveAccrualDate = now;
    user.leaveYear = currentYear;
    await user.save();

    return user;
};

/**
 * Check if user has already taken a leave this month.
 * Returns the count of approved leaves in the current month.
 */
const getLeavesThisMonth = async (userId) => {
    const Leave = require('../models/Leave');
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const approvedLeaves = await Leave.find({
        employee: userId,
        status: 'approved',
        startDate: { $lte: endOfMonth },
        endDate: { $gte: startOfMonth }
    });

    return approvedLeaves.length;
};

/**
 * Run accrual for all employees (batch operation on startup).
 */
const runAccrualForAllUsers = async () => {
    try {
        const employees = await User.find({ role: 'employee' });
        console.log(`[ACCRUAL] Running monthly accrual for ${employees.length} employees...`);
        
        for (const employee of employees) {
            await accrueMonthlyLeave(employee._id);
        }
        
        console.log('[ACCRUAL] Monthly accrual complete.');
    } catch (error) {
        console.error('[ACCRUAL] Error during batch accrual:', error.message);
    }
};

module.exports = {
    accrueMonthlyLeave,
    getLeavesThisMonth,
    runAccrualForAllUsers
};
