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

import com.thermal.nlc.dto.UnitDTO;
import com.thermal.nlc.model.Unit;
import com.thermal.nlc.service.UnitService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/unit")
public class UnitController {
    @Autowired
    private UnitService unitService;

    @PostMapping
    public ResponseEntity<UnitDTO> addUnit(@Valid @RequestBody Unit unit){
        return new ResponseEntity<>(unitService.addUnit(unit),HttpStatus.ACCEPTED);
    }

    @GetMapping
    public ResponseEntity<List<UnitDTO>> getAllUnit(){
        return new ResponseEntity<>(unitService.getAllUnit(),HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UnitDTO> getUnitById(@PathVariable Integer id){
        UnitDTO unit = unitService.getUnitById(id);
        if(unit!=null){
            return new ResponseEntity<>(unit,HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    
    @GetMapping("stationId/{stationId}")
    public ResponseEntity<List<UnitDTO>> getUnitByStationId(@PathVariable Integer stationId){
        return new ResponseEntity<>(unitService.getUnitByStationId(stationId),HttpStatus.OK);
    }

    @GetMapping("/search")
    public ResponseEntity<List<UnitDTO>> searchUnit(@RequestParam String keyword){
        return new ResponseEntity<>(unitService.searchUnit(keyword),HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UnitDTO> updateUnit(@PathVariable Integer id,@Valid @RequestBody UnitDTO unitDto){
        UnitDTO unit2 = unitService.getUnitById(id);
        if(unit2 != null){
            return new ResponseEntity<>(unitService.updateUnit(id,unitDto),HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUnit(@PathVariable Integer id){
        UnitDTO unit3 = unitService.getUnitById(id);
        if(unit3 != null){
            unitService.deleteUnit(id);
            return new ResponseEntity<>("Unit deleted Successfully",HttpStatus.OK);
        }
        return new ResponseEntity<>("couldn't find with id "+id,HttpStatus.NOT_FOUND);
        
    }
}
