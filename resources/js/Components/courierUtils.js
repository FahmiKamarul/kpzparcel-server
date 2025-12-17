
export const getCourierLogo = (CourierID) => {
    let logoFileName;
    switch (CourierID) {
        case 'DHL':
            logoFileName = 'DHL_logo.png';
            break;
        case 'SPX':
            logoFileName = 'SPX_logo.png';
            break;
        case 'JNT':
            logoFileName = 'J&T_logo.png';
            break;
        case 'POS':
            logoFileName = 'PosLaju_logo.png';
            break;
        default:
            logoFileName = 'PosLaju_logo.png';
            break;
    }
    return `/storage/images/${logoFileName}`; 
};