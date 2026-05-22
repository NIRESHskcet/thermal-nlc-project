package com.thermal.nlc.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.thermal.nlc.model.Role;
import com.thermal.nlc.repository.RoleRepo;

@Service
public class RoleService {

    @Autowired
    private RoleRepo roleRepo;

    public List<Role> getAllRoles() {
        return roleRepo.findAll();
    }

    public Optional<Role> getRoleById(Integer id) {
        return roleRepo.findById(id);
    }

    public Optional<Role> getRoleByName(String name) {
        return roleRepo.findByNameIgnoreCase(name);
    }

    public Role createRole(Role role) {
        if (roleRepo.findByNameIgnoreCase(role.getName()).isPresent()) {
            throw new com.thermal.nlc.exception.DuplicateResourceException("Role already exists: " + role.getName());
        }
        return roleRepo.save(role);
    }

    public void deleteRole(Integer id) {
        if (!roleRepo.existsById(id)) {
            throw new com.thermal.nlc.exception.BadRequestException("Role not found with id " + id);
        }
        roleRepo.deleteById(id);
    }
}
