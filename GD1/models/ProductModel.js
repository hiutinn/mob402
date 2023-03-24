module.exports = class ProductModel {
    constructor(id, name, price, image, color, type, userId, userName) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.image = image;
        this.color = color;
        this.type = type;
        this.userId = userId;
        this.userName = userName;
    }
}