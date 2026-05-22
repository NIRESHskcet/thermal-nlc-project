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

import com.thermal.nlc.dto.ShiftDTO;
import com.thermal.nlc.model.Shift;
import com.thermal.nlc.service.ShiftService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/shift")
public class ShiftController {
    @Autowired
    private ShiftService shiftService;

    @PostMapping
    public ResponseEntity<ShiftDTO> addShift(@Valid @RequestBody Shift shift){
        return new ResponseEntity<>(shiftService.addShift(shift),HttpStatus.ACCEPTED);
    }

    @GetMapping
    public ResponseEntity<List<ShiftDTO>> getAllShift(){
        return new ResponseEntity<>(shiftService.getAllShift(),HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ShiftDTO> getShiftById(@PathVariable Integer id){
        ShiftDTO shift = shiftService.getShiftById(id);
        if(shift != null){
            return new ResponseEntity<>(shift,HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @GetMapping("/search")
    public ResponseEntity<List<ShiftDTO>> searchShift(@RequestParam String keyword){
        return new ResponseEntity<>(shiftService.searchShift(keyword),HttpStatus.OK);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ShiftDTO> updateShift(@Valid @RequestBody ShiftDTO shiftDto,@PathVariable Integer id){
        ShiftDTO shift2 = shiftService.updateShift(shiftDto,id);
        if(shift2 != null){
            return new ResponseEntity<>(shift2,HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteShift(@PathVariable Integer id){
        ShiftDTO shift3 = shiftService.getShiftById(id);
        if(shift3 != null){
            shiftService.deleteShift(id);
            return new ResponseEntity<>("Shift deleted successfully",HttpStatus.OK);
        }
        return new ResponseEntity<>("Shift Not Found",HttpStatus.NOT_FOUND);
    }
}
