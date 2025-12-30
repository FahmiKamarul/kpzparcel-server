<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Receipt #{{ $payment->PaymentID }}</title>
    <style>
        body { font-family: 'Helvetica', sans-serif; color: #333; font-size: 14px; line-height: 1.6; }
        .container { width: 100%; max-width: 700px; margin: 0 auto; }
        
        /* Header */
        .header { text-align: center; border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 30px; }
        .header h1 { margin: 0; color: #2d3748; text-transform: uppercase; font-size: 24px; }
        .header p { margin: 5px 0 0; color: #718096; }
        .badge { background: #e6fffa; color: #2c7a7b; padding: 5px 10px; border-radius: 15px; font-size: 12px; font-weight: bold; border: 1px solid #b2f5ea; display: inline-block; margin-top: 10px; }

        /* Details */
        .details { width: 100%; margin-bottom: 30px; }
        .details td { vertical-align: top; }
        .text-right { text-align: right; }
        .label { font-size: 10px; text-transform: uppercase; color: #718096; font-weight: bold; letter-spacing: 1px; }
        .value { font-size: 14px; font-weight: bold; color: #1a202c; }

        /* Table */
        .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        .items-table th { background: #f7fafc; text-align: left; padding: 10px; border-bottom: 1px solid #e2e8f0; font-size: 12px; text-transform: uppercase; color: #4a5568; }
        .items-table td { padding: 12px 10px; border-bottom: 1px solid #edf2f7; }
        .items-table .item-title { font-weight: bold; color: #2d3748; }
        .items-table .item-sub { font-size: 12px; color: #718096; font-family: monospace; }

        /* Totals */
        .totals { width: 100%; }
        .totals td { padding: 5px 0; }
        .total-row { border-top: 2px solid #e2e8f0; font-size: 18px; font-weight: bold; color: #2b6cb0; }
        
        /* Footer */
        .footer { margin-top: 50px; text-align: center; font-size: 10px; color: #a0aec0; border-top: 1px solid #eee; padding-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Official Receipt</h1>
            <p>Transaction ID: #{{ $payment->PaymentID }}</p>
            <span class="badge">PAID</span>
        </div>

        <table class="details">
            <tr>
                <td>
                    <div class="label">Payment Date</div>
                    <div class="value">{{ $payment->created_at->format('d M Y, h:i A') }}</div>
                </td>
                <td class="text-right">
                    <div class="label">Payment Method</div>
                    <div class="value">
                        {{ $payment->PaymentMethod == 1 ? 'E-Wallet' : 'Cash' }}
                    </div>
                </td>
            </tr>
        </table>

        <table class="items-table">
            <thead>
                <tr>
                    <th>Description</th>
                    <th class="text-right">Weight</th>
                    <th class="text-right">Price (RM)</th>
                </tr>
            </thead>
            <tbody>
                @forelse($items as $item)
                <tr>
                    <td>
                        <div class="item-title">{{ $item->CourierID }} Parcel</div>
                        <div class="item-sub">{{ $item->TrackingNum }}</div>
                    </td>
                    <td class="text-right">{{ $item->Weight }} kg</td>
                    <td class="text-right">{{ number_format($item->Price, 2) }}</td>
                </tr>
                @empty
                <tr>
                    <td colspan="3" style="text-align: center; color: #999;">No items found</td>
                </tr>
                @endforelse
            </tbody>
        </table>

        @php
            $basePrice = $payment->Price - $payment->PaymentPenalty;
        @endphp

        <table class="totals">
            <tr>
                <td class="text-right" style="color: #718096;">Subtotal</td>
                <td class="text-right" style="width: 120px;">{{ number_format($basePrice, 2) }}</td>
            </tr>
            <tr>
                <td class="text-right" style="color: #e53e3e;">Late Penalty Fee</td>
                <td class="text-right" style="color: #e53e3e;">+ {{ number_format($payment->PaymentPenalty, 2) }}</td>
            </tr>
            <tr>
                <td class="text-right total-row">Total Paid</td>
                <td class="text-right total-row">RM {{ number_format($payment->Price, 2) }}</td>
            </tr>
        </table>

        <div class="footer">
            Thank you for using KPZParcel.<br>
            This is a computer-generated receipt.
        </div>
    </div>
</body>
</html>