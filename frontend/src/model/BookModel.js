
class BookModel {
   constructor(idBook, nameBook, author, description, listPrice, sellPrice, quantity, avgRating, soldQuantity, discountPercent) {
      this.idBook = idBook;
      this.nameBook = nameBook;
      this.author = author;
      this.description = description;
      this.listPrice = listPrice;
      this.sellPrice = sellPrice;
      this.quantity = quantity;
      this.avgRating = avgRating;
      this.soldQuantity = soldQuantity;
      this.discountPercent = discountPercent;
   }
}

export default BookModel;
