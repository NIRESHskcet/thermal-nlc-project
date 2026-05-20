package com.thermal.nlc.model;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @OneToMany(mappedBy = "employee",cascade = CascadeType.REMOVE)
    private List<EmployeeShift> employeeShift;
    @NotBlank(message = "employee's code is required")
    private String employeeCode;
    @NotBlank(message = "Employee's name is required")
    private String employeeName;
    @NotBlank(message = "department is required")
    private String department;
    @ManyToOne
    @JoinColumn(name = "station_id")
    @NotNull(message = "stationId is required")
    private Station station;
    @ManyToOne
    @JoinColumn(name = "unit_id")
    @NotNull(message = "unitId is required")
    private Unit unit;
    @NotBlank(message = "role is required")
    private String role;
    @NotBlank(message = "phone number is required")
    @Size(min = 10,max=10,message = "phone number must be 10 digits")
    private String phone;
    @NotBlank(message = "email is invalid")
    private String email;
    private LocalDate date;



}
