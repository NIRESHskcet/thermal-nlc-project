package com.thermal.nlc.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
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
    @NotNull(message = "employee id is required")
    private Integer employeeId;
    private String employeeName;
    @NotNull(message = "shift id is required")
    private Integer shiftId;
    private String shiftName;
    @NotNull(message = "assign date is required")
    @PastOrPresent(message = "assign date cannot be in the future")
    private LocalDate assignDate;
}
