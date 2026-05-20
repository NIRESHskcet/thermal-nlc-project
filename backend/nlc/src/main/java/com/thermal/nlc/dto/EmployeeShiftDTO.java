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
public class EmployeeShiftDTO {
    private Integer id;
    private Integer employeeId;
    private String employeeName;
    private Integer shiftId;
    private String shiftName;
    private LocalDate assignDate;
}
