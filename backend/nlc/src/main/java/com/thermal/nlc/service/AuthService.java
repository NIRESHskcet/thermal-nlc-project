package com.thermal.nlc.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.thermal.nlc.dto.ChangePasswordRequest;
import com.thermal.nlc.dto.LoginResponse;
import com.thermal.nlc.dto.UserProfileDTO;
import com.thermal.nlc.exception.UserNotFoundException;
import com.thermal.nlc.model.Users;
import com.thermal.nlc.repository.UsersRepo;

@Service
public class AuthService {

    @Autowired
    private UsersRepo usersRepo;

    /**
     * Validates credentials against registered Users records only.
     */
    public Optional<LoginResponse> login(String username, String password) {
        return usersRepo.findByUsernameIgnoreCase(username.trim())
                .filter(user -> user.getPassword() != null && user.getPassword().equals(password))
                .map(this::toLoginResponse);
    }

    public Optional<UserProfileDTO> getProfile(Integer userId) {
        return usersRepo.findById(userId).map(this::toProfileDto);
    }

    public boolean changePassword(ChangePasswordRequest request) {
        Users user = usersRepo.findById(request.getUserId())
                .orElseThrow(() -> new UserNotFoundException("User not found with id " + request.getUserId()));
        if (user.getPassword() == null || !user.getPassword().equals(request.getCurrentPassword())) {
            return false;
        }
        user.setPassword(request.getNewPassword());
        usersRepo.save(user);
        return true;
    }

    private LoginResponse toLoginResponse(Users user) {
        LoginResponse response = new LoginResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setRole(user.getRole());
        response.setEmployeeId(user.getEmployee().getId());
        return response;
    }

    private UserProfileDTO toProfileDto(Users user) {
        UserProfileDTO dto = new UserProfileDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setRole(user.getRole());
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
        return dto;
    }
}
