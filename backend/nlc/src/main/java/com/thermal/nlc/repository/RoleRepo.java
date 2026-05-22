package com.thermal.nlc.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.thermal.nlc.model.Role;

@Repository
public interface RoleRepo extends JpaRepository<Role, Integer> {
    Optional<Role> findByNameIgnoreCase(String name);
}
