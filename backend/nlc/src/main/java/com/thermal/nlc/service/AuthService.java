package com.thermal.nlc.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.thermal.nlc.dto.ChangePasswordRequest;
import com.thermal.nlc.dto.LoginResponse;
import com.thermal.nlc.dto.UserProfileDTO;
import com.thermal.nlc.exception.UserNotFoundException;
import com.thermal.nlc.model.Users;
import com.thermal.nlc.repository.UsersRepo;
import com.thermal.nlc.security.JwtUtil;

@Service
public class AuthService {

    @Autowired
    private UsersRepo usersRepo;

    @Autowired
    private JwtUtil jwtUtil;                  // ← ADD

    @Autowired
    private PasswordEncoder passwordEncoder;  // ← ADD

    public Optional<LoginResponse> login(String username, String password) {
    return usersRepo.findByUsernameIgnoreCase(username.trim())
            .filter(user -> {
                System.out.println("=== LOGIN DEBUG ===");
                System.out.println("Found user: " + user.getUsername());
                System.out.println("DB password: [" + user.getPassword() + "]");
                System.out.println("Input password: [" + password + "]");
                boolean match = passwordEncoder.matches(password, user.getPassword());
                System.out.println("Match result: " + match);
                System.out.println("===================");
                return user.getPassword() != null && match;
            })
            .map(this::toLoginResponse);
    }

    public Optional<UserProfileDTO> getProfile(Integer userId) {
        return usersRepo.findById(userId).map(this::toProfileDto);
    }

    public boolean changePassword(ChangePasswordRequest request) {
        Users user = usersRepo.findById(request.getUserId())
                .orElseThrow(() -> new UserNotFoundException("User not found with id " + request.getUserId()));
        if (user.getPassword() == null
                || !passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {  // ← BCrypt check
            return false;
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));  // ← BCrypt encode
        usersRepo.save(user);
        return true;
    }

    private LoginResponse toLoginResponse(Users user) {
        LoginResponse response = new LoginResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        String role = resolveRoleName(user);
        response.setRole(role);
        if (user.getEmployee() != null) {
            response.setEmployeeId(user.getEmployee().getId());
        }
        response.setToken(jwtUtil.generateToken(user.getUsername(), role));  // ← ADD
        return response;
    }

    private UserProfileDTO toProfileDto(Users user) {
        UserProfileDTO dto = new UserProfileDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setRole(resolveRoleName(user));
        if (user.getEmployee() != null) {
            dto.setEmployeeId(user.getEmployee().getId());
            dto.setEmployeeCode(user.getEmployee().getEmployeeCode());
            dto.setEmployeeName(user.getEmployee().getEmployeeName());
            dto.setDepartment(user.getEmployee().getDepartment());
            dto.setEmail(user.getEmail() != null ? user.getEmail() : user.getEmployee().getEmail());
            dto.setPhone(user.getEmployee().getPhone());
            if (user.getEmployee().getStation() != null) {
                dto.setStationName(user.getEmployee().getStation().getStationName());
            }
            if (user.getEmployee().getUnit() != null) {
                dto.setUnitName(user.getEmployee().getUnit().getUnitName());
            }
        } else {
            dto.setEmail(user.getEmail());
        }
        return dto;
    }

    private String resolveRoleName(Users user) {
        return user.getRole() != null ? user.getRole().getName() : "OPERATOR";
    }
}