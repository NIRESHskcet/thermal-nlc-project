package com.thermal.nlc.dto;

import com.thermal.nlc.model.Role;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileDTO {
    private Integer id;
    private String username;
    private Role role;
    private Integer employeeId;
    private String employeeCode;
    private String employeeName;
    private String department;
    private String email;
    private String phone;
    private String stationName;
    private String unitName;
}
