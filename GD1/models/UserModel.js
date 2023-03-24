module.exports = class UserModel {
    constructor(id, email, password, firstname, lastname, image) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.firstname = firstname;
        this.lastname = lastname;
        this.image = image;
    }
}