<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Receipt #{{ $payment->PaymentID }}</title>
    <style>
        body { font-family: 'Helvetica', sans-serif; color: #333; font-size: 14px; line-height: 1.6; }
        .container { width: 100%; max-width: 700px; margin: 0 auto; padding: 20px; }
        
        /* Header & Logo */
        .header-table { width: 100%; border-bottom: 2px solid #eee; margin-bottom: 30px; padding-bottom: 20px; }
        .header-table td { vertical-align: top; }
        
        .company-info { font-size: 12px; color: #555; line-height: 1.4; margin-top: 10px; }
        .company-name { font-weight: bold; color: #2d3748; font-size: 14px; }

        .receipt-info { text-align: right; }
        .receipt-info h1 { margin: 0; color: #2d3748; text-transform: uppercase; font-size: 24px; }
        .receipt-info p { margin: 5px 0 0; color: #718096; }

        .badge { background: #e6fffa; color: #2c7a7b; padding: 5px 10px; border-radius: 15px; font-size: 12px; font-weight: bold; border: 1px solid #b2f5ea; display: inline-block; margin-top: 10px; }

        /* General Tables */
        .details { width: 100%; margin-bottom: 30px; }
        .details td { vertical-align: top; }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .text-left { text-align: left; }
        
        .label { font-size: 10px; text-transform: uppercase; color: #718096; font-weight: bold; letter-spacing: 1px; }
        .value { font-size: 14px; font-weight: bold; color: #1a202c; }

        /* Items Table Styling */
        .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        .items-table th { background: #f7fafc; padding: 10px; border-bottom: 1px solid #e2e8f0; font-size: 11px; text-transform: uppercase; color: #4a5568; }
        .items-table td { padding: 10px; border-bottom: 1px solid #edf2f7; font-size: 13px; vertical-align: middle; }

        /* Typography for Items */
        .tracking-num { font-weight: bold; color: #2d3748; font-size: 14px; }
        .courier-name { font-size: 12px; color: #718096; margin-bottom: 4px; }
        .meta-info { font-size: 11px; color: #718096; margin-top: 2px; }
        .meta-info span { margin-right: 10px; }
        
        .penalty-text { color: #e53e3e; font-size: 12px; }

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
        
        <table class="header-table">
            <tr>
                <td style="width: 60%;">
                    <img src="{{ public_path('storage/images/KpzParcel_logo.png') }}" style="height: 100px; margin-bottom: 10px;" alt="Logo">
                    
                    <div class="company-info">
                        <div class="company-name">One Stop Center</div>
                        Kolej Pendeta Za'ba<br>
                        Universiti Kebangsaan Malaysia<br>
                        43600, Bangi
                    </div>
                </td>
                <td class="receipt-info">
                    <h1>Official Receipt</h1>
                    <p>Transaction ID: #{{ $payment->PaymentID }}</p>
                    <span class="badge">PAID</span>
                </td>
            </tr>
        </table>

        <table class="details">
            <tr>
                <td>
                    <div class="label">Payment Date</div>
                    <div class="value">{{ $payment->created_at->setTimezone('Asia/Kuala_Lumpur')->format('d M Y, h:i A') }}</div>
                </td>
                <td class="text-right">
                    <div class="label">Payment Method</div>
                    <div class="value">{{ $payment->PaymentMethod == 1 ? 'E-Wallet' : 'Cash' }}</div>
                </td>
            </tr>
        </table>

        <table class="items-table">
            <thead>
                <tr>
                    <th class="text-left" style="width: 45%">Parcel Details</th>
                    <th class="text-center">Weight</th>
                    <th class="text-right">Price</th>
                    <th class="text-right">Penalty</th>
                    <th class="text-right">Total</th>
                </tr>
            </thead>
            <tbody>
                @forelse($items as $item)
                    @php
                        // 1. PHP Logic for Courier Logo
                        $logoFileName = 'PosLaju_logo.png'; // Default
                        
                        switch ($item->CourierID) {
                            case 'DHL': $logoFileName = 'DHL_logo.png'; break;
                            case 'SPX': $logoFileName = 'SPX_logo.png'; break;
                            case 'JNT': $logoFileName = 'J&T_logo.png'; break;
                            case 'POS': $logoFileName = 'PosLaju_logo.png'; break;
                            default:    $logoFileName = 'PosLaju_logo.png'; break;
                        }

                        // 2. Generate Full Path for PDF
                        // Ensure your folder name matches exactly ('images' vs 'image')
                        $logoPath = public_path('storage/images/' . $logoFileName);

                        // 3. Penalty Logic
                        $arrivalDate = \Carbon\Carbon::parse($item->DateArrive)->startOfDay();
                        $paymentDate = $payment->created_at->copy()->startOfDay();
                        $diffDays = $arrivalDate->diffInDays($paymentDate);
                        $overdueDays = max(0, $diffDays - 4);
                        $penalty = $overdueDays * 1; 
                        $basePrice = $item->Price;
                        $totalItemPrice = $basePrice + $penalty;
                    @endphp

                <tr>
                    <td>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="width: 45px; border: none; padding: 0; vertical-align: middle;">
                                    <img src="{{ $logoPath }}" style="width: 35px; height: auto; display: block;" alt="C">
                                </td>
                                
                                <td style="border: none; padding: 0 0 0 8px; vertical-align: top;">
                                    <div class="tracking-num">{{ $item->TrackingNum }}</div>
                                    <div class="courier-name">{{ $item->CourierID }} Parcel</div>
                                    <div class="meta-info">
                                        <span>Shelf: <b>{{ $item->ShelfNum }}</b></span>
                                        <span>Arrived: {{ $arrivalDate->format('d/m/Y') }}</span>
                                    </div>
                                </td>
                            </tr>
                        </table>
                    </td>
                    
                    <td class="text-center">{{ $item->Weight }} kg</td>
                    <td class="text-right">RM {{ number_format($basePrice, 2) }}</td>
                    
                    <td class="text-right">
                        @if($penalty > 0)
                            <span class="penalty-text">+ RM {{ number_format($penalty, 2) }}</span>
                            <br><span style="font-size:9px; color:#e53e3e;">({{ $overdueDays }} days late)</span>
                        @else
                            -
                        @endif
                    </td>
                    
                    <td class="text-right">
                        <b>RM {{ number_format($totalItemPrice, 2) }}</b>
                    </td>
                </tr>
                @empty
                <tr>
                    <td colspan="5" class="text-center" style="color: #999;">No items found</td>
                </tr>
                @endforelse
            </tbody>
        </table>

        @php
            $grandBasePrice = $payment->Price - $payment->PaymentPenalty;
        @endphp

        <table class="totals">
            <tr>
                <td class="text-right" style="color: #718096;">Base Amount</td>
                <td class="text-right" style="width: 120px;">{{ number_format($grandBasePrice, 2) }}</td>
            </tr>
            @if($payment->PaymentPenalty > 0)
            <tr>
                <td class="text-right" style="color: #e53e3e;">Total Penalty Fee</td>
                <td class="text-right" style="color: #e53e3e;">+ {{ number_format($payment->PaymentPenalty, 2) }}</td>
            </tr>
            @endif
            <tr>
                <td class="text-right total-row">Grand Total</td>
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