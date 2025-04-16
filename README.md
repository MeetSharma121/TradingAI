# 🚀 Trading AI Application

A powerful trading platform powered by AI and machine learning for stock predictions and analysis.

## 🌟 Features

- 🤖 AI-powered stock predictions using TensorFlow.js
- 📈 Real-time stock data and analysis
- 🔐 Secure user authentication with JWT
- 💾 MongoDB database integration
- 🔄 WebSocket support for real-time updates
- 📱 Responsive and modern UI
- 🔒 Secure API endpoints with Helmet
- 📊 Detailed logging and error handling

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **AI/ML**: TensorFlow.js
- **Authentication**: JWT, bcrypt
- **Real-time**: WebSocket
- **Security**: Helmet, CORS
- **Logging**: Morgan

## 🚀 Getting Started

### Prerequisites

- Node.js (>=14.0.0)
- MongoDB Atlas account
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd trading-ai
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=3000
NODE_ENV=development
```

4. Start the development server:
```bash
npm run dev
```

## 📸 Screenshots
<img width="1470" alt="Screenshot 2025-04-16 at 3 45 14 PM" src="https://github.com/user-attachments/assets/f7990a44-8162-4423-a44a-ba7374e269ab" />
<img width="1470" alt="Screenshot 2025-04-16 at 3 45 49 PM" src="https://github.com/user-attachments/assets/64f8b404-e423-4e4d-aa9f-c9498ad59f81" />
<img width="1470" alt="Screenshot 2025-04-16 at 3 45 30 PM" src="https://github.com/user-attachments/assets/81c0c4ef-5930-425e-aeb7-dfaa28fbc8a7" />
<img width="1442" alt="Screenshot 2025-04-16 at 3 45 38 PM" src="https://github.com/user-attachments/assets/888eb3b2-e918-4f22-9f37-df0806718252" />
<img width="852" alt="Screenshot 2025-04-16 at 3 46 04 PM" src="https://github.com/user-attachments/assets/fd79ae28-fa7e-473a-a22f-660225d3051e" />
<img width="811" alt="Screenshot 2025-04-16 at 3 47 33 PM" src="https://github.com/user-attachments/assets/f321f831-e861-445b-bd7d-24df7fcd1a32" />




## 📦 Project Structure

```
trading-ai/
├── public/           # Static files
├── routes/           # API routes
├── services/         # Business logic
├── models/           # Database models
├── server.js         # Main application file
└── package.json      # Project dependencies
```

## 🔧 Configuration

- MongoDB connection string in `.env`
- JWT secret for authentication
- Port configuration
- Environment settings

## 🚨 Error Handling

- Detailed error logging
- Graceful MongoDB reconnection
- WebSocket error handling
- API error responses

## 🔒 Security Features

- JWT authentication
- Password hashing with bcrypt
- Helmet security headers
- CORS configuration
- Input validation

## 📡 API Endpoints

- `/api/auth` - Authentication routes
- `/api/stocks` - Stock data and predictions
- `/api/contact` - Contact form submission
- `/health` - Health check endpoint

## 🧪 Testing

```bash
npm test
```

## 🚀 Deployment

1. Create a Heroku account
2. Install Heroku CLI
3. Deploy using:
```bash
heroku create
git push heroku main
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Your Name

## 🙏 Acknowledgments

- TensorFlow.js team
- MongoDB Atlas
- Express.js community

## �� Happy Coding! 🎉 
