package com.thermal.nlc.model;


import java.time.LocalDateTime;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
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
public class Users {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @OneToOne
    @JoinColumn(name = "employee_id")
    @NotNull(message = "employee's id is required")
    private Employee employee;
    @NotBlank(message = "username is required")
    @Column(nullable = false, unique = true)
    private String username;
    @Email(message = "email is invalid")
    @Column(unique = true)
    private String  email;
    @Size(min = 8, message = "password must be at least 8 characters")
    @Pattern(regexp = "^(?=.*[A-Z])(?=.*\\d).{8,}$", message = "password must contain at least one uppercase letter and one number")
    private String password;
    @ManyToOne
    @JoinColumn(name = "role_id")
    @NotNull(message = "role is required")
    private Role role;
    private LocalDateTime createdAt;
}
