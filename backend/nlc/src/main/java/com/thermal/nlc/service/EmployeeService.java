package com.thermal.nlc.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.thermal.nlc.dto.EmployeeDTO;
import com.thermal.nlc.exception.DuplicateResourceException;
import com.thermal.nlc.exception.EmployeeNotFoundException;
import com.thermal.nlc.exception.StationNotFoundException;
import com.thermal.nlc.exception.UnitNotFoundException;
import com.thermal.nlc.exception.UserNotFoundException;
import com.thermal.nlc.model.Employee;
import com.thermal.nlc.model.Role;
import com.thermal.nlc.model.Station;
import com.thermal.nlc.model.Unit;
import com.thermal.nlc.model.Users;
import com.thermal.nlc.repository.EmployeeRepo;
import com.thermal.nlc.repository.RoleRepo;
import com.thermal.nlc.repository.StationRepo;
import com.thermal.nlc.repository.UnitRepo;
import com.thermal.nlc.repository.UsersRepo;

@Service
public class EmployeeService {
    @Autowired
    private EmployeeRepo employeeRepo;

    @Autowired
    private StationRepo stationRepo;

    @Autowired
    private UnitRepo unitRepo;

    @Autowired
    private RoleRepo roleRepo;

    @Autowired
    private UsersRepo usersRepo;

    public EmployeeDTO addEmployee(Employee employee) {
        validateUniqueEmployee(employee.getEmployeeCode(), employee.getEmail(), null);
        employee.setDate(LocalDate.now());
        employee.setStation(resolveStation(employee.getStation() != null ? employee.getStation().getStationId() : null));
        employee.setUnit(resolveUnit(employee.getUnit() != null ? employee.getUnit().getUnitId() : null));
        employee.setRole(resolveRole(employee.getRole() != null ? employee.getRole().getName() : null, employee.getRole() != null ? employee.getRole().getId() : null));
        if (employee.getCreatedBy() != null && employee.getCreatedBy().getId() != null) {
            employee.setCreatedBy(resolveUser(employee.getCreatedBy().getId()));
        }
        return toDto(employeeRepo.save(employee));
    }

    public List<EmployeeDTO> getAllEmployee() {
        return employeeRepo.findAll().stream().map(this::toDto).toList();
    }

    public List<EmployeeDTO> searchEmployee(String keyword) {
        return employeeRepo.searchEmployee(keyword).stream().map(this::toDto).toList();
    }

    public EmployeeDTO getEmployeeById(Integer id) {
        return toDto(findEmployee(id));
    }

    public List<EmployeeDTO> findByStationId(Integer stationId) {
        return employeeRepo.findByStation_StationId(stationId).stream().map(this::toDto).toList();
    }

    public List<EmployeeDTO> findByUnitId(Integer unitId) {
        return employeeRepo.findByUnit_UnitId(unitId).stream().map(this::toDto).toList();
    }

    public EmployeeDTO updateEmployee(Integer id, EmployeeDTO dto) {
        Employee existing = findEmployee(id);
        validateUniqueEmployee(dto.getEmployeeCode(), dto.getEmail(), id);
        existing.setEmployeeCode(dto.getEmployeeCode());
        existing.setEmployeeName(dto.getEmployeeName());
        existing.setDepartment(dto.getDepartment());
        existing.setStation(resolveStation(dto.getStationId()));
        existing.setUnit(resolveUnit(dto.getUnitId()));
        existing.setRole(resolveRole(dto.getRole(), dto.getRoleId()));
        existing.setPhone(dto.getPhone());
        existing.setEmail(dto.getEmail());
        return toDto(employeeRepo.save(existing));
    }

    public void deleteEmployee(Integer id) {
        Employee employee = findEmployee(id);
        Users employeeUser = usersRepo.findByEmployee_Id(id);
        if (employeeUser != null) {
            List<Employee> employeesCreatedByUser = employeeRepo.findByCreatedBy_Id(employeeUser.getId());
            for (Employee createdEmployee : employeesCreatedByUser) {
                createdEmployee.setCreatedBy(null);
            }
            employeeRepo.saveAll(employeesCreatedByUser);
            usersRepo.delete(employeeUser);
        }
        employeeRepo.delete(employee);
    }

    private Employee findEmployee(Integer id) {
        return employeeRepo.findById(id)
                .orElseThrow(() -> new EmployeeNotFoundException("Employee not found with id " + id));
    }

    private Station resolveStation(Integer stationId) {
        if (stationId == null) {
            throw new StationNotFoundException("Station id is required");
        }
        return stationRepo.findById(stationId)
                .orElseThrow(() -> new StationNotFoundException("Station not found with id " + stationId));
    }

    private Unit resolveUnit(Integer unitId) {
        if (unitId == null) {
            throw new UnitNotFoundException("Unit id is required");
        }
        return unitRepo.findById(unitId)
                .orElseThrow(() -> new UnitNotFoundException("Unit not found with id " + unitId));
    }

    private Role resolveRole(String roleName, Integer roleId) {
        if (roleId != null) {
            return roleRepo.findById(roleId)
                    .orElseThrow(() -> new com.thermal.nlc.exception.BadRequestException("Invalid role id: " + roleId));
        }
        if (roleName == null || roleName.isBlank()) {
            throw new UserNotFoundException("Role is required");
        }
        return roleRepo.findByNameIgnoreCase(roleName)
                .orElseThrow(() -> new com.thermal.nlc.exception.BadRequestException("Invalid role: " + roleName));
    }

    private void validateUniqueEmployee(String employeeCode, String email, Integer employeeId) {
        boolean duplicateCode = employeeId == null
            ? employeeRepo.existsByEmployeeCodeIgnoreCase(employeeCode)
            : employeeRepo.existsByEmployeeCodeIgnoreCaseAndIdNot(employeeCode, employeeId);
        if (duplicateCode) {
            throw new DuplicateResourceException("Employee code already exists: " + employeeCode);
        }

        boolean duplicateEmail = employeeId == null
            ? employeeRepo.existsByEmailIgnoreCase(email)
            : employeeRepo.existsByEmailIgnoreCaseAndIdNot(email, employeeId);
        if (duplicateEmail) {
            throw new DuplicateResourceException("Employee email already exists: " + email);
        }
    }

    private Users resolveUser(Integer userId) {
        return usersRepo.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with id " + userId));
    }

    private EmployeeDTO toDto(Employee employee) {
        EmployeeDTO dto = new EmployeeDTO();
        dto.setId(employee.getId());
        dto.setEmployeeCode(employee.getEmployeeCode());
        dto.setEmployeeName(employee.getEmployeeName());
        dto.setDepartment(employee.getDepartment());
        if (employee.getStation() != null) {
            dto.setStationId(employee.getStation().getStationId());
            dto.setStationName(employee.getStation().getStationName());
        }
        if (employee.getUnit() != null) {
            dto.setUnitId(employee.getUnit().getUnitId());
            dto.setUnitName(employee.getUnit().getUnitName());
        }
        if (employee.getRole() != null) {
            dto.setRoleId(employee.getRole().getId());
            dto.setRole(employee.getRole().getName());
        }
        dto.setPhone(employee.getPhone());
        dto.setEmail(employee.getEmail());
        dto.setCreatedAt(employee.getDate());
        if (employee.getCreatedBy() != null) {
            dto.setCreatedByUserId(employee.getCreatedBy().getId());
            dto.setCreatedByUsername(employee.getCreatedBy().getUsername());
        }
        return dto;
    }
}
