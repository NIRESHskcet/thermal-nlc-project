package com.thermal.nlc.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Integer id;
    @NotNull(message = "employee id is required")
    private Integer EmployeeId;
    private String employeeName;
    @NotBlank(message = "username is required")
    private String username;
    @Email(message = "email is invalid")
    private String email;
    private Integer roleId;
    @NotBlank(message = "role is required")
    private String role;
    private LocalDateTime createdAt;
}
