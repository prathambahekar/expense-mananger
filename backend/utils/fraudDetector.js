const { spawn } = require('child_process');
const path = require('path');

const detectFraud = (expenseData) => {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python3', [
      path.join(__dirname, 'ml_predict.py'),
      JSON.stringify(expenseData),
    ]);

    let output = '';
    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      reject(new Error(`Python error: ${data}`));
    });

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        try {
          const result = JSON.parse(output);
          resolve({ isFraudulent: result.riskScore > 0.5, riskScore: result.riskScore });
        } catch (err) {
          reject(err);
        }
      } else {
        reject(new Error('Prediction failed'));
      }
    });
  });
};

module.exports = detectFraud;