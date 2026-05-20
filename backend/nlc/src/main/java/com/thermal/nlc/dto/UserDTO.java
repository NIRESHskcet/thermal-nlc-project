package com.thermal.nlc.dto;

import java.time.LocalDateTime;

import com.thermal.nlc.model.Role;

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
    private Integer EmployeeId;
    private String username;
    private Role role;
    private LocalDateTime createdAt;
}
