package com.thermal.nlc.model;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Email;
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
@Entity
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @OneToMany(mappedBy = "employee",cascade = CascadeType.REMOVE)
    private List<EmployeeShift> employeeShift;
    @NotBlank(message = "employee's code is required")
    @Column(nullable = false, unique = true)
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
    @ManyToOne
    @JoinColumn(name = "role_id")
    @NotNull(message = "role is required")
    private Role role;
    @ManyToOne
    @JoinColumn(name = "created_by_user_id")
    private Users createdBy;
    @NotBlank(message = "phone number is required")
    @Size(min = 10,max=10,message = "phone number must be 10 digits")
    @Pattern(regexp = "^[0-9]{10}$", message = "phone number must contain only 10 digits")
    private String phone;
    @NotBlank(message = "email is required")
    @Email(message = "email is invalid")
    @Column(nullable = false, unique = true)
    private String email;
    private LocalDate date;



}
