package com.thermal.nlc.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.thermal.nlc.dto.StationDTO;
import com.thermal.nlc.exception.StationNotFoundException;
import com.thermal.nlc.model.Station;
import com.thermal.nlc.repository.StationRepo;

@Service
public class StationService {

    @Autowired
    private StationRepo stationRepo;

    public StationDTO addStation(Station station){
        Station s = stationRepo.save(station);
        StationDTO dto = new StationDTO();
        dto.setStationId(s.getStationId());;
        dto.setStationName(s.getStationName());
        dto.setLocation(s.getLocation());
        dto.setPrimaryFuelType(s.getPrimaryFuelType());
        return dto;
    }

    public List<StationDTO> getAllStation(){
        List<Station> station = stationRepo.findAll();
        List<StationDTO> dtoList = new ArrayList<>();
        for(Station s : station){
            StationDTO dto = new StationDTO();
            dto.setStationId(s.getStationId());;
            dto.setStationName(s.getStationName());
            dto.setLocation(s.getLocation());
            dto.setPrimaryFuelType(s.getPrimaryFuelType());
            
            dtoList.add(dto);
        }
        return dtoList;
    }

    public StationDTO getStationById(Integer id){
        Station s = stationRepo.findById(id).orElseThrow(() -> new StationNotFoundException("Station not found with id "+id));
        StationDTO dto = new StationDTO();
        dto.setStationId(s.getStationId());;
        dto.setStationName(s.getStationName());
        dto.setLocation(s.getLocation());
        dto.setPrimaryFuelType(s.getPrimaryFuelType());
        return dto;
    }

    public List<StationDTO> searchStation(String keyword){
        List<Station> station = stationRepo.searchStation(keyword);
        List<StationDTO> dtoList = new ArrayList<>();
        for(Station s : station){
            StationDTO dto = new StationDTO();
            dto.setStationId(s.getStationId());;
            dto.setStationName(s.getStationName());
            dto.setLocation(s.getLocation());
            dto.setPrimaryFuelType(s.getPrimaryFuelType());
            
            dtoList.add(dto);
        }
        return dtoList;
    }

    public StationDTO updateStation(Integer id,StationDTO stationDto){
        Station existing = stationRepo.findById(id).orElseThrow(() -> new StationNotFoundException("Station not found with id "+id));
        BeanUtils.copyProperties(stationDto, existing);
        stationRepo.save(existing);
        StationDTO response = new StationDTO();
        BeanUtils.copyProperties(existing, response);
        return response; 
    }

    public void deleteStation(Integer id){
        stationRepo.deleteById(id);
    }
}
