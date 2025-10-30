# n8n-nodes-socialhub

n8n 自定义节点，用于集成 SocialHub 系统。提供完整的会员管理、客户管理、订单管理、积分管理和主数据管理功能。

[English](README.md) | 中文

## 功能特性

### 会员管理
- **查询忠诚度体系列表**: 获取所有可用的会员忠诚度计划
- **查询客户会员账号列表**: 分页查询指定客户的会员账号信息
- **查询指定会员账号**: 根据会员卡号获取详细会员信息
- **客户入会**: 为客户办理会员入会，支持手机号、邮箱、员工编号等多种标识类型

### 客户管理
- **创建客户信息**: 创建新的客户记录
- **导入客户事件数据**: 导入客户事件数据用于分析
- **查询客户信息**: 根据客户编码检索客户信息
- **更新客户信息**: 更新现有客户详细信息
- **绑定客户第三方账户**: 将客户账户与第三方平台关联
- **通过联合ID查询第三方账户**: 检索第三方账户信息

### 订单管理
- **分页查询客户交易列表**: 获取指定客户的历史交易记录
- **查询交易单详情**: 根据交易单号获取详细交易信息
- **交易单同步**: 与系统同步交易信息

### 积分管理
- **查询会员积分账户列表**: 获取指定会员的所有积分账户
- **分页查询积分明细列表**: 查看积分账户的详细交易记录
- **调整会员积分**: 执行积分调整操作（增加/减少）

### 主数据管理
- **批量新增商品**: 批量同步商品信息
- **新增门店**: 向系统添加新的门店信息

## 安装

### 社区节点安装

1. 在 n8n 设置中找到 "Community Nodes"
2. 输入包名: `n8n-nodes-socialhub`
3. 点击安装

### 手动安装

```bash
# 克隆项目
git clone <repository-url>
cd n8n-nodes-socialhub

# 安装依赖
npm install

# 构建项目
npm run build

# 链接到 n8n
npm link
cd ~/.n8n/custom
npm link n8n-nodes-socialhub
```

## 配置

### 凭据配置

1. 在 n8n 中创建新的凭据
2. 选择 "SocialHub API"
3. 填写以下信息：
   - **Base URL**: SocialHub API 的根地址 (默认: `https://s1.socialhub.ai/openapi-prod`)
   - **App ID**: SocialHub 应用 ID
   - **App Secret**: SocialHub 应用密钥

> 注意：本节点使用 OAuth2 认证方式，会自动获取和刷新访问令牌。

### 节点使用

1. 在工作流中添加 "SocialHub" 节点
2. 选择已配置的 SocialHub API 凭据
3. 选择资源类型：
   - **会员管理**: 会员中心相关功能
   - **客户管理**: 客户中心相关功能
   - **订单管理**: 订单交易相关功能
   - **积分管理**: 积分中心相关功能
   - **主数据管理**: 主数据中心相关功能
4. 根据选择的资源类型，选择具体操作
5. 填写必要的参数（如客户编码、会员卡号等）

## API 端点

### 认证相关
- `POST /v1/auth/token` - 获取访问令牌
- `POST /v1/auth/refreshToken` - 刷新访问令牌

### 会员管理
- `GET /v1/member/loyaltyprograms` - 查询忠诚度体系列表
- `GET /v1/member/list/{consumerCode}` - 查询客户会员账号列表
- `GET /v1/member/{cardNo}` - 查询指定会员账号
- `POST /v1/member/admission` - 客户入会

### 客户管理
- `POST /v1/consumer/createInfo` - 创建客户信息
- `POST /v1/consumer/importEventData` - 导入客户事件数据
- `GET /v1/consumer/queryInfo/{consumerCode}` - 查询客户信息
- `PUT /v1/consumer/updateInfo/{consumerCode}` - 更新客户信息
- `POST /v1/consumer/bindThirdAccount` - 绑定客户第三方账户
- `GET /v1/consumer/queryThirdAccounts/{unionId}` - 通过联合ID查询第三方账户

### 订单管理
- `POST /v1/transactions/page/{consumerCode}` - 分页查询客户交易列表
- `POST /v1/transaction/{orderCode}` - 查询交易单详情
- `POST /v1/transaction/sync` - 交易单同步

### 积分管理
- `GET /v1/points/pointsAccount/{cardNo}` - 查询会员积分账户列表
- `GET /v1/points/pointsRecords/{accountCode}` - 分页查询积分明细列表
- `POST /v1/points/adjustment` - 调整会员积分

### 主数据管理
- `POST /v1/masterdata/product/batchSync` - 批量新增商品
- `POST /v1/masterdata/store/save` - 新增门店

## 使用示例

### 会员管理示例

#### 查询忠诚度体系列表
```json
{
  "resource": "member",
  "operation": "getLoyaltyPrograms"
}
```

#### 查询客户会员账号列表
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

#### 客户入会
```json
{
  "resource": "member",
  "operation": "memberAdmission",
  "loyaltyCode": "LOYALTY001",
  "phonePrefCode": "+86",
  "mobilePhone": "13800138000",
  "memberName": "张三",
  "storeCode": "STORE001",
  "sourceCode": "10140001"
}
```

### 客户管理示例

#### 创建客户信息
```json
{
  "resource": "consumer",
  "operation": "createConsumer",
  "name": "张三",
  "gender": 1,
  "birthday": "1990-01-01",
  "email": "zhangsan@example.com",
  "mobilePhone": "13800138000"
}
```

#### 更新客户信息
```json
{
  "resource": "consumer",
  "operation": "updateConsumer",
  "consumerCode": "CUSTOMER001",
  "name": "李四",
  "email": "lisi@example.com",
  "gender": 1
}
```

### 订单管理示例

#### 分页查询客户交易列表
```json
{
  "resource": "order",
  "operation": "getTransactionList",
  "consumerCode": "CUSTOMER001",
  "pageNo": 1,
  "pageSize": 20
}
```

#### 交易单同步
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
  "orderDate": "2024-01-01 10:00:00",
  "direction": 0,
  "orderStatus": 0,
  "totalPrice": 10000,
  "totalAmount": 9000,
  "couponAmount": 500,
  "discountAmount": 500,
  "totalDisAmount": 1000,
  "costAmount": 9000,
  "grossAmount": 8500,
  "freight": 0
}
```

### 积分管理示例

#### 查询会员积分账户列表
```json
{
  "resource": "points",
  "operation": "getPointsAccount",
  "cardNo": "CARD001"
}
```

#### 调整会员积分
```json
{
  "resource": "points",
  "operation": "adjustPoints",
  "accountType": 1,
  "cardNo": "CARD001",
  "adjustmentType": "increase",
  "points": 100,
  "reason": "活动奖励"
}
```

### 主数据管理示例

#### 批量新增商品
```json
{
  "resource": "masterdata",
  "operation": "batchSyncProduct",
  "products": [
    {
      "productCode": "PROD001",
      "productName": "商品1",
      "categoryCode": "CAT001",
      "price": 9999,
      "status": 1
    }
  ]
}
```

#### 新增门店
```json
{
  "resource": "masterdata",
  "operation": "saveStore",
  "storeNickname": "旗舰店",
  "storeName": "北京旗舰店",
  "storeCategory": "直营店",
  "storeType": "线下门店",
  "storeStatus": "营业中"
}
```

## 参数说明

### 通用参数
- `pageNo`: 页码，从1开始
- `pageSize`: 每页条数，最大值为100

### 会员管理参数
- `consumerCode`: 客户编码（必填）
- `cardNo`: 会员卡号（必填）
- `loyaltyCode`: 忠诚度计划编码
- `phonePrefCode`: 手机号前缀（默认+86）
- `mobilePhone`: 手机号
- `memberName`: 会员姓名
- `storeCode`: 门店编码
- `sourceCode`: 客户来源编码

### 客户管理参数
- `consumerCode`: 客户编码（必填）
- `name`: 客户姓名
- `gender`: 性别（1=男，2=女）
- `birthday`: 生日（YYYY-MM-DD格式）
- `email`: 电子邮箱
- `mobilePhone`: 手机号

### 订单管理参数
- `consumerCode`: 客户编码（必填）
- `orderCode`: 交易单号（必填）
- `type`: 会员标识类型（1=手机号，2=邮箱，3=员工编号）
- `params`: 会员标识参数
- `transactionCode`: 交易单号
- `direction`: 交易单方向（0=正单，1=退单，2=换货单）
- `orderStatus`: 交易单状态（0=已付款，1=已发货，2=已签收，3=已退货）

### 积分管理参数
- `cardNo`: 会员卡号（必填）
- `accountCode`: 积分账户编码（必填）
- `accountType`: 账号类型（1=会员卡号，2=积分账户编码）
- `adjustmentType`: 调整类型（increase=增加，decrease=减少）
- `points`: 积分数量
- `reason`: 调整原因

### 主数据管理参数
- `productCode`: 商品编码
- `productName`: 商品名称
- `storeCode`: 门店编码
- `storeName`: 门店名称
- `storeNickname`: 门店昵称

## 版本兼容性

- **n8n版本**: >= 0.190.0
- **Node.js版本**: >= 16.0.0
- **TypeScript版本**: >= 4.8.0

## 开发

### 环境要求
- Node.js >= 16
- TypeScript >= 4.8
- n8n >= 0.190.0

### 开发命令
```bash
# 安装依赖
npm install

# 开发模式（监听文件变化）
npm run dev

# 构建项目
npm run build

# 代码格式化
npm run format

# 代码检查
npm run lint

# 修复代码问题
npm run lintfix
```

### 项目结构
```
n8n-nodes-socialhub/
├── credentials/           # 凭据定义
│   └── SocialHubApi.credentials.ts
├── nodes/                # 节点定义
│   ├── SocialHub.node.ts
│   └── socialhub.svg
├── dist/                 # 构建输出
├── examples/             # 示例工作流
├── package.json          # 项目配置
├── tsconfig.json         # TypeScript配置
└── README.md             # 项目文档
```

## 贡献

欢迎贡献代码！请遵循以下步骤：

1. Fork 本项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 支持

如果您遇到问题或有建议，请：

1. 查看 [文档](README.md) 和 [常见问题](FAQ.md)
2. 搜索现有的 [Issues](https://github.com/your-username/n8n-nodes-socialhub/issues)
3. 创建新的 Issue 描述您的问题

## 更新日志

查看 [CHANGELOG.md](CHANGELOG.md) 了解版本更新历史。

---

**注意**: 本节点需要有效的 SocialHub API 凭据才能正常工作。请确保您已获得相应的 API 访问权限。