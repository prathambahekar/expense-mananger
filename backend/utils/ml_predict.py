import sys
import json
import os
import pickle
import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import LabelEncoder

MODEL_PATH = 'fraud_model.pkl'
ENCODER_PATH = 'category_encoder.pkl'

# ---------------------------
# Load or train model & encoder
# ---------------------------
if os.path.exists(MODEL_PATH) and os.path.exists(ENCODER_PATH):
    with open(MODEL_PATH, 'rb') as f:
        model = pickle.load(f)
    with open(ENCODER_PATH, 'rb') as f:
        le_category = pickle.load(f)
else:
    print("Training initial model...")
    np.random.seed(42)
    n_samples = 1000

    # synthetic numeric features (matching later usage)
    data = {
        'amount': np.random.lognormal(3, 1, n_samples),
        'category_encoded': np.random.randint(0, 5, n_samples),
        'day_of_week': np.random.randint(0, 7, n_samples),
        'month': np.random.randint(1, 13, n_samples),
    }

    # Inject some synthetic fraud
    fraud_indices = np.random.choice(n_samples, size=50, replace=False)
    data['amount'][fraud_indices] *= 5

    df = pd.DataFrame(data)
    X = df[['amount', 'category_encoded', 'day_of_week', 'month']]

    model = IsolationForest(contamination=0.05, random_state=42)
    model.fit(X)

    le_category = LabelEncoder()
    le_category.fit(['Food', 'Transport', 'Entertainment', 'Other', 'Groceries'])

    with open(MODEL_PATH, 'wb') as f:
        pickle.dump(model, f)
    with open(ENCODER_PATH, 'wb') as f:
        pickle.dump(le_category, f)


# ---------------------------
# Helper: safe category encode
# ---------------------------
def safe_encode_category(category, le):
    """
    Return an integer encoding for `category`:
      - if category seen by LabelEncoder -> its encoded value
      - else fallback to 'Other' (if present)
      - else return new integer = max_seen + 1 (so numeric model can still use it)
      - if encoder has no classes, return 0
    """
    if category is None:
        return -1

    # Try direct transform first (fast path)
    try:
        return int(le.transform([category])[0])
    except Exception:
        # Build a mapping from classes_
        classes = list(getattr(le, "classes_", []))
        if not classes:
            return 0
        mapping = {c: i for i, c in enumerate(classes)}
        if category in mapping:
            return mapping[category]
        # fallback to 'Other' if the encoder was trained with it
        if "Other" in mapping:
            return mapping["Other"]
        # otherwise assign a new index (safe numeric)
        return max(mapping.values()) + 1


# ---------------------------
# Main prediction function
# ---------------------------
def predict_fraud(expense_json: str):
    expense = json.loads(expense_json)

    # safe category encoding
    category_raw = expense.get('category', None)
    category_encoded = safe_encode_category(category_raw, le_category)

    # safe date parsing -> defaults to now if invalid/missing
    date_raw = expense.get('date', None)
    try:
        dt = pd.to_datetime(date_raw)
    except Exception:
        dt = pd.Timestamp.now()

    features = {
        'amount': float(expense.get('amount', 0.0)),
        'category_encoded': int(category_encoded),
        'day_of_week': int(dt.dayofweek),
        'month': int(dt.month),
    }

    X_pred = pd.DataFrame([features])

    # IsolationForest scoring and prediction
    try:
        score_raw = -model.score_samples(X_pred)[0]  # higher => more anomalous
        pred = int(model.predict(X_pred)[0])         # -1 anomaly, 1 normal
    except Exception as e:
        raise RuntimeError(f"Model scoring failed: {e}")

    # Only use positive anomaly magnitude to compute risk; clamp to [0,1]
    score_pos = max(0.0, float(score_raw))
    risk_score = score_pos / (1.0 + score_pos)  # maps 0..∞ -> 0..1
    risk_score = float(np.clip(risk_score, 0.0, 1.0))

    return {
        'riskScore': round(risk_score, 4),
        'isAnomaly': (pred == -1)
    }


# ---------------------------
# CLI entry
# ---------------------------
if __name__ == '__main__':
    if len(sys.argv) > 1:
        try:
            result = predict_fraud(sys.argv[1])
            print(json.dumps(result))
        except Exception as e:
            print(json.dumps({'error': str(e)}))
    else:
        print(json.dumps({'error': 'No input data'}))
