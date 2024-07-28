const Expense = require('../models/expense');

exports.generateBalanceSheet = async () => {
    const expenses = await Expense.find();
    let csv = 'UserId,Amount\n';

    expenses.forEach(expense => {
        expense.participants.forEach(participant => {
            csv += `${participant.userId},${participant.amount}\n`;
        });
    });

    return csv;
};
