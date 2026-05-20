package com.thermal.nlc.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.thermal.nlc.dto.EmployeeShiftDTO;
import com.thermal.nlc.model.EmployeeShift;
import com.thermal.nlc.service.EmployeeShiftService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/employeeShift")
public class EmployeeShiftController {
    @Autowired
    private EmployeeShiftService shiftService;

    @PostMapping
    public ResponseEntity<EmployeeShiftDTO> addEmployeeShift( @Valid @RequestBody EmployeeShift shift){
        return new ResponseEntity<>(shiftService.addEmployeeShift(shift),HttpStatus.ACCEPTED);
    }

    @GetMapping
    public ResponseEntity<List<EmployeeShiftDTO>> getAllEmployeeShift(){
        return new ResponseEntity<>(shiftService.getAllEmployeeShift(),HttpStatus.OK);
    }

    @GetMapping("/search")
    public ResponseEntity<List<EmployeeShiftDTO>> searchEmployeeShift(@RequestParam String keyword){
        return new ResponseEntity<>(shiftService.searchEmployeeShift(keyword),HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmployeeShiftDTO> getEmployeeShiftById(@PathVariable Integer id){
        EmployeeShiftDTO employeeShift = shiftService.getEmployeeShiftById(id);
        if(employeeShift != null){
            return new ResponseEntity<>(employeeShift,HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @GetMapping("/employeeId/{employeeId}")
    public ResponseEntity<List<EmployeeShiftDTO>> getEmployeeShiftByEmployeeId(@PathVariable Integer employeeId){
        List<EmployeeShiftDTO> employee = shiftService.getEmployeeShiftByEmployeeId(employeeId);
        if(employee != null){
            return new ResponseEntity<>(employee,HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @GetMapping("/shiftId/{shiftId}")
    public ResponseEntity<List<EmployeeShiftDTO>> getEmployeeShiftByShiftId(@PathVariable Integer shiftId){
        List<EmployeeShiftDTO> employee = shiftService.getEmployeeShiftByShiftId(shiftId);
        if(employee != null){
            return new ResponseEntity<>(employee, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EmployeeShiftDTO> updateEmployeeShift(@PathVariable Integer id,@RequestBody EmployeeShiftDTO employeeShiftDto){
        EmployeeShiftDTO employeeShift1 = shiftService.updateEmployeeShift(id,employeeShiftDto);
        if(employeeShift1 != null){
            return new ResponseEntity<>(employeeShift1,HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteEmployeeShift(@PathVariable Integer id){
        EmployeeShiftDTO employeeShift3 = shiftService.getEmployeeShiftById(id);
        if(employeeShift3 != null){
            shiftService.deleteEmployeeShift(id);
            return new ResponseEntity<>("EmployeeShift deleted successfully",HttpStatus.OK);
        }
        return new ResponseEntity<>("EmployeeShift Not found",HttpStatus.NOT_FOUND);
    }
}
