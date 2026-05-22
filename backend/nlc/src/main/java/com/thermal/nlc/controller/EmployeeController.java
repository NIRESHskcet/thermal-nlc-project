package com.thermal.nlc.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.thermal.nlc.dto.EmployeeDTO;
import com.thermal.nlc.model.Employee;
import com.thermal.nlc.service.EmployeeService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;


@RestController
@RequestMapping("/employees")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @PostMapping
    public ResponseEntity<EmployeeDTO> addEmployee( @Valid @RequestBody Employee employee){
        return new ResponseEntity<>(employeeService.addEmployee(employee),HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<EmployeeDTO>> getAllEmployee(){
        return new ResponseEntity<>(employeeService.getAllEmployee(),HttpStatus.OK);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<EmployeeDTO> getEmployeeById(@PathVariable Integer id){
        EmployeeDTO emp = employeeService.getEmployeeById(id);
        if(emp != null)
            return new ResponseEntity<>(emp,HttpStatus.OK);
        else
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @GetMapping("/search")
    public ResponseEntity<List<EmployeeDTO>> searchEmployee(@RequestParam String keyword){
        return new ResponseEntity<>(employeeService.searchEmployee(keyword),HttpStatus.OK);
    }

    @GetMapping("/stationId/{stationId}")
    public ResponseEntity<List<EmployeeDTO>> findByStationId(@PathVariable Integer stationId){
        return new ResponseEntity<>(employeeService.findByStationId(stationId),HttpStatus.OK);
    }

    @GetMapping("/unitId/{unitId}")
    public ResponseEntity<List<EmployeeDTO>> findByUnitId(@PathVariable Integer unitId){
        return new ResponseEntity<>(employeeService.findByUnitId(unitId),HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EmployeeDTO> updateEmployee(@PathVariable Integer id, @Valid @RequestBody EmployeeDTO employeeDto){
        EmployeeDTO updated = employeeService.getEmployeeById(id);
        if(updated != null){
            return new ResponseEntity<>(employeeService.updateEmployee(id, employeeDto),HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteEmployee(@PathVariable Integer id){
        EmployeeDTO employee = employeeService.getEmployeeById(id);
        if(employee != null){
            employeeService.deleteEmployee(id);
            return new ResponseEntity<>("Employee deleted successfully",HttpStatus.OK);
        }
        return new ResponseEntity<>("Employee not found",HttpStatus.NOT_FOUND);
    }
}
