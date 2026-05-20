package com.thermal.nlc.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.thermal.nlc.model.Role;
import com.thermal.nlc.model.Users;
@Repository
public interface UsersRepo extends JpaRepository<Users,Integer>{
    @Query("""
        SELECT u FROM Users u
        WHERE
        LOWER(u.username) LIKE LOWER(CONCAT('%',:keyword,'%')) OR
        LOWER(u.email) LIKE LOWER(CONCAT('%',:keyword,'%')) OR
        LOWER(u.password) LIKE LOWER(CONCAT('%',:keyword,'%')) OR
        CAST(u.employee.id AS String) LIKE %:keyword% OR
        CAST(u.role AS String) LIKE %:keyword% OR
        CAST(u.createdAt AS String) LIKE %:keyword%
    """)
    List<Users> searchUser(@Param("keyword") String keyword);

    List<Users> findByRole(Role role);

    Users findByEmployee_Id(Integer employeeId);

    Optional<Users> findByUsernameIgnoreCase(String username);
}
