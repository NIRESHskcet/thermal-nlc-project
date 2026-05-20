package com.thermal.nlc.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.thermal.nlc.dto.ChangePasswordRequest;
import com.thermal.nlc.dto.LoginRequest;
import com.thermal.nlc.dto.UserProfileDTO;
import com.thermal.nlc.service.AuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request.getUsername(), request.getPassword())
                .<ResponseEntity<?>>map(body -> ResponseEntity.ok(body))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Invalid username or password. Only registered users can sign in."));
    }

    @GetMapping("/profile/{userId}")
    public ResponseEntity<UserProfileDTO> getProfile(@PathVariable Integer userId) {
        return authService.getProfile(userId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        if (authService.changePassword(request)) {
            return ResponseEntity.ok("Password updated successfully");
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Current password is incorrect");
    }
}
