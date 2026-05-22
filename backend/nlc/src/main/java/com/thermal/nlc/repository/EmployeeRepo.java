package com.thermal.nlc.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.thermal.nlc.model.Employee;
@Repository
public interface EmployeeRepo extends JpaRepository<Employee,Integer> {

    @Query("""
        SELECT e FROM Employee e
        LEFT JOIN e.createdBy cb
        WHERE 
        LOWER(e.employeeName) LIKE LOWER(CONCAT('%',:keyword,'%')) OR
        LOWER(e.department) LIKE LOWER(CONCAT('%',:keyword,'%')) OR
        LOWER(e.role.name) LIKE LOWER(CONCAT('%',:keyword,'%')) OR
        LOWER(e.employeeCode) LIKE LOWER(CONCAT('%',:keyword,'%')) OR
        LOWER(e.station.stationName) LIKE LOWER(CONCAT('%',:keyword,'%')) OR
        LOWER(e.unit.unitName) LIKE LOWER(CONCAT('%',:keyword,'%')) OR
        LOWER(cb.username) LIKE LOWER(CONCAT('%',:keyword,'%')) OR
        CAST(e.station.stationId AS String) LIKE %:keyword% OR
        CAST(e.unit.unitId AS String) LIKE %:keyword% OR
        LOWER(e.phone) LIKE LOWER(CONCAT('%',:keyword,'%')) OR
        LOWER(e.email) LIKE LOWER(CONCAT('%',:keyword,'%')) 
        """)
    List<Employee> searchEmployee(@Param("keyword") String keyword);

    List<Employee> findByStation_StationId(Integer stationId);
    List<Employee> findByUnit_UnitId(Integer unitId);
    List<Employee> findByCreatedBy_Id(Integer userId);
    boolean existsByEmployeeCodeIgnoreCase(String employeeCode);
    boolean existsByEmployeeCodeIgnoreCaseAndIdNot(String employeeCode, Integer id);
    boolean existsByEmailIgnoreCase(String email);
    boolean existsByEmailIgnoreCaseAndIdNot(String email, Integer id);
}
