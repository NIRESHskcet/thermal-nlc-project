package com.thermal.nlc.model;

import java.time.LocalDate;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
@Entity
public class EmployeeShift {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne
    @JoinColumn(name = "employee_id")
    @NotNull(message = "employeeId is required")
    private Employee employee;
    @ManyToOne
    @JoinColumn(name = "shift_id")
    @NotNull(message = "shiftId is required")
    private Shift shift;
    @NotNull(message = "Date and Time is required")
    @PastOrPresent(message = "assign date cannot be in the future")
    private LocalDate assignDate;

}
