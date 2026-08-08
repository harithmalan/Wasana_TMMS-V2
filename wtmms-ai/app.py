from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from sklearn.linear_model import LinearRegression

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests from Angular

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        if not data or 'prices' not in data:
            return jsonify({'error': 'Missing "prices" array in request body'}), 400
        
        prices = data['prices']
        if not isinstance(prices, list) or len(prices) < 2:
            return jsonify({'error': '"prices" must be a list of at least 2 numbers'}), 400

        # Prepare data for Linear Regression
        # X will be the week index (0, 1, 2, ...), y will be the prices
        X = np.array(range(len(prices))).reshape(-1, 1)
        y = np.array(prices)

        # Train model
        model = LinearRegression()
        model.fit(X, y)

        # Predict the next week's price (index = len(prices))
        next_week_index = np.array([[len(prices)]])
        predicted_price = model.predict(next_week_index)[0]

        return jsonify({
            'historical_prices': prices,
            'predicted_price': round(float(predicted_price), 2)
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Run on port 5000
    app.run(host='0.0.0.0', port=5000, debug=True)
