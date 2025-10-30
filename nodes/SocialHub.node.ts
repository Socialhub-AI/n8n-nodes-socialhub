/**
 * SocialHub n8n Node
 * 
 * This node provides integration with SocialHub system APIs, offering comprehensive
 * functionality for member management, customer management, order management,
 * points management, and master data management.
 * 
 * @author SocialHub Integration Team
 * @version 1.0.0
 * @license MIT
 */

import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	NodeOperationError,
} from 'n8n-workflow';

/**
 * SocialHub Node Implementation
 * 
 * Provides n8n integration for SocialHub system with support for:
 * - Member Management: loyalty programs, member accounts, membership enrollment
 * - Customer Management: customer CRUD operations, third-party account binding
 * - Order Management: transaction queries, order synchronization
 * - Points Management: points accounts, records, adjustments
 * - Master Data Management: product and store management
 */
export class SocialHub implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'SocialHub',
		name: 'socialHub',
		icon: 'file:socialhub.svg',
		group: ['transform'],
		version: 1,
		description: 'SocialHub System API Integration Node',
		defaults: {
			name: 'SocialHub',
		},
		inputs: [NodeConnectionType.Main],
	    outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'socialHubApi',
				required: true,
			},
		],
		requestDefaults: {
			headers: {
				'Content-Type': 'application/json;charset=utf-8',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Member Management',
						value: 'member',
						description: 'Member center related functions',
					},
					{
						name: 'Customer Management',
						value: 'consumer',
						description: 'Customer center related functions',
					},
					{
						name: 'Order Management',
						value: 'order',
						description: 'Order transaction related functions',
					},
					{
						name: 'Points Management',
						value: 'points',
						description: 'Points center related functions',
					},
					{
						name: 'Master Data Management',
						value: 'masterdata',
						description: 'Master data center related functions',
					},
				],
				default: 'member',
			},

			// Member Management Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['member'],
					},
				},
				options: [
					{
						name: 'Query Loyalty Program List',
						value: 'getLoyaltyPrograms',
						description: 'Get member loyalty program list',
					},
					{
						name: 'Query Customer Member Account List',
						value: 'getMemberList',
						description: 'Paginated query of specified customer member account list',
					},
					{
						name: 'Query Specific Member Account',
						value: 'getMember',
						description: 'Query specific member information by member card number',
					},
					{
						name: 'Customer Membership',
						value: 'memberAdmission',
						description: 'Process customer membership enrollment',
					},
				],
				default: 'getLoyaltyPrograms',
			},

			// Customer Management Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['consumer'],
					},
				},
				options: [
					{
						name: 'Create Customer Information',
						value: 'createConsumer',
					},
					{
						name: 'Import Customer Event Data',
						value: 'importConsumerEventData',
					},
					{
						name: 'Query Customer Information',
						value: 'queryConsumer',
					},
					{
						name: 'Update Customer Information',
						value: 'updateConsumer',
					},
					{
						name: 'Bind Customer Third-Party Account',
						value: 'bindConsumerThirdAccount',
					},
					{
						name: 'Query Third-Party Accounts by Union ID',
						value: 'queryThirdAccountsByUnionId',
					}
				],
				default: 'createConsumer',
			},

			// Order Management Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['order'],
					},
				},
				options: [
					{
						name: 'Paginated Query Customer Transaction List',
						value: 'getTransactionList',
						description: 'Paginated query of specified customer transaction list',
					},
					{
						name: 'Query Transaction Details',
						value: 'getTransactionDetail',
						description: 'Query transaction details by transaction number',
					},
					{
						name: 'Transaction Synchronization',
						value: 'syncTransaction',
						description: 'Synchronize transaction information',
					},
				],
				default: 'getTransactionList',
			},

			// Points Management Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['points'],
					},
				},
				options: [
					{
						name: 'Query Member Points Account List',
						value: 'getPointsAccount',
						description: 'Query all points accounts of specified member',
					},
					{
						name: 'Paginated Query Points Detail List',
						value: 'getPointsRecords',
						description: 'Paginated query of points details for specified points account',
					},
					{
						name: 'Adjust Member Points',
						value: 'adjustPoints',
						description: 'Adjust points for specified member or points account',
					},
				],
				default: 'getPointsAccount',
			},

			// Master Data Management Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['masterdata'],
					},
				},
				options: [
					{
						name: 'Batch Add Products',
						value: 'batchSyncProduct',
					},
					{
						name: 'Add Store',
						value: 'saveStore',
						description: 'Add store information',
					},
				],
				default: 'batchSyncProduct',
			},

			// Member Management - Query Customer Member Account List Parameters
			{
				displayName: 'Customer Code',
				name: 'consumerCode',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['member'],
						operation: ['getMemberList'],
					},
				},
				default: '',
			},
			{
				displayName: 'Page Number',
				name: 'pageNo',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['member'],
						operation: ['getMemberList'],
					},
				},
				default: 1,
				description: 'Page number, starting from 1',
			},
			{
				displayName: 'Page Size',
				name: 'pageSize',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['member'],
						operation: ['getMemberList'],
					},
				},
				default: 10,
				description: 'Page size, maximum value is 100',
			},
			{
				displayName: 'Loyalty Program Code',
				name: 'loyaltyCode',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['member'],
						operation: ['getMemberList'],
					},
				},
				default: '',
				description: 'Loyalty program code (optional)',
			},

			// Member Management - Query Specific Member Account Parameters
			{
				displayName: 'Member Card Number',
				name: 'cardNo',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['member'],
						operation: ['getMember'],
					},
				},
				default: '',
			},

			// Member Management - Customer Admission Parameters
			{
				displayName: 'Loyalty Program Code',
				name: 'loyaltyCode',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['member'],
						operation: ['memberAdmission'],
					},
				},
				default: '',
			},
			{
				displayName: 'Phone Prefix',
				name: 'phonePrefCode',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['member'],
						operation: ['memberAdmission'],
					},
				},
				default: '+86',
				description: 'Phone number prefix',
			},
			{
				displayName: 'Mobile Phone',
				name: 'mobilePhone',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['member'],
						operation: ['memberAdmission'],
					},
				},
				default: '',
				description: 'Mobile phone number',
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['member'],
						operation: ['memberAdmission'],
					},
				},
				default: '',
				description: 'Email address',
			},
			{
				displayName: 'Member Name',
				name: 'memberName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['member'],
						operation: ['memberAdmission'],
					},
				},
				default: '',
			},
			{
				displayName: 'Store Code',
				name: 'storeCode',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['member'],
						operation: ['memberAdmission'],
					},
				},
				default: '',
			},
			{
				displayName: 'Customer Source',
				name: 'sourceCode',
				type: 'options',
				required: true,
				displayOptions: {
					show: {
						resource: ['member'],
						operation: ['memberAdmission'],
					},
				},
				options: [
					{
						name: 'Shopify',
						value: '10140001',
					},
				],
				default: '10140001',
				description: 'Customer source code',
			},

			// Order Management - Paginated Query Customer Transaction List Parameters
			{
				displayName: 'Customer Code',
				name: 'consumerCode',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['order'],
						operation: ['getTransactionList'],
					},
				},
				default: '',
			},
			{
				displayName: 'Page Number',
				name: 'pageNo',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['order'],
						operation: ['getTransactionList'],
					},
				},
				default: 1,
				description: 'Page number, starting from 1',
			},
			{
				displayName: 'Page Size',
				name: 'pageSize',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['order'],
						operation: ['getTransactionList'],
					},
				},
				default: 10,
				description: 'Page size, maximum value is 100',
			},
			{
				displayName: 'Start Date',
				name: 'beginDate',
				type: 'dateTime',
				displayOptions: {
					show: {
						resource: ['order'],
						operation: ['getTransactionList'],
					},
				},
				default: '',
				description: 'Start date (optional)',
			},
			{
				displayName: 'End Date',
				name: 'endDate',
				type: 'dateTime',
				displayOptions: {
					show: {
						resource: ['order'],
						operation: ['getTransactionList'],
					},
				},
				default: '',
				description: 'End date (optional)',
			},

			// Order Management - Query Transaction Details Parameters
			{
				displayName: 'Transaction Number',
				name: 'orderCode',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['order'],
						operation: ['getTransactionDetail'],
					},
				},
				default: '',
			},

			// Order Management - Transaction Synchronization
			{
				displayName: 'Member Identifier Type',
				name: 'type',
				type: 'options',
				required: true,
				displayOptions: {
					show: {
						resource: ['order'],
						operation: ['syncTransaction'],
					},
				},
				options: [
					{
						name: 'Mobile Phone',
						value: 1,
					},
					{
						name: 'Email',
						value: 2,
					},
					{
						name: 'Employee ID',
						value: 3,
					},
				],
				default: 1,
			},
			{
				displayName: 'Member Identifier Parameter',
				name: 'params',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['order'],
						operation: ['syncTransaction'],
					},
				},
				default: '',
				description: 'Parameter value based on type (mobile phone/email/employee ID)',
			},
			{
				displayName: 'Phone Prefix',
				name: 'phonePrefCode',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['order'],
						operation: ['syncTransaction'],
						type: [1],
					},
				},
				default: '+86',
				description: 'Required when type=1',
			},
			{
				displayName: 'Loyalty Program Code',
				name: 'loyaltyCode',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['order'],
						operation: ['syncTransaction'],
					},
				},
				default: '',
				description: 'Loyalty program code (optional)',
			},
			{
				displayName: 'Order Source Channel',
				name: 'source',
				type: 'options',
				required: true,
				displayOptions: {
					show: {
						resource: ['order'],
						operation: ['syncTransaction'],
					},
				},
				options: [
					{
						name: 'Shopify',
						value: '10140001',
					},
				],
				default: '10140001',
			},
			{
				displayName: 'Transaction Number',
				name: 'transactionCode',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['order'],
						operation: ['syncTransaction'],
					},
				},
				default: '',
			},
			{
				displayName: 'Store Code',
				name: 'storeCode',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['order'],
						operation: ['syncTransaction'],
					},
				},
				default: '',
			},
			{
				displayName: 'Order Date',
				name: 'orderDate',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['order'],
						operation: ['syncTransaction'],
					},
				},
				description: 'Order date (format: YYYY-MM-DD HH:MM:SS)',
				default: '',
			},
			{
				displayName: 'Transaction Direction',
				name: 'direction',
				type: 'options',
				required: true,
				displayOptions: {
					show: {
						resource: ['order'],
						operation: ['syncTransaction'],
					},
				},
				options: [
					{
						name: 'Normal Order',
						value: 0,
					},
					{
						name: 'Return Order',
						value: 1,
					},
					{
						name: 'Exchange Order',
						value: 2,
					},
				],
				default: 0,
			},
			{
				displayName: 'Transaction Status',
				name: 'orderStatus',
				type: 'options',
				required: true,
				displayOptions: {
					show: {
						resource: ['order'],
						operation: ['syncTransaction'],
					},
				},
				options: [
					{
						name: 'Paid',
						value: 0,
					},
					{
						name: 'Shipped',
						value: 1,
					},
					{
						name: 'Delivered',
						value: 2,
					},
					{
						name: 'Returned',
						value: 3,
					},
				],
				default: 0,
				description: 'Transaction status (0-Paid 1-Shipped 2-Delivered 3-Returned)',
			},
			{
				displayName: 'Transaction Score Point Status',
				name: 'scorePointStatus',
				type: 'options',
				required: true,
				displayOptions: {
					show: {
						resource: ['order'],
						operation: ['syncTransaction'],
					},
				},
				options: [
					{
						name: 'Not Issued',
						value: 0,
					},
					{
						name: 'Waiting for Issuance',
						value: 1,
					},
					{
						name: 'Processing',
						value: 2,
					},
					{
						name: 'Processed',
						value: 3,
					},
					{
						name: 'Exception',
						value: 4,
					},
				],
				default: 0,
				description: 'Transaction Score Point Status (0-Not Issued 1-Waiting for Issuance 2-Processing 3-Processed)',
			},
			{
				displayName: 'Original Sales Amount',
				name: 'totalPrice',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						resource: ['order'],
						operation: ['syncTransaction'],
					},
				},
				description: 'Original sales amount (unit: cents)',
				default: 0,
			},
			{
				displayName: 'Receivable Amount',
				name: 'totalAmount',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						resource: ['order'],
						operation: ['syncTransaction'],
					},
				},
				description: 'Receivable amount (unit: cents)',
				default: 0,
			},
			{
				displayName: 'Coupon Amount',
				name: 'couponAmount',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						resource: ['order'],
						operation: ['syncTransaction'],
					},
				},
				description: 'Coupon amount (unit: cents)',
				default: 0,
			},
			{
				displayName: 'Discount Amount',
				name: 'discountAmount',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						resource: ['order'],
						operation: ['syncTransaction'],
					},
				},
				description: 'Discount amount (unit: cents)',
				default: 0,
			},
			{
				displayName: 'Total Discount Amount',
				name: 'totalDisAmount',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						resource: ['order'],
						operation: ['syncTransaction'],
					},
				},
				description: 'Total discount amount (unit: cents)',
				default: 0,
			},
			{
				displayName: 'Actual Received Amount',
				name: 'costAmount',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						resource: ['order'],
						operation: ['syncTransaction'],
					},
				},
				description: 'Actual received amount (unit: cents)',
				default: 0,
			},
			{
				displayName: 'Actual Received Tax-Deducted Amount',
				name: 'grossAmount',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						resource: ['order'],
						operation: ['syncTransaction'],
					},
				},
				description: 'Actual received tax-deducted amount (unit: cents)',
				default: 0,
			},
			{
				displayName: 'Freight',
				name: 'freight',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						resource: ['order'],
						operation: ['syncTransaction'],
					},
				},
				description: 'Freight (unit: cents)',
				default: 0,
			},
			{
				displayName: 'Original Order Number',
				name: 'originalCode',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['order'],
						operation: ['syncTransaction'],
					},
				},
				default: '',
				description: 'Original order number (for returns)',
			},
			{
				displayName: 'Transaction Product Details Collection',
				name: 'details',
				type: 'fixedCollection',
				typeOptions: { multipleValues: true }, // Allow multiple rows
				default: {},
				options: [
					{
						displayName: 'Product Details',
						name: 'detail',
						values: [
							{ displayName: 'Transaction Detail Mark', name: 'direction', type: 'options', required: true,
								options: [
									{
										name: 'Normal Order',
										value: 0,
									},
									{
										name: 'Return/Exchange Order',
										value: 1,
									},
								],
								default: 0 },
							{ displayName: 'Transaction Detail Code', name: 'detailCode', type: 'string', required: true, default: '' },
							{ displayName: 'Product Code', name: 'productCode', type: 'string', required: true, default: '' },
							{ displayName: 'Product Title', name: 'title', type: 'string', required: true, default: '' },
							{ displayName: 'Product Quantity', name: 'qty', type: 'number', required: true, default: 0 },
							{ displayName: 'Product Unit Price', name: 'price', type: 'number', required: true, default: 0 },
							{ displayName: 'Receivable Amount', name: 'totalAmount', type: 'number', required: true, default: 0 },
							{ displayName: 'Coupon Amount', name: 'couponAmount', type: 'number', required: true, default: 0 },
							{ displayName: 'Discount Amount', name: 'discountAmount', type: 'number', required: true, default: 0 },
							{ displayName: 'Total Discount Amount', name: 'totalDisAmount', type: 'number', required: true, default: 0 },
							{ displayName: 'Actual Received Amount', name: 'costAmount', type: 'number', required: true, default: 0 },
							{ displayName: 'Actual Received Tax-Deducted Amount', name: 'grossAmount', type: 'number', required: true, default: 0 },
						],
					},
				],
				required: true,
				displayOptions: {
					show: { resource: ['order'], operation: ['syncTransaction'] },
				},
				description: 'Transaction product details collection (array)',
			},

			// Points Management - Query Member Points Account List Parameters
			{
				displayName: 'Member Card Number',
				name: 'cardNo',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['points'],
						operation: ['getPointsAccount'],
					},
				},
				default: '',
			},
			{
				displayName: 'Page Number',
				name: 'pageNo',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['points'],
						operation: ['getPointsAccount'],
					},
				},
				default: 1,
				description: 'Page number, starting from 1',
			},
			{
				displayName: 'Page Size',
				name: 'pageSize',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['points'],
						operation: ['getPointsAccount'],
					},
				},
				default: 10,
				description: 'Page size, maximum value is 100',
			},
			{
				displayName: 'Points Group Code',
				name: 'pointsGroupCode',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['points'],
						operation: ['getPointsAccount'],
					},
				},
				default: '',
				description: 'Points group code (optional)',
			},

			// Points Management - Paginated Query Points Details List Parameters
			{
				displayName: 'Points Account Code',
				name: 'accountCode',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['points'],
						operation: ['getPointsRecords'],
					},
				},
				default: '',
			},
			{
				displayName: 'Page Number',
				name: 'pageNo',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['points'],
						operation: ['getPointsRecords'],
					},
				},
				default: 1,
				description: 'Page number, starting from 1',
			},
			{
				displayName: 'Page Size',
				name: 'pageSize',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['points'],
						operation: ['getPointsRecords'],
					},
				},
				default: 10,
				description: 'Page size, maximum value is 100',
			},
			{
				displayName: 'Record Status',
				name: 'status',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['points'],
						operation: ['getPointsRecords'],
					},
				},
				options: [
					{
						name: 'All',
						value: '',
					},
					{
						name: 'Effective',
						value: 0,
					},
					{
						name: 'Not Effective',
						value: 1,
					},
					{
						name: 'Expired',
						value: 2,
					},
				],
				default: '',
				description: 'Record status (optional)',
			},
			{
				displayName: 'Start Time',
				name: 'beginDate',
				type: 'dateTime',
				displayOptions: {
					show: {
						resource: ['points'],
						operation: ['getPointsRecords'],
					},
				},
				default: '',
				description: 'Start time (optional)',
			},
			{
				displayName: 'End Time',
				name: 'endDate',
				type: 'dateTime',
				displayOptions: {
					show: {
						resource: ['points'],
						operation: ['getPointsRecords'],
					},
				},
				default: '',
				description: 'End time (optional)',
			},

			// Points Management - Adjust Member Points Parameters
			{
				displayName: 'Account Type',
				name: 'accountType',
				type: 'options',
				required: true,
				displayOptions: {
					show: {
						resource: ['points'],
						operation: ['adjustPoints'],
					},
				},
				options: [
					{
						name: 'Points Account',
						value: 1,
					},
					{
						name: 'Member Card Number',
						value: 2,
					},
				],
				default: 2,
			},
			{
				displayName: 'Account Code',
				name: 'accountCode',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['points'],
						operation: ['adjustPoints'],
					},
				},
				default: '',
				description: 'Points account or member card number',
			},
			{
				displayName: 'Points Group Code',
				name: 'pointsGroupCode',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['points'],
						operation: ['adjustPoints'],
					},
				},
				default: '',
				description: 'Points group code (optional)',
			},
			{
				displayName: 'Operation ID',
				name: 'operationId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['points'],
						operation: ['adjustPoints'],
					},
				},
				default: '',
				description: 'Points operation unique identifier',
			},
			{
				displayName: 'Operation Type',
				name: 'operationType',
				type: 'options',
				required: true,
				displayOptions: {
					show: {
						resource: ['points'],
						operation: ['adjustPoints'],
					},
				},
				options: [
					{
						name: 'Behavior Increase',
						value: 6,
					},
					{
						name: 'Behavior Decrease',
						value: 7,
					},
					{
						name: 'Gift Redemption Decrease',
						value: 8,
					},
					{
						name: 'Coupon Redemption Decrease',
						value: 9,
					},
				],
				default: 6,
				description: 'Points operation type',
			},
			{
				displayName: 'Point Value',
				name: 'pointValue',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						resource: ['points'],
						operation: ['adjustPoints'],
					},
				},
				default: 0,
			},
			{
				displayName: 'Point Description',
				name: 'pointDesc',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['points'],
						operation: ['adjustPoints'],
					},
				},
				default: '',
				description: 'Point description (optional)',
			},
			{
				displayName: 'Points Expiry Time',
				name: 'effectiveEndTime',
				type: 'dateTime',
				required: true,
				displayOptions: {
					show: {
						resource: ['points'],
						operation: ['adjustPoints'],
					},
				},
				default: '',
				description: 'Points expiry timestamp',
			},
			{
				displayName: 'Upgradeable',
				name: 'upgradeTierFlag',
				type: 'options',
				required: true,
				displayOptions: {
					show: {
						resource: ['points'],
						operation: ['adjustPoints'],
					},
				},
				options: [
					{
						name: 'No',
						value: 0,
					},
					{
						name: 'Yes',
						value: 1,
					},
				],
				default: 0,
				description: 'Whether upgradeable',
			},

			// Customer Management - Create Customer Information
			{
				displayName: 'Customer Name',
				name: 'name',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['consumer'],
						operation: ['createConsumer'],
					},
				},
				default: '',
			},
			{
				displayName: 'Gender',
				name: 'gender',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['consumer'],
						operation: ['createConsumer'],
					},
				},
				options: [
					{
						name: 'Unknown',
						value: 0,
					},
					{
						name: 'Male',
						value: 1,
					},
					{
						name: 'Female',
						value: 2,
					},
				],
				default: 0,
			},
			{
				displayName: 'Mobile Phone',
				name: 'mobilePhone',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['consumer'],
						operation: ['createConsumer'],
					},
				},
				default: '',
				description: 'Customer mobile phone number',
			},
			{
				displayName: 'Phone Prefix Code',
				name: 'phonePrefCode',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['consumer'],
						operation: ['createConsumer'],
					},
				},
				default: '',
				description: 'Phone international prefix code',
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['consumer'],
						operation: ['createConsumer'],
					},
				},
				default: '',
			},
			{
				displayName: 'Customer Source',
				name: 'sourceCode',
				type: 'options',
				required: true,
				displayOptions: {
					show: {
						resource: ['consumer'],
						operation: ['createConsumer'],
					},
				},
				options: [
					{
						name: 'Shopify',
						value: '10140001',
					},
				],
				default: '10140001',
				description: 'Customer source code',
			},
			{
				displayName: 'Birthday',
				name: 'birthday',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['consumer'],
						operation: ['createConsumer'],
					},
				},
				default: null,
				description: 'Birthday (format: yyyy-MM-dd)',
			},
			{
				displayName: 'Customer Identity Type',
				name: 'identityType',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['consumer'],
						operation: ['createConsumer'],
					},
				},
				options: [
					{
						name: 'Member',
						value: 1,
					},
					{
						name: 'Registered User',
						value: 2,
					},
					{
						name: 'Guest',
						value: 3,
					},
					{
						name: 'Employee',
						value: 4,
					},
				],
				default: 1,
				description: 'Customer identity type (1-member; 2-registered user; 3-guest; 4-employee)',
			},
			{
				displayName: 'Organization Code',
				name: 'organizationCode',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['consumer'],
						operation: ['createConsumer'],
					},
				},
				default: '',
			},

			// Customer Management - Import Customer Event Data
			{
				displayName: 'Event Data Collection',
				name: 'data',
				type: 'fixedCollection',
				typeOptions: { multipleValues: true }, // Allow multiple rows
				default: {},
				options: [
					{
						displayName: 'Event',
						name: 'event',
						values: [
							{ displayName: 'Event Key', name: 'eventKey', type: 'string', required: true, default: '' },
							{ displayName: 'Event Type', name: 'eventType', type: 'string', default: 'track' },
							{ displayName: 'Event Time', name: 'eventTime', type: 'number', required: true, default: 0 },
							{ displayName: 'Customer Code', name: 'customerCode', type: 'string', required: true, default: '' },
							{ displayName: 'Event ID', name: 'eventId', type: 'string', required: true, default: '' },
							{ displayName: 'Tenant ID', name: 'tenantId', type: 'string', required: true, default: '' },
							{ displayName: 'Event Properties', name: 'properties', type: 'json', required: true, default: '{}' },
						],
					},
				],
				required: true,
				displayOptions: {
					show: {
						resource: ['consumer'],
						operation: ['importConsumerEventData'],
					},
				},
				description: 'Event data collection (array)',
			},

			// Customer Management - Query Customer Information
			{
				displayName: 'Query Parameter Type',
				name: 'type',
				type: 'options',
				required: true,
				displayOptions: {
					show: {
						resource: ['consumer'],
						operation: ['queryConsumer'],
					},
				},
				options: [
					{
						name: 'Mobile Phone',
						value: 1,
					},
					{
						name: 'Email',
						value: 2,
					},
				],
				default: 1,
				description: 'Member identifier type',
			},
			{
				displayName: 'Query Parameter',
				name: 'query',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['consumer'],
						operation: ['queryConsumer'],
					},
				},
				default: '',
				description: 'Parameter value based on type (1-mobile phone/2-email)',
			},
			{
				displayName: 'Phone Prefix',
				name: 'phonePrefCode',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['consumer'],
						operation: ['queryConsumer'],
						type: [1],
					},
				},
				default: '+86',
				description: 'Phone international prefix code, Required when type=1',
			},
			{
				displayName: 'Current Timestamp',
				name: 'timestamp',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['consumer'],
						operation: ['queryConsumer'],
					},
				},
				default: '',
				description: 'The Current timestamp in milliseconds when the request is sent',
			},
			{
				displayName: 'Random ID',
				name: 'nonceId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['consumer'],
						operation: ['queryConsumer'],
					},
				},
				default: '',
				description: 'The Random ID when the request is sent',
			},

			// Customer Management - Update Customer Information
			{
				displayName: 'Customer Code',
				name: 'consumerCode',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['consumer'],
						operation: ['updateConsumer'],
					},
				},
				default: '',
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['consumer'],
						operation: ['updateConsumer'],
					},
				},
				default: '',
			},
			{
				displayName: 'Customer Name',
				name: 'name',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['consumer'],
						operation: ['updateConsumer'],
					},
				},
				default: '',
			},
			{
				displayName: 'Gender',
				name: 'gender',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['consumer'],
						operation: ['updateConsumer'],
					},
				},
				options: [
					{
						name: 'Unknown',
						value: 0,
					},
					{
						name: 'Male',
						value: 1,
					},
					{
						name: 'Female',
						value: 2,
					},
				],
				default: 0,
			},
			{
				displayName: 'Birthday',
				name: 'birthday',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['consumer'],
						operation: ['updateConsumer'],
					},
				},
				default: '',
				description: 'Birthday (format: yyyy-MM-dd)',
			},
			{
				displayName: 'Postal Code',
				name: 'postalCode',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['consumer'],
						operation: ['updateConsumer'],
					},
				},
				default: '',
			},
			{
				displayName: 'Customer Address',
				name: 'address',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['consumer'],
						operation: ['updateConsumer'],
					},
				},
				default: '',
			},
			{
				displayName: 'Customer Receive SMS Flag',
				name: 'receiveSmsFlag',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['consumer'],
						operation: ['updateConsumer'],
					},
				},
				options: [
					{
						name: 'No',
						value: 0,
					},
					{
						name: 'Yes',
						value: 1,
					},
				],
				default: 1,
			},
			{
				displayName: 'Customer Receive Email Flag',
				name: 'receiveEmailFlag',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['consumer'],
						operation: ['updateConsumer'],
					},
				},
				options: [
					{
						name: 'No',
						value: 0,
					},
					{
						name: 'Yes',
						value: 1,
					},
				],
				default: 1,
			},
			{
				displayName: 'Language',
				name: 'language',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['consumer'],
						operation: ['updateConsumer'],
					},
				},
				default: '',
			},

			// Customer Management - Bind Third-Party Account
			{
				displayName: 'Customer Code',
				name: 'consumerCode',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['consumer'],
						operation: ['bindConsumerThirdAccount'],
					},
				},
				default: '',
			},
			{
				displayName: 'Third-Party Account Type',
				name: 'accountType',
				type: 'options',
				required: true,
				displayOptions: {
					show: {
						resource: ['consumer'],
						operation: ['bindConsumerThirdAccount'],
					},
				},
				options: [
					{
						name: 'Shopify',
						value: 100014,
					}
				],
				default: 100014,
			},
			{
				displayName: 'Third-Party Account ID',
				name: 'unionId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['consumer'],
						operation: ['bindConsumerThirdAccount'],
					},
				},
				default: '',
				description: 'Third-party account ID (e.g., WeChat OpenID)',
			},
			{
				displayName: 'Third-Party Account Nickname',
				name: 'nickName',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['consumer'],
						operation: ['bindConsumerThirdAccount'],
					},
				},
				default: '',
			},

			// Customer Management - queryThirdAccountsByUnionId
			{
				displayName: 'Third-Party Account ID',
				name: 'unionId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['consumer'],
						operation: ['queryThirdAccountsByUnionId'],
					},
				},
				default: '',
			},

			// Master Data Management - Batch Add Products
			{
				displayName: 'Product Data Collection',
				name: 'batchReq',
				type: 'fixedCollection',
				typeOptions: { multipleValues: true }, // Allow multiple rows
				default: [],
				options: [
					{
						displayName: 'Product',
						name: 'product',
						values: [
							{ displayName: 'Product Type', name: 'type', type: 'options', required: true,
								options: [
									{
										name: 'Single',
										value: 0,
									},
									{
										name: 'Package',
										value: 1,
									}
								],
								default: 0 },
							{ displayName: 'Product Code', name: 'code', type: 'string', required: true, default: '' },
							{ displayName: 'Product Name', name: 'name', type: 'string', required: true, default: '' },
							{ displayName: 'Brand', name: 'brand', type: 'string', default: '' },
							{ displayName: 'Category', name: 'category', type: 'string', default: '' },
							{ displayName: 'Sub Category', name: 'subCategory', type: 'string', default: '' },
							{ displayName: 'Price', name: 'price', type: 'number', default: 0 },
							{ displayName: 'Color', name: 'color', type: 'string', default: '' },
							{ displayName: 'Size', name: 'size', type: 'string', default: '' },
							{ displayName: 'Season', name: 'season', type: 'string', default: '' },
							{ displayName: 'Gender', name: 'gender', type: 'options',
								options: [
									{
										name: 'Unknown',
										value: 'Unknown',
									},
									{
										name: 'Male',
										value: 'Male',
									},
									{
										name: 'Female',
										value: 'Female',
									},
								],
								default: 'Unknown' },
							{ displayName: 'Description', name: 'description', type: 'string', default: '' },
							{ displayName: 'Status', name: 'status', type: 'string', default: '' },
							{ displayName: 'Tags', name: 'tags', type: 'string', default: '' },
						],
					},
				],
				required: true,
				displayOptions: {
					show: { resource: ['masterdata'], operation: ['batchSyncProduct'] },
				},
				description: 'Product data collection (array)',
			},

			// Master Data Management - Add Store
			{
				displayName: 'Store ID',
				name: 'id',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['masterdata'],
						operation: ['saveStore'],
					},
				},
				default: '',
			},
			{
				displayName: 'Organization Code',
				name: 'organizationCode',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['masterdata'],
						operation: ['saveStore'],
					},
				},
				default: '',
			},
			{
				displayName: 'Organization Name',
				name: 'organizationName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['masterdata'],
						operation: ['saveStore'],
					},
				},
				default: '',
			},
			{
				displayName: 'Parent Organization Code',
				name: 'parentOrganizationCode',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['masterdata'],
						operation: ['saveStore'],
					},
				},
				default: '',
			},
			{
				displayName: 'Source',
				name: 'sourceCode',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['masterdata'],
						operation: ['saveStore'],
					},
				},
				default: '',
			},
			{
				displayName: 'Source Name',
				name: 'sourceName',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['masterdata'],
						operation: ['saveStore'],
					},
				},
				default: '',
			},
			{
				displayName: 'Store Nickname',
				name: 'nickName',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['masterdata'],
						operation: ['saveStore'],
					},
				},
				default: '',
			},
			{
				displayName: 'Store Chinese Name',
				name: 'cnName',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['masterdata'],
						operation: ['saveStore'],
					},
				},
				default: '',
			},
			{
				displayName: 'Store English Name',
				name: 'enName',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['masterdata'],
						operation: ['saveStore'],
					},
				},
				default: '',
			},
			{
				displayName: 'Store Category',
				name: 'storeCategoryId',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['masterdata'],
						operation: ['saveStore'],
					},
				},
				default: 0,
			},
			{
				displayName: 'Store Type',
				name: 'type',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['masterdata'],
						operation: ['saveStore'],
					},
				},
				options: [
					{
						name: 'Headquarters',
						value: 1,
					},
					{
						name: 'Store',
						value: 99,
					},
				],
				default: 1,
			},
			{
				displayName: 'Store Status',
				name: 'storeStatus',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['masterdata'],
						operation: ['saveStore'],
					},
				},
				options: [
					{
						name: 'Normal',
						value: 10,
					},
					{
						name: 'Closed',
						value: 20,
					},
				],
				default: 10,
			},
		],
	};

	/**
	 * Execute the node operation
	 * 
	 * This method processes each input item and executes the corresponding
	 * SocialHub API operation based on the selected resource and operation.
	 * 
	 * @param this - The execution context
	 * @returns Promise<INodeExecutionData[][]> - Array of execution results
	 */
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		// Get SocialHub API credentials
		const credentials = await this.getCredentials('socialHubApi');
		const baseUrl = credentials.baseUrl as string;

		// Process each input item
		for (let i = 0; i < items.length; i++) {
			try {
				// Extract node parameters
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;

				// Initialize request configuration
				const requestOptions: any = {
					headers: {
						'Content-Type': 'application/json',
					},
				};

				// Build API endpoint URL and HTTP method based on resource and operation
				let url = '';
				let method = 'GET';

				if (resource === 'member') {
					if (operation === 'getLoyaltyPrograms') {
						url = `${baseUrl}/v1/member/loyaltyprograms`;
						method = 'GET';
					} else if (operation === 'getMemberList') {
						const consumerCode = this.getNodeParameter('consumerCode', i) as string;
						url = `${baseUrl}/v1/member/list/${consumerCode}`;
						method = 'GET';

						// Add query parameters
						const params = new (globalThis as any).URLSearchParams();
						const pageNo = this.getNodeParameter('pageNo', i, 1) as number;
						const pageSize = this.getNodeParameter('pageSize', i, 10) as number;
						const loyaltyCode = this.getNodeParameter('loyaltyCode', i, '') as string;

						params.append('pageNo', pageNo.toString());
						params.append('pageSize', pageSize.toString());
						if (loyaltyCode) {
							params.append('loyaltyCode', loyaltyCode);
						}

						url += `?${params.toString()}`;
					} else if (operation === 'getMember') {
						const cardNo = this.getNodeParameter('cardNo', i) as string;
						url = `${baseUrl}/v1/member/${cardNo}`;
						method = 'GET';
					} else if (operation === 'memberAdmission') {
						url = `${baseUrl}/v1/member/admission`;
						method = 'POST';

						requestOptions.body = {
							// type: this.getNodeParameter('type', i),
							// params: this.getNodeParameter('params', i),
							loyaltyProgramCode: this.getNodeParameter('loyaltyCode', i),
							phonePrefCode: this.getNodeParameter('phonePrefCode', i, '+86'),
							mobilePhone: this.getNodeParameter('mobilePhone', i, ''),
							name: this.getNodeParameter('memberName', i, ''),
							storeCode: this.getNodeParameter('storeCode', i, ''),
							sourceCode: this.getNodeParameter('sourceCode', i, ''),
							email: this.getNodeParameter('email', i, ''),
						};
					}
				} else if (resource === 'consumer') {
					if (operation === 'createConsumer') {
						url = `${baseUrl}/v1/consumer`;
						method = 'POST';

						requestOptions.body = {
							name: this.getNodeParameter('name', i),
							gender: this.getNodeParameter('gender', i, 0),
							mobilePhone: this.getNodeParameter('mobilePhone', i),
							phonePrefCode: this.getNodeParameter('phonePrefCode', i),
							email: this.getNodeParameter('email', i, ''),
							sourceCode: this.getNodeParameter('sourceCode', i),
							birthday: this.getNodeParameter('birthday', i, null),
							identityType: this.getNodeParameter('identityType', i, 1),
							organizationCode: this.getNodeParameter('organizationCode', i),
						};
					} else if (operation === 'importConsumerEventData') {
						url = `${baseUrl}/v1/consumer/event/data`;
						method = 'POST';

						const eventData = this.getNodeParameter('data', i) as any;
						requestOptions.body = {
							data: eventData?.event || [],
						};
					} else if (operation === 'queryConsumer') {
						url = `${baseUrl}/v1/consumer/info`;
						method = 'GET';

						// Add query parameters
						const params = new (globalThis as any).URLSearchParams();
						const type = this.getNodeParameter('type', i) as number;
						const query = this.getNodeParameter('query', i) as string;
						const phonePrefCode = this.getNodeParameter('phonePrefCode', i, '+86') as string;
						const timestamp = this.getNodeParameter('timestamp', i) as string;
						const nonceId = this.getNodeParameter('nonceId', i) as string;

						params.append('type', type.toString());
						params.append('query', query);
						if (type === 1 && phonePrefCode) {
							params.append('phonePrefCode', phonePrefCode);
						}
						params.append('timestamp', timestamp);
						params.append('nonceId', nonceId);

						url += `?${params.toString()}`;
					} else if (operation === 'updateConsumer') {
						const consumerCode = this.getNodeParameter('consumerCode', i) as string;
						url = `${baseUrl}/v1/consumer/updateInfo/${consumerCode}`;
						method = 'PUT';

						requestOptions.body = {
							email: this.getNodeParameter('email', i, ''),
							name: this.getNodeParameter('name', i),
							gender: this.getNodeParameter('gender', i, 0),
							birthday: this.getNodeParameter('birthday', i, null),
							postelCode: this.getNodeParameter('postalCode', i, ''),
							address: this.getNodeParameter('address', i, ''),
							receiveSmsFlag: this.getNodeParameter('receiveSmsFlag', i, 1),
							receiveEmailFlag: this.getNodeParameter('receiveEmailFlag', i, 1),
							receiveAppFlag: 1,
							receiveWecomFlag: 1,
							receiveWechatFlag: 1,
							receiveWhatsAppFlag: 1,
							receiveLineFlag: 1,
							receiveMessagerFlag: 1,
						};
					} else if (operation === 'bindConsumerThirdAccount') {
						url = `${baseUrl}/v1/consumer/binding`;
						method = 'POST';

						requestOptions.body = {
							consumerCode: this.getNodeParameter('consumerCode', i),
							accountType: this.getNodeParameter('accountType', i),
							unionId: this.getNodeParameter('unionId', i),
							nickName: this.getNodeParameter('nickName', i),
						};
					} else if (operation === 'queryThirdAccountsByUnionId') {
						const unionId = this.getNodeParameter('unionId', i) as string;
						url = `${baseUrl}/v1/consumer/thirdaccounts/${unionId}`;
					}
				} else if (resource === 'order') {
					if (operation === 'getTransactionList') {
						const consumerCode = this.getNodeParameter('consumerCode', i) as string;
						url = `${baseUrl}/v1/transactions/page/${consumerCode}`;
						method = 'POST';

						requestOptions.body = {
							pageNo: this.getNodeParameter('pageNo', i, 1),
							pageSize: this.getNodeParameter('pageSize', i, 10),
							beginDate: this.getNodeParameter('beginDate', i, ''),
							endDate: this.getNodeParameter('endDate', i, ''),
						};
					} else if (operation === 'getTransactionDetail') {
						const orderCode = this.getNodeParameter('orderCode', i) as string;
						url = `${baseUrl}/v1/transactions/${orderCode}`;
						method = 'POST';
					} else if (operation === 'syncTransaction') {
						url = `${baseUrl}/v1/transactions/sync`;
						method = 'POST';

						const details = this.getNodeParameter('details', i) as any;
						requestOptions.body = {
							type: this.getNodeParameter('type', i),
							params: this.getNodeParameter('params', i),
							phonePrefCode: this.getNodeParameter('phonePrefCode', i, '+86'),
							loyaltyCode: this.getNodeParameter('loyaltyCode', i, ''),
							source: this.getNodeParameter('source', i),
							transactionCode: this.getNodeParameter('transactionCode', i),
							storeCode: this.getNodeParameter('storeCode', i),
							orderDate: this.getNodeParameter('orderDate', i),
							direction: this.getNodeParameter('direction', i),
							orderStatus: this.getNodeParameter('orderStatus', i),
							scorePointStatus: this.getNodeParameter('scorePointStatus', i),
							totalPrice: this.getNodeParameter('totalPrice', i),
							totalAmount: this.getNodeParameter('totalAmount', i),
							couponAmount: this.getNodeParameter('couponAmount', i),
							discountAmount: this.getNodeParameter('discountAmount', i),
							totalDisAmount: this.getNodeParameter('totalDisAmount', i),
							costAmount: this.getNodeParameter('costAmount', i),
							grossAmount: this.getNodeParameter('grossAmount', i),
							freight: this.getNodeParameter('freight', i),
							originalCode: this.getNodeParameter('originalCode', i, ''),
							details: details?.detail || [],
						};
					}
				} else if (resource === 'points') {
					if (operation === 'getPointsAccount') {
						const cardNo = this.getNodeParameter('cardNo', i) as string;
						url = `${baseUrl}/v1/points/pointsAccount/${cardNo}`;
						method = 'GET';

						// Add query parameters
						const params = new (globalThis as any).URLSearchParams();
						const pageNo = this.getNodeParameter('pageNo', i, 1) as number;
						const pageSize = this.getNodeParameter('pageSize', i, 10) as number;
						const pointsGroupCode = this.getNodeParameter('pointsGroupCode', i, '') as string;

						params.append('pageNo', pageNo.toString());
						params.append('pageSize', pageSize.toString());
						if (pointsGroupCode) {
							params.append('pointsGroupCode', pointsGroupCode);
						}

						url += `?${params.toString()}`;
					} else if (operation === 'getPointsRecords') {
						const accountCode = this.getNodeParameter('accountCode', i) as string;
						url = `${baseUrl}/v1/points/pointsRecords/${accountCode}`;
						method = 'GET';

						// Add query parameters
						const params = new (globalThis as any).URLSearchParams();
						const pageNo = this.getNodeParameter('pageNo', i, 1) as number;
						const pageSize = this.getNodeParameter('pageSize', i, 10) as number;
						const status = this.getNodeParameter('status', i, '') as string;
						const beginDate = this.getNodeParameter('beginDate', i, '') as string;
						const endDate = this.getNodeParameter('endDate', i, '') as string;

						params.append('pageNo', pageNo.toString());
						params.append('pageSize', pageSize.toString());
						if (status !== '') {
							params.append('status', status);
						}
						if (beginDate) {
							params.append('beginDate', new Date(beginDate).getTime().toString());
						}
						if (endDate) {
							params.append('endDate', new Date(endDate).getTime().toString());
						}

						url += `?${params.toString()}`;
					} else if (operation === 'adjustPoints') {
						url = `${baseUrl}/v1/points/adjustment`;
						method = 'POST';

						const effectiveEndTime = this.getNodeParameter('effectiveEndTime', i) as string;
						requestOptions.body = {
							accountType: this.getNodeParameter('accountType', i),
							accountCode: this.getNodeParameter('accountCode', i),
							pointsGroupCode: this.getNodeParameter('pointsGroupCode', i, ''),
							operationId: this.getNodeParameter('operationId', i),
							operationType: this.getNodeParameter('operationType', i),
							pointValue: this.getNodeParameter('pointValue', i),
							pointDesc: this.getNodeParameter('pointDesc', i, ''),
							effectiveEndTime: new Date(effectiveEndTime).getTime(),
							upgradeTierFlag: this.getNodeParameter('upgradeTierFlag', i),
						};
					}
				} else if (resource === 'masterdata') {
					if (operation === 'batchSyncProduct') {
						url = `${baseUrl}/v1/masterdata/product/batchSync`;
						method = 'POST';

						const batchReq = this.getNodeParameter('batchReq', i) as any;
						requestOptions.body = batchReq?.product || [];
					} else if (operation === 'saveStore') {
						url = `${baseUrl}/v1/masterdata/store`;
						method = 'POST';

						requestOptions.body = {
							id: this.getNodeParameter('id', i, ''),
							organizationCode: this.getNodeParameter('organizationCode', i),
							organizationName: this.getNodeParameter('organizationName', i),
							parentOrganizationCode: this.getNodeParameter('parentOrganizationCode', i, ''),
							sourceCode: this.getNodeParameter('sourceCode', i, ''),
							sourceName: this.getNodeParameter('sourceName', i, ''),
							nickName: this.getNodeParameter('nickName', i, ''),
							cnName: this.getNodeParameter('cnName', i, ''),
							enName: this.getNodeParameter('enName', i, ''),
							storeCategoryId: this.getNodeParameter('storeCategoryId', i, 0),
							type: this.getNodeParameter('type', i, 1),
							storeStatus: this.getNodeParameter('storeStatus', i, 10),
						};
					}
				}

				// If POST request with body, convert to JSON string
				if (method === 'POST' && requestOptions.body) {
					requestOptions.body = JSON.stringify(requestOptions.body);
				}

				// Execute HTTP request
				requestOptions.url = url;
				requestOptions.method = method;

				const response = await this.helpers.httpRequestWithAuthentication.call(
					this,
					'socialHubApi',
					requestOptions
				);

				// Process response data
				const responseData = response.body || response;

				returnData.push({
					json: responseData,
					pairedItem: {
						item: i,
					},
				});
			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : String(error);

				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: errorMessage,
						},
						pairedItem: {
							item: i,
						},
					});
				} else {
					throw new NodeOperationError(this.getNode(), errorMessage, { itemIndex: i });
				}
			}
		}

		return [returnData];
	}
}
