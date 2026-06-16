package com.bookstore.user.dto.request;

import lombok.Data;
import java.sql.Date;

@Data
public class UpdateProfileRequest {
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private Character gender;
    private Date dateOfBirth;
    private String deliveryAddress;
    private String avatar;
}
