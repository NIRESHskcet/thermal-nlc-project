package com.thermal.nlc.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.thermal.nlc.dto.UnitDTO;
import com.thermal.nlc.exception.DuplicateResourceException;
import com.thermal.nlc.exception.UnitNotFoundException;
import com.thermal.nlc.model.Station;
import com.thermal.nlc.model.Unit;
import com.thermal.nlc.repository.StationRepo;
import com.thermal.nlc.repository.UnitRepo;

@Service
public class UnitService {
    @Autowired
    private UnitRepo unitRepo;

    @Autowired
    private StationRepo stationRepo;

    public UnitDTO addUnit(Unit unit){
        validateUnitName(unit.getUnitName(), unit.getStation() != null ? unit.getStation().getStationId() : null, null);
        Unit u = unitRepo.save(unit);
        UnitDTO dto = new UnitDTO();
        dto.setUnitId(u.getUnitId());
        dto.setStationName(u.getStation().getStationName());
        dto.setStationId(u.getStation().getStationId());
        dto.setUnitName(u.getUnitName());
        dto.setCapacityMW(u.getCapacityMW());
        return dto;
    }

    public List<UnitDTO> getAllUnit(){
        List<Unit> unit = unitRepo.findAll();
        List<UnitDTO> dtoList = new ArrayList<>();
        for(Unit u : unit){
            UnitDTO dto = new UnitDTO();
            dto.setUnitId(u.getUnitId());
            dto.setStationId(u.getStation().getStationId());
            dto.setStationName(u.getStation().getStationName());
            dto.setUnitName(u.getUnitName());
            dto.setCapacityMW(u.getCapacityMW());

            dtoList.add(dto);
        }
        return dtoList;
    }

    public UnitDTO getUnitById(Integer id){
        Unit u = unitRepo.findById(id).orElseThrow(() -> new UnitNotFoundException("Unit not found with id "+id));
        UnitDTO dto = new UnitDTO();
        dto.setUnitId(u.getUnitId());
        dto.setStationId(u.getStation().getStationId());
        dto.setStationName(u.getStation().getStationName());
        dto.setUnitName(u.getUnitName());
        dto.setCapacityMW(u.getCapacityMW());
        return dto;
    }

    public List<UnitDTO> getUnitByStationId(Integer stationId){
        List<Unit> unit = unitRepo.findByStation_StationId(stationId);
        List<UnitDTO> dtoList = new ArrayList<>();
        for(Unit u : unit){
            UnitDTO dto = new UnitDTO();
            dto.setUnitId(u.getUnitId());
            dto.setStationId(u.getStation().getStationId());
            dto.setStationName(u.getStation().getStationName());
            dto.setUnitName(u.getUnitName());
            dto.setCapacityMW(u.getCapacityMW());

            dtoList.add(dto);
        }
        return dtoList; 
    }

    public List<UnitDTO> searchUnit(String keyword){
        List<Unit> unit = unitRepo.searchUnit(keyword);
        List<UnitDTO> dtoList = new ArrayList<>();
        for(Unit u : unit){
            UnitDTO dto = new UnitDTO();
            dto.setUnitId(u.getUnitId());
            dto.setStationId(u.getStation().getStationId());
            dto.setStationName(u.getStation().getStationName());
            dto.setUnitName(u.getUnitName());
            dto.setCapacityMW(u.getCapacityMW());

            dtoList.add(dto);
        }
        return dtoList;
    }
    
    public UnitDTO updateUnit(Integer id,UnitDTO unitDto){
        Unit existing = unitRepo.findById(id).orElseThrow(() -> new UnitNotFoundException("Unit not found with id "+id));
        Station station = stationRepo.findById(unitDto.getStationId())
            .orElseThrow(() -> new UnitNotFoundException("Station not found with id "+unitDto.getStationId()));
        validateUnitName(unitDto.getUnitName(), unitDto.getStationId(), id);
        existing.setStation(station);
        existing.setUnitName(unitDto.getUnitName());
        existing.setCapacityMW(unitDto.getCapacityMW());
        unitRepo.save(existing);
        UnitDTO response = new UnitDTO();
        BeanUtils.copyProperties(existing, response);
        response.setStationName(existing.getStation().getStationName());
        response.setStationId(existing.getStation().getStationId());
        return response;
    }

    public void deleteUnit(Integer id){
        Unit existing = unitRepo.findById(id).orElseThrow(() -> new UnitNotFoundException("Unit not found with id "+id));
        unitRepo.delete(existing);
    }

    private void validateUnitName(String unitName, Integer stationId, Integer unitId) {
        boolean duplicate = unitId == null
            ? unitRepo.existsByUnitNameIgnoreCase(unitName)
            : unitRepo.existsByUnitNameIgnoreCaseAndUnitIdNot(unitName, unitId);
        if (duplicate) {
            throw new DuplicateResourceException("Unit name already exists: " + unitName);
        }
    }
}
