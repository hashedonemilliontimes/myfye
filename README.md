# MyFye - Web3 Financial Platform

MyFye is a comprehensive Web3 financial platform that enables users to manage cryptocurrencies, stocks, and traditional financial assets in one unified application. The platform supports cross-chain transactions, on/off-ramp services, and integrates with multiple blockchain networks.

## 🏗️ Architecture

### Frontend (React + TypeScript)
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **State Management**: Redux Toolkit
- **UI Components**: Custom design system with Emotion CSS
- **Authentication**: Privy Web3 Auth
- **Charts**: Nivo and Highcharts for data visualization
- **Animations**: Motion library for smooth transitions

### Backend (Node.js + Express)
- **Runtime**: Node.js with Express
- **Database**: PostgreSQL
- **Security**: Rate limiting, CORS, API key validation
- **Email**: SendGrid integration
- **Blockchain**: Solana Web3.js and Viem for EVM

## 📁 Project Structure

```
myfye/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── features/        # Feature-based modules
│   │   │   ├── assets/      # Asset management
│   │   │   ├── authentication/ # Auth & user management
│   │   │   ├── compliance/  # KYC & compliance
│   │   │   ├── contacts/    # Contact management
│   │   │   ├── onOffRamp/   # Fiat on/off ramp
│   │   │   ├── pay/         # Payment functionality
│   │   │   ├── receive/     # Receive payments
│   │   │   ├── send/        # Send payments
│   │   │   ├── swap/        # Asset swapping
│   │   │   └── users/       # User management
│   │   ├── pages/           # Page components
│   │   ├── shared/          # Shared components
│   │   └── redux/           # State management
│   └── public/              # Static assets
├── backend/                  # Node.js backend API
│   ├── routes/              # API endpoints
│   │   ├── bridge_swap/     # Cross-chain bridge
│   │   ├── dinari_shares/   # Stock trading
│   │   ├── onOffRamp/       # Fiat services
│   │   ├── sol_transaction/ # Solana transactions
│   │   └── transactions/    # Transaction management
│   └── db.js               # Database configuration
└── docs/                    # Documentation
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ 
- PostgreSQL 12+
- npm or yarn

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd myfye/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Database setup**
   ```bash
   # Create PostgreSQL database
   createdb myfye_db
   ```

5. **Start the server**
   ```bash
   npm run dev  # Development
   npm start    # Production
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 🔌 API Endpoints

### User Management
- `POST /create_user` - Create new user
- `POST /get_user_by_email` - Get user by email
- `POST /update_evm_pub_key` - Update EVM public key
- `POST /update_solana_pub_key` - Update Solana public key

### Transactions
- `POST /create_swap_transaction` - Create swap transaction
- `POST /create_pay_transaction` - Create payment transaction
- `GET /transaction_history` - Get transaction history

### Blockchain Operations
- `POST /sign_transaction` - Sign Solana transaction
- `POST /bridge_swap` - Cross-chain bridge swap
- `POST /ensure_token_account` - Ensure token account exists

### On/Off Ramp
- `POST /create_new_payin` - Create payment in
- `POST /create_new_bank_account` - Add bank account
- `GET /get_all_receivers` - Get all receivers

### Dinari (Stocks)
- `POST /create_new_dinari_user` - Create Dinari user
- `POST /create_new_wallet` - Create Dinari wallet
- `POST /sign_order` - Sign stock order

## 🚀 Deployment

### Backend Deployment
The backend can be deployed to various platforms:
- **Heroku**: Use the provided Procfile
- **AWS**: Use Elastic Beanstalk or EC2
- **Vercel**: Serverless deployment
- **Railway**: Simple Node.js deployment

### Frontend Deployment
The frontend is optimized for:
- **Vercel**: Zero-config deployment
- **Netlify**: Static site hosting
- **AWS S3 + CloudFront**: CDN deployment
- **Firebase Hosting**: Google's hosting solution

## 🔒 Security Features

- **Rate Limiting**: Prevents API abuse
- **CORS Protection**: Cross-origin request control
- **API Key Validation**: Secure endpoint access
- **IP Geolocation**: Geographic request tracking
- **Input Validation**: Request sanitization
- **Error Logging**: Comprehensive error tracking

## 📊 Monitoring & Analytics

- **Firebase Analytics**: User behavior tracking
- **Error Logging**: Backend error monitoring
- **Transaction Monitoring**: Blockchain transaction tracking
- **Performance Metrics**: Application performance monitoring

## Contributing
???

## License
???

## Support

For support and questions:
- Create an issue in the repository
- Check the documentation in the `docs/` folder


## 🔗 External Integrations

- **Privy**: Web3 authentication
- **Dinari**: Stock trading platform
- **Helius**: Solana RPC provider
- **SendGrid**: Email services
- **Firebase**: Analytics and hosting
- **Blind Pay**: Payment processing
- **Google Maps**: Location services

---

**MyFye** - Empowering financial freedom through Web3 technology.