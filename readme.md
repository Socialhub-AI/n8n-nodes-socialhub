# n8n-nodes-socialhub

n8n custom node for integrating with SocialHub system. Provides comprehensive member management, customer management, order management, points management, and master data management functionality.

English | [中文](README_CN.md)

## Features

### Member Management
- **Query Loyalty Program List**: Get all available member loyalty programs
- **Query Customer Member Account List**: Paginated query of specified customer member account information
- **Query Specific Member Account**: Get detailed member information by member card number
- **Customer Membership**: Process customer membership enrollment with support for phone, email, employee ID and other identifier types

### Customer Management
- **Create Customer Information**: Create new customer records
- **Import Customer Event Data**: Import customer event data for analytics
- **Query Customer Information**: Retrieve customer information by customer code
- **Update Customer Information**: Update existing customer details
- **Bind Customer Third-Party Account**: Link customer accounts with third-party platforms
- **Query Third-Party Accounts by Union ID**: Retrieve third-party account information

### Order Management
- **Paginated Query Customer Transaction List**: Get specified customer's historical transaction records
- **Query Transaction Details**: Get detailed transaction information by transaction number
- **Transaction Synchronization**: Synchronize transaction information with the system

### Points Management
- **Query Member Points Account List**: Get all points accounts of specified member
- **Paginated Query Points Detail List**: View detailed points account transaction records
- **Adjust Member Points**: Perform points adjustment operations (increase/decrease)

### Master Data Management
- **Batch Add Products**: Batch synchronization of product information
- **Add Store**: Add new store information to the system

## Installation

### Community Node Installation

1. Go to "Community Nodes" in n8n settings
2. Enter package name: `n8n-nodes-socialhub`
3. Click install

### Manual Installation

```bash
# Clone the project
git clone <repository-url>
cd n8n-nodes-socialhub

# Install dependencies
npm install

# Build the project
npm run build

# Link to n8n
npm link
cd ~/.n8n/custom
npm link n8n-nodes-socialhub
```

## Configuration

### Credentials Setup

1. Create new credentials in n8n
2. Select "SocialHub API"
3. Fill in the following information:
   - **Base URL**: SocialHub API root address (default: `https://s1.socialhub.ai/openapi-prod`)
   - **App ID**: SocialHub application ID
   - **App Secret**: SocialHub application secret

> Note: This node uses OAuth2 authentication and automatically handles access token retrieval and refresh.

### Node Usage

1. Add "SocialHub" node to your workflow
2. Select the configured SocialHub API credentials
3. Choose resource type:
   - **Member Management**: Member center related functions
   - **Customer Management**: Customer center related functions
   - **Order Management**: Order transaction related functions
   - **Points Management**: Points center related functions
   - **Master Data Management**: Master data center related functions
4. Based on the selected resource type, choose specific operation
5. Fill in required parameters (such as customer code, member card number, etc.)

## API Endpoints

### Authentication
- `POST /v1/auth/token` - Get access token
- `POST /v1/auth/refreshToken` - Refresh access token

### Member Management
- `GET /v1/member/loyaltyprograms` - Query loyalty program list
- `GET /v1/member/list/{consumerCode}` - Query customer member account list
- `GET /v1/member/{cardNo}` - Query specific member account
- `POST /v1/member/admission` - Customer membership enrollment

### Customer Management
- `POST /v1/consumer/createInfo` - Create customer information
- `POST /v1/consumer/importEventData` - Import customer event data
- `GET /v1/consumer/queryInfo/{consumerCode}` - Query customer information
- `PUT /v1/consumer/updateInfo/{consumerCode}` - Update customer information
- `POST /v1/consumer/bindThirdAccount` - Bind customer third-party account
- `GET /v1/consumer/queryThirdAccounts/{unionId}` - Query third-party accounts by union ID

### Order Management
- `POST /v1/transactions/page/{consumerCode}` - Paginated query customer transaction list
- `POST /v1/transaction/{orderCode}` - Query transaction details
- `POST /v1/transaction/sync` - Transaction synchronization

### Points Management
- `GET /v1/points/pointsAccount/{cardNo}` - Query member points account list
- `GET /v1/points/pointsRecords/{accountCode}` - Paginated query points detail list
- `POST /v1/points/adjustment` - Adjust member points

### Master Data Management
- `POST /v1/masterdata/product/batchSync` - Batch add products
- `POST /v1/masterdata/store/save` - Add store information

## Usage Examples

### Member Management Examples

#### Query Loyalty Program List
```json
{
  "resource": "member",
  "operation": "getLoyaltyPrograms"
}
```

#### Query Customer Member Account List
```json
{
  "resource": "member",
  "operation": "getMemberList",
  "consumerCode": "CUSTOMER001",
  "pageNo": 1,
  "pageSize": 10,
  "loyaltyCode": "LOYALTY001"
}
```

#### Customer Membership Enrollment
```json
{
  "resource": "member",
  "operation": "memberAdmission",
  "loyaltyCode": "LOYALTY001",
  "phonePrefCode": "+86",
  "mobilePhone": "13800138000",
  "memberName": "John Doe",
  "storeCode": "STORE001",
  "sourceCode": "10140001"
}
```

### Customer Management Examples

#### Create Customer Information
```json
{
  "resource": "consumer",
  "operation": "createConsumer",
  "name": "John Doe",
  "gender": 1,
  "birthday": "1990-01-01",
  "email": "john.doe@example.com",
  "mobilePhone": "13800138000"
}
```

#### Update Customer Information
```json
{
  "resource": "consumer",
  "operation": "updateConsumer",
  "consumerCode": "CUSTOMER001",
  "name": "John Smith",
  "email": "john.smith@example.com",
  "gender": 1
}
```

### Order Management Examples

#### Paginated Query Customer Transaction List
```json
{
  "resource": "order",
  "operation": "getTransactionList",
  "consumerCode": "CUSTOMER001",
  "pageNo": 1,
  "pageSize": 20
}
```

#### Transaction Synchronization
```json
{
  "resource": "order",
  "operation": "syncTransaction",
  "type": 1,
  "params": "13800138000",
  "phonePrefCode": "+86",
  "source": 1,
  "transactionCode": "TXN001",
  "storeCode": "STORE001",
  "orderDate": "2024-01-01 10:00:00"
}
```

### Points Management Examples

#### Query Member Points Account List
```json
{
  "resource": "points",
  "operation": "getPointsAccount",
  "cardNo": "CARD001"
}
```

#### Adjust Member Points
```json
{
  "resource": "points",
  "operation": "adjustPoints",
  "accountType": 1,
  "cardNo": "CARD001",
  "adjustmentType": 1,
  "points": 100,
  "reason": "Event reward"
}
```

### Master Data Management Examples

#### Add Store Information
```json
{
  "resource": "masterdata",
  "operation": "saveStore",
  "storeNickname": "Downtown Store",
  "storeName": "Main Street Store",
  "storeCategory": 1,
  "storeType": 1,
  "storeStatus": 1
}
```

## Parameter Description

### Common Parameters
- `pageNo`: Page number, starting from 1
- `pageSize`: Page size, maximum value is 100

### Member Management Parameters
- `consumerCode`: Customer code (required)
- `cardNo`: Member card number (required)
- `loyaltyCode`: Loyalty program code
- `phonePrefCode`: Phone number prefix (required for membership enrollment)
- `mobilePhone`: Mobile phone number
- `email`: Email address
- `memberName`: Member name
- `storeCode`: Store code
- `sourceCode`: Customer source code

### Customer Management Parameters
- `consumerCode`: Customer code (required)
- `name`: Customer name
- `gender`: Gender (0=Unknown, 1=Male, 2=Female)
- `birthday`: Birthday (YYYY-MM-DD format)
- `email`: Email address
- `mobilePhone`: Mobile phone number
- `postalCode`: Postal code
- `address`: Address
- `unionId`: Third-party account ID (e.g., WeChat OpenID)
- `nickName`: Third-party account nickname
- `timestamp`: Current timestamp in milliseconds
- `nonceId`: Random ID for request

### Order Management Parameters
- `consumerCode`: Customer code (required)
- `orderCode`: Transaction number (required)
- `type`: Member identifier type (1=Phone, 2=Email, 3=Employee ID)
- `params`: Member identifier parameter (based on type)
- `phonePrefCode`: Phone number prefix (required when type=1)
- `source`: Order source channel
- `transactionCode`: Transaction code
- `storeCode`: Store code
- `orderDate`: Order date (YYYY-MM-DD HH:MM:SS format)
- `direction`: Transaction direction (0=Normal, 1=Return, 2=Exchange)
- `orderStatus`: Order status (0=Paid, 1=Shipped, 2=Delivered, 3=Returned)

### Points Management Parameters
- `cardNo`: Member card number (required)
- `accountCode`: Points account code (required)
- `accountType`: Account type (1=Card Number, 2=Account Code)
- `adjustmentType`: Adjustment type (1=Increase, 2=Decrease)
- `points`: Points amount
- `reason`: Adjustment reason
- `pointsGroupCode`: Points group code
- `status`: Record status (0=Active, 1=Inactive, 2=Expired)

### Master Data Management Parameters
- `storeNickname`: Store nickname
- `storeName`: Store name
- `storeCategory`: Store category
- `storeType`: Store type
- `storeStatus`: Store status

## Development

### Requirements
- Node.js >= 16
- TypeScript >= 4.8
- n8n >= 0.190.0

### Development Commands

```bash
# Development mode (watch file changes)
npm run dev

# Build project
npm run build

# Code formatting
npm run format

# Code linting
npm run lint

# Fix code issues
npm run lintfix
```

### Project Structure

```
n8n-nodes-socialhub/
├── credentials/
│   └── SocialHubApi.credentials.ts    # SocialHub API OAuth2 Credentials
├── nodes/
│   ├── SocialHub.node.ts             # SocialHub Nodes
│   └── socialhub.svg                 # Icon for SocialHub Node
├── dist/                             # Compiled output directory
│   ├── credentials/
│   │   └── SocialHubApi.credentials.js
│   └── nodes/
│       ├── SocialHub.node.js
│       └── socialhub.svg
├── package.json                      # Project configuration and dependencies
├── tsconfig.json                    # TypeScript configuration
├── gulpfile.js                      # Build configuration
├── .gitignore                       # Git ignore file
└── README.md                        # Project description document
```

## License

MIT License

## Contributing

Welcome to submit Issue and Pull Request to improve this project.

## Support

If you encounter any problems while using this project, please refer to the following methods to get help:

1. Check the [n8n official documentation](https://docs.n8n.io/)
2. Submit a [GitHub Issue](https://github.com/yourusername/n8n-nodes-socialhub/issues)
3. Contact the technical support team via email: [socialhub@techsun.com](mailto:socialhub@techsun.com)
