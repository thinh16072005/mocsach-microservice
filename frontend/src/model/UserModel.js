class UserModel {
   constructor(
      idUser,
      dateOfBirth,
      deliveryAddress,
      email,
      firstName,
      lastName,
      gender,
      password,
      phoneNumber,
      username,
      avatar,
      enabled
   ) {
      this.idUser = idUser;
      this.dateOfBirth = dateOfBirth;
      this.deliveryAddress = deliveryAddress;
      this.email = email;
      this.firstName = firstName;
      this.lastName = lastName;
      this.gender = gender;
      this.password = password;
      this.phoneNumber = phoneNumber;
      this.username = username;
      this.avatar = avatar;
      this.enabled = enabled;
   }
}

export default UserModel;
