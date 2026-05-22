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

import com.thermal.nlc.dto.StationDTO;
import com.thermal.nlc.model.Station;
import com.thermal.nlc.service.StationService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/station")
public class StationController {
    @Autowired
    private StationService stationService;
    @PostMapping
    public ResponseEntity<StationDTO> addStation(@Valid @RequestBody Station station){
        return new ResponseEntity<>(stationService.addStation(station),HttpStatus.ACCEPTED);
    }

    @GetMapping
    public ResponseEntity<List<StationDTO>> getAllStation(){
        return new ResponseEntity<>(stationService.getAllStation(),HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<StationDTO> getStationById(@PathVariable Integer id){
        StationDTO station = stationService.getStationById(id);
        if(station != null){
            return new ResponseEntity<>(station,HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @GetMapping("/search")
    public ResponseEntity<List<StationDTO>> searchStation(@RequestParam String keyword){
        return new ResponseEntity<>(stationService.searchStation(keyword),HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<StationDTO> updateStation(@PathVariable Integer id,@Valid @RequestBody StationDTO stationDto){
        StationDTO station2 = stationService.getStationById(id);
        if(station2 != null){
            return new ResponseEntity<>(stationService.updateStation(id,stationDto),HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<String> deleteStation(@PathVariable Integer id){
        StationDTO station3 = stationService.getStationById(id);
        if(station3 != null){
            stationService.deleteStation(id);
            return new ResponseEntity<>("Station deleted successfully",HttpStatus.OK);
        }
        return new ResponseEntity<>("Couldn't find with id"+id,HttpStatus.NOT_FOUND);        
    }
}
