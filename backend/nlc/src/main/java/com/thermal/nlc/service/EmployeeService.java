package com.thermal.nlc.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.thermal.nlc.dto.EmployeeDTO;
import com.thermal.nlc.exception.EmployeeNotFoundException;
import com.thermal.nlc.model.Employee;
import com.thermal.nlc.model.Station;
import com.thermal.nlc.model.Unit;
import com.thermal.nlc.repository.EmployeeRepo;
import com.thermal.nlc.repository.StationRepo;
import com.thermal.nlc.repository.UnitRepo;

@Service
public class EmployeeService {
    @Autowired
    private EmployeeRepo employeeRepo;

    @Autowired
    private StationRepo stationRepo;

    @Autowired
    private UnitRepo unitRepo;

    public EmployeeDTO addEmployee(Employee employee){
        employee.setDate(LocalDate.now());
        Employee saved =  employeeRepo.save(employee);
        Employee e = employeeRepo.findById(saved.getId()).orElse(null);
        EmployeeDTO dto = new EmployeeDTO();
        dto.setId(e.getId());
        dto.setEmployeeCode(e.getEmployeeCode());
        dto.setEmployeeName(e.getEmployeeName());
        dto.setDepartment(e.getDepartment());
        dto.setStationId(e.getStation().getStationId());
        dto.setUnitId(e.getUnit().getUnitId());
        dto.setStationName(e.getStation().getStationName());
        dto.setUnitName(e.getUnit().getUnitName());
        dto.setRole(e.getRole());
        dto.setPhone(e.getPhone());
        dto.setEmail(e.getEmail());
        return dto;
    }
    
    public List<EmployeeDTO> getAllEmployee(){
        List<Employee> emp = employeeRepo.findAll();
        List<EmployeeDTO> dtoList = new ArrayList<>();
        for(Employee e : emp){
            EmployeeDTO dto = new EmployeeDTO();
            dto.setId(e.getId());
            dto.setEmployeeCode(e.getEmployeeCode());
            dto.setEmployeeName(e.getEmployeeName());
            dto.setDepartment(e.getDepartment());
            dto.setStationId(e.getStation().getStationId());
            dto.setUnitId(e.getUnit().getUnitId());
            dto.setStationName(e.getStation().getStationName());
            dto.setUnitName(e.getUnit().getUnitName());
            dto.setRole(e.getRole());
            dto.setPhone(e.getPhone());
            dto.setEmail(e.getEmail());
            dto.setCreatedAt(e.getDate());
            dtoList.add(dto);
        }
        return dtoList;
    }

    public List<EmployeeDTO> searchEmployee(String keyword){
        List<Employee> employee = employeeRepo.searchEmployee(keyword);
        List<EmployeeDTO> dtoList = new ArrayList<>();
        for(Employee e : employee){
            EmployeeDTO dto = new EmployeeDTO();
            dto.setId(e.getId());
            dto.setEmployeeCode(e.getEmployeeCode());
            dto.setEmployeeName(e.getEmployeeName());
            dto.setDepartment(e.getDepartment());
            dto.setStationId(e.getStation().getStationId());
            dto.setUnitId(e.getUnit().getUnitId());
            dto.setStationName(e.getStation().getStationName());
            dto.setUnitName(e.getUnit().getUnitName());
            dto.setRole(e.getRole());
            dto.setPhone(e.getPhone());
            dto.setEmail(e.getEmail());
            dto.setCreatedAt(e.getDate());
            dtoList.add(dto);
        }
        return dtoList;

    }

    public EmployeeDTO getEmployeeById(Integer id){
        Employee e = employeeRepo.findById(id).orElseThrow(()-> new EmployeeNotFoundException("Employee Not Found with id "+id));
        EmployeeDTO dto = new EmployeeDTO();
        dto.setId(e.getId());
        dto.setEmployeeCode(e.getEmployeeCode());
        dto.setEmployeeName(e.getEmployeeName());
        dto.setDepartment(e.getDepartment());
        dto.setStationId(e.getStation().getStationId());
        dto.setUnitId(e.getUnit().getUnitId());
        dto.setStationName(e.getStation().getStationName());
        dto.setUnitName(e.getUnit().getUnitName());
        dto.setRole(e.getRole());
        dto.setPhone(e.getPhone());
        dto.setEmail(e.getEmail());
        dto.setCreatedAt(e.getDate());
        return dto;
    }

    public List<EmployeeDTO> findByStationId(Integer stationId){
        List<Employee> employee = employeeRepo.findByStation_StationId(stationId);
        List<EmployeeDTO> dtoList = new ArrayList<>();
        for(Employee e : employee){
            EmployeeDTO dto = new EmployeeDTO();
            BeanUtils.copyProperties(e, dto);
            dto.setStationId(e.getStation().getStationId());
            dto.setUnitId(e.getUnit().getUnitId());
            dto.setStationName(e.getStation().getStationName());
            dto.setUnitName(e.getUnit().getUnitName());
            dto.setCreatedAt(e.getDate());
            dtoList.add(dto);
        }
        return dtoList;
    }

    public List<EmployeeDTO> findByUnitId(Integer unitId){
        List<Employee> employee = employeeRepo.findByUnit_UnitId(unitId);
        List<EmployeeDTO> dtoList = new ArrayList<>();
        for(Employee e : employee){
            EmployeeDTO dto = new EmployeeDTO();
            BeanUtils.copyProperties(e, dto);
            dto.setStationId(e.getStation().getStationId());
            dto.setUnitId(e.getUnit().getUnitId());
            dto.setStationName(e.getStation().getStationName());
            dto.setUnitName(e.getUnit().getUnitName());
            dto.setCreatedAt(e.getDate());
            dtoList.add(dto);
        }
        return dtoList;
    }

    public EmployeeDTO updateEmployee(Integer id, EmployeeDTO dto){
        Employee existing = employeeRepo.findById(id).orElseThrow(() -> new EmployeeNotFoundException("Employee Not Found with id "+id));
        existing.setEmployeeCode(
            dto.getEmployeeCode()
        );

        existing.setEmployeeName(
            dto.getEmployeeName()
        );

        existing.setDepartment(
            dto.getDepartment()
        );

        existing.setRole(
            dto.getRole()
        );

        existing.setPhone(
            dto.getPhone()
        );

        existing.setEmail(
            dto.getEmail()
        );

        Station station =
            stationRepo.findById(
                dto.getStationId()
            ).orElse(null);

        Unit unit =
            unitRepo.findById(
                dto.getUnitId()
            ).orElse(null);

        existing.setStation(station);

        existing.setUnit(unit);

        Employee updated =
            employeeRepo.save(existing);

        EmployeeDTO response =
            new EmployeeDTO();

        response.setId(updated.getId());

        response.setEmployeeCode(
            updated.getEmployeeCode()
        );

        response.setEmployeeName(
            updated.getEmployeeName()
        );

        response.setDepartment(
            updated.getDepartment()
        );

        response.setStationId(
            updated.getStation().getStationId()
        );

        response.setUnitId(
            updated.getUnit().getUnitId()
        );

        response.setStationName(
            updated.getStation().getStationName()
        );

        response.setUnitName(
            updated.getUnit().getUnitName()
        );

        response.setRole(
            updated.getRole()
        );

        response.setPhone(
            updated.getPhone()
        );

        response.setEmail(
            updated.getEmail()
        );
        response.setCreatedAt(updated.getDate());
        return response;
    }
    public void deleteEmployee(Integer id){
        Employee employee =
            employeeRepo.findById(id)
            .orElseThrow(() ->
                new EmployeeNotFoundException(
                    "Employee not found with id " + id
                )
            );

        employeeRepo.delete(employee);
    }
}
