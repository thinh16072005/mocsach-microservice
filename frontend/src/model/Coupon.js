class Coupon {
    constructor(idCoupon, code, discountPercent, expiryDate, isUsed, isActive) {
        this.idCoupon = idCoupon;
        this.code = code;
        this.discountPercent = discountPercent;
        this.expiryDate = expiryDate;
        this.isUsed = isUsed;
        this.isActive = isActive;
    }
}

export default Coupon;
