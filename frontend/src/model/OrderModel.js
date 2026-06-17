class OrderModel {
   constructor (idOrder,
      deliveryAddress,
      totalPrice,
      totalPriceProduct,
      feeDelivery,
      feePayment,
      dateCreated,
      status,
      paymentStatus,
      user,
      fullName,
      phoneNumber,
      note,
      namePayment,
      nameDelivery) {
         this.idOrder = idOrder;
         this.deliveryAddress = deliveryAddress;
         this.totalPrice = totalPrice;
         this.totalPriceProduct = totalPriceProduct;
         this.feeDelivery = feeDelivery;
         this.feePayment = feePayment;
         this.dateCreated = dateCreated;
         this.status = status;
         this.paymentStatus = paymentStatus;
         this.user = user;
         this.fullName = fullName;
         this.phoneNumber = phoneNumber;
         this.note = note;
         this.namePayment = namePayment;
         this.nameDelivery = nameDelivery;
   }
}

export default OrderModel;
