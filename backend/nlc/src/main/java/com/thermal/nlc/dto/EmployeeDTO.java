package com.thermal.nlc.dto;

import java.time.LocalDate;

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
    private String employeeCode;
    private String employeeName;
    private String department;
    private Integer stationId;
    private Integer unitId;
    private String stationName;
    private String unitName;
    private String role;
    private String phone;
    private String email;
    private LocalDate createdAt;
}
