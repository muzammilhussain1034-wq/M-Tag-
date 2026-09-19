const express = require('express');
const app = express();
app.use(express.json());

const vehicleDatabase = [
 { vehicleNo: "2390", mTagId: "MTAG-8839201", balance: 450.00 },
 { vehicleNo: "5490", mTagId: "MTAG-7729104", balance: 100.00 }
];

const APP_OWNER_MERCHANT_ID = "MERCHANT_APP_OWNER_99";
const TOLL_AUTHORITY_MERCHANT_ID = "MERCHANT_MOTORWAY_AUTH_01";
const FLAT_SERVICE_FEE = 15.00;

app.get('/api/vehicles/search', (req, res) => {
 const { query } = req.query;
 const result = vehicleDatabase.find(v => v.vehicleNo === query);
 
 if (!result) return res.status(404).json({ error: "Vehicle not found" });

 res.json({ success: true, data: result });
});

app.post('/api/payments/initiate-topup', async (req, res) => {
 const { mTagId, topUpAmount } = req.body;
 
 const baseAmount = parseFloat(topUpAmount);
 const serviceFee = FLAT_SERVICE_FEE;
 const totalChargeAmount = baseAmount + serviceFee;

 const splitPaymentPayload = {
 transactionId: `TXN_${Date.now()}`,
 currency: "PKR",
 totalAmount: totalChargeAmount,
 splits: [
 { merchantId: TOLL_AUTHORITY_MERCHANT_ID, amount: baseAmount },
 { merchantId: APP_OWNER_MERCHANT_ID, amount: serviceFee }
 ]
 };

 res.json({
 success: true,
 message: "Payment intent created",
 breakdown: { rechargeAmount: baseAmount, serviceFee: serviceFee, totalPayable: totalChargeAmount },
 gatewayPayload: splitPaymentPayload
 });
});

app.listen(3000, () => console.log('Server running on port 3000'));
