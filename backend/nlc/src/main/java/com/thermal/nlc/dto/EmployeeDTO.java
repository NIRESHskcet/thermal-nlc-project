package com.thermal.nlc.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeDTO {
    private Integer id;
    @NotBlank(message = "employee code is required")
    private String employeeCode;
    @NotBlank(message = "employee name is required")
    private String employeeName;
    @NotBlank(message = "department is required")
    private String department;
    @NotNull(message = "station id is required")
    private Integer stationId;
    @NotNull(message = "unit id is required")
    private Integer unitId;
    private String stationName;
    private String unitName;
    private Integer roleId;
    @NotBlank(message = "role is required")
    private String role;
    @NotBlank(message = "phone number is required")
    @Size(min = 10, max = 10, message = "phone number must be 10 digits")
    @Pattern(regexp = "^[0-9]{10}$", message = "phone number must contain only numeric values")
    private String phone;
    @NotBlank(message = "email is required")
    @Email(message = "email is invalid")
    private String email;
    private LocalDate createdAt;
    private Integer createdByUserId;
    private String createdByUsername;
}
