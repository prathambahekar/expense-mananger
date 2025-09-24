const natural = require('natural');
const Expense = require('../models/Expense');

const tokenizer = new natural.WordTokenizer();
const classifier = new natural.BayesClassifier();

const trainClassifier = () => {
  classifier.addDocument('add expense', 'add_expense');
  classifier.addDocument('spend money', 'add_expense');
  classifier.addDocument('show expenses', 'show_expenses');
  classifier.addDocument('list spending', 'show_expenses');
  classifier.addDocument('budget tips', 'budget_suggestions');
  classifier.addDocument('save money', 'budget_suggestions');
  classifier.train();
};

trainClassifier();

const getBudgetSuggestions = async (userId) => {
  const stats = await Expense.aggregate([
    { $match: { userId } },
    { $group: { _id: '$category', total: { $sum: '$amount' } } },
  ]);
  const totalSpending = stats.reduce((sum, stat) => sum + stat.total, 0);
  const highSpending = stats.find(stat => stat.total / totalSpending > 0.4);
  if (highSpending) {
    return `You're spending ${((highSpending.total / totalSpending) * 100).toFixed(0)}% on ${highSpending._id}. Try cutting back by 10% or exploring cheaper alternatives!`;
  }
  return 'Your spending looks balanced. Keep tracking to stay on top!';
};

const processChat = async (req, res) => {
  const { message } = req.body;
  const userId = req.user.id;

  try {
    const tokens = tokenizer.tokenize(message.toLowerCase());
    const intent = classifier.classify(message.toLowerCase());

    let response = '';
    switch (intent) {
      case 'add_expense':
        const amountMatch = message.match(/\$(\d+\.?\d*)/);
        const categoryMatch = tokens.find(t => ['food', 'transport', 'entertainment', 'other', 'groceries'].includes(t));
        const description = tokens.slice(1).join(' ').replace(/\$?\d+\.?\d*/, '').replace(categoryMatch || '', '').trim();
        
        if (amountMatch && categoryMatch && description) {
          const amount = parseFloat(amountMatch[1]);
          const expense = new Expense({
            userId,
            description,
            amount,
            category: categoryMatch.charAt(0).toUpperCase() + categoryMatch.slice(1),
            date: new Date(),
          });
          await expense.save();
          response = `Added $${amount} for ${description} to ${categoryMatch}. Anything else?`;
        } else {
          response = 'Please use format: "add $amount description to category" (e.g., "add $10 coffee to Food").';
        }
        break;

      case 'show_expenses':
        const expenses = await Expense.find({ userId }).sort({ date: -1 }).limit(5);
        if (expenses.length === 0) {
          response = 'No expenses found. Try adding some!';
        } else {
          response = 'Recent expenses:\n' + expenses.map(e => `- ${e.description}: $${e.amount.toFixed(2)} (${e.category})`).join('\n');
        }
        break;

      case 'budget_suggestions':
        response = await getBudgetSuggestions(userId);
        break;

      default:
        response = 'Sorry, I didn’t understand. Try "add expense", "show expenses", or "budget tips".';
    }

    res.json({ message: response });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong. Try again!' });
  }
};

module.exports = { processChat };