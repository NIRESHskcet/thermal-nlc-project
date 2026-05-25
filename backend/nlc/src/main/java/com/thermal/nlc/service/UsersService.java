package com.thermal.nlc.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.thermal.nlc.dto.UserDTO;
import com.thermal.nlc.exception.BadRequestException;
import com.thermal.nlc.exception.DuplicateResourceException;
import com.thermal.nlc.exception.EmployeeNotFoundException;
import com.thermal.nlc.exception.UserNotFoundException;
import com.thermal.nlc.model.Employee;
import com.thermal.nlc.model.Role;
import com.thermal.nlc.model.Users;
import com.thermal.nlc.repository.EmployeeRepo;
import com.thermal.nlc.repository.RoleRepo;
import com.thermal.nlc.repository.UsersRepo;
import org.springframework.security.crypto.password.PasswordEncoder;

@Service
public class UsersService {
    private static final String PASSWORD_PATTERN = "^(?=.*[A-Z])(?=.*\\d).{8,}$";

    @Autowired
    private UsersRepo userRepo;

    @Autowired
    private EmployeeRepo employeeRepo;

    @Autowired
    private RoleRepo roleRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserDTO addUsers(Users user) {
        Integer employeeId = user.getEmployee() != null ? user.getEmployee().getId() : null;
        validateUniqueUser(user.getUsername(), employeeId, null);
        validatePassword(user.getPassword());
        if (user.getCreatedAt() == null) {
            user.setCreatedAt(LocalDateTime.now());
        }
        user.setEmployee(resolveEmployee(employeeId));
        user.setRole(resolveRole(user.getRole() != null ? user.getRole().getName() : null, user.getRole() != null ? user.getRole().getId() : null));
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return toDto(userRepo.save(user));
    }

    public List<UserDTO> getAllUsers() {
        return userRepo.findAll().stream().map(this::toDto).toList();
    }

    public UserDTO getUserById(Integer id) {
        return toDto(findUser(id));
    }

    public List<UserDTO> searchUser(String keyword) {
        return userRepo.searchUser(keyword).stream().map(this::toDto).toList();
    }

    public List<UserDTO> findByRole(String role) {
        return userRepo.findByRole_NameIgnoreCase(role).stream().map(this::toDto).toList();
    }

    public UserDTO findUserByEmployeeId(Integer employeeId) {
        Users user = userRepo.findByEmployee_Id(employeeId);
        if (user == null) {
            throw new UserNotFoundException("User not found with employee id " + employeeId);
        }
        return toDto(user);
    }

    public UserDTO updateUsers(Integer id, UserDTO userDto) {
        Users existing = findUser(id);
        validateUniqueUser(userDto.getUsername(), userDto.getEmployeeId(), id);
        existing.setEmployee(resolveEmployee(userDto.getEmployeeId()));
        existing.setUsername(userDto.getUsername());
        if (userDto.getEmail() != null) {
            existing.setEmail(userDto.getEmail());
        }
        existing.setRole(resolveRole(userDto.getRole(), userDto.getRoleId()));
        return toDto(userRepo.save(existing));
    }

    public void deleteUser(Integer id) {
        Users user = findUser(id);
        List<Employee> employeesCreatedByUser = employeeRepo.findByCreatedBy_Id(id);
        for (Employee employee : employeesCreatedByUser) {
            employee.setCreatedBy(null);
        }
        employeeRepo.saveAll(employeesCreatedByUser);
        userRepo.delete(user);
    }

    private Users findUser(Integer id) {
        return userRepo.findById(id).orElseThrow(() -> new UserNotFoundException("User not found with id " + id));
    }

    private Employee resolveEmployee(Integer employeeId) {
        if (employeeId == null) {
            throw new EmployeeNotFoundException("Employee id is required");
        }
        return employeeRepo.findById(employeeId)
                .orElseThrow(() -> new EmployeeNotFoundException("Employee not found with id " + employeeId));
    }

    private Role resolveRole(String roleName, Integer roleId) {
        if (roleId != null) {
            return roleRepo.findById(roleId)
                    .orElseThrow(() -> new BadRequestException("Invalid role id: " + roleId));
        }
        if (roleName == null || roleName.isBlank()) {
            throw new UserNotFoundException("Role is required");
        }
        return roleRepo.findByNameIgnoreCase(roleName)
                .orElseThrow(() -> new BadRequestException("Invalid role: " + roleName));
    }

    private void validateUniqueUser(String username, Integer employeeId, Integer userId) {
        boolean duplicateUsername = userId == null
            ? userRepo.existsByUsernameIgnoreCase(username)
            : userRepo.existsByUsernameIgnoreCaseAndIdNot(username, userId);
        if (duplicateUsername) {
            throw new DuplicateResourceException("Username already exists: " + username);
        }

        boolean duplicateEmployee = userId == null
            ? userRepo.existsByEmployee_Id(employeeId)
            : userRepo.existsByEmployee_IdAndIdNot(employeeId, userId);
        if (duplicateEmployee) {
            throw new DuplicateResourceException("This employee already has a user account.");
        }
    }

    // Passwords must be strong before a user account can be created.
    private void validatePassword(String password) {
        if (password == null || !password.matches(PASSWORD_PATTERN)) {
            throw new BadRequestException("Password must be at least 8 characters and contain one uppercase letter and one number.");
        }
    }

    private UserDTO toDto(Users user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        if (user.getEmployee() != null) {
            dto.setEmployeeId(user.getEmployee().getId());
            dto.setEmployeeName(user.getEmployee().getEmployeeName());
        }
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        if (user.getRole() != null) {
            dto.setRoleId(user.getRole().getId());
            dto.setRole(user.getRole().getName());
        }
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }
}
