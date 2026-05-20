package com.thermal.nlc.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.thermal.nlc.dto.ShiftDTO;
import com.thermal.nlc.exception.ShiftNotFoundException;
import com.thermal.nlc.model.Shift;
import com.thermal.nlc.repository.ShiftRepo;

@Service
public class ShiftService {

    @Autowired
    private ShiftRepo shiftRepo;

    public ShiftDTO addShift(Shift shift){
        Shift s = shiftRepo.save(shift);
        ShiftDTO dto = new ShiftDTO();
        dto.setId(s.getId());
        dto.setShiftName(s.getShiftName());
        dto.setStartTime(s.getStartTime());
        dto.setEndTime(s.getEndTime());
        return dto;
    }

    public List<ShiftDTO> getAllShift(){
        List<Shift> shift =  shiftRepo.findAll();
        List<ShiftDTO> dtoList = new ArrayList<>();
        for(Shift s : shift){
            ShiftDTO dto = new ShiftDTO();
            dto.setId(s.getId());
            dto.setShiftName(s.getShiftName());
            dto.setStartTime(s.getStartTime());
            dto.setEndTime(s.getEndTime());

            dtoList.add(dto);
        }
        return dtoList;
    }

    public ShiftDTO getShiftById(Integer id){
        Shift s =  shiftRepo.findById(id).orElseThrow(() -> new ShiftNotFoundException("Shift not found with id "+id));
        ShiftDTO dto = new ShiftDTO();
        dto.setId(s.getId());
        dto.setShiftName(s.getShiftName());
        dto.setStartTime(s.getStartTime());
        dto.setEndTime(s.getEndTime());
        return dto;
    }

    public List<ShiftDTO> searchShift(String keyword){
        List<Shift> shift = shiftRepo.searchShift(keyword);
        List<ShiftDTO> dtoList = new ArrayList<>();
        for(Shift s : shift){
            ShiftDTO dto = new ShiftDTO();
            dto.setId(s.getId());
            dto.setShiftName(s.getShiftName());
            dto.setStartTime(s.getStartTime());
            dto.setEndTime(s.getEndTime());

            dtoList.add(dto);
        }
        return dtoList;
    }

    public ShiftDTO updateShift(ShiftDTO shiftDto,Integer id){
        Shift existing = shiftRepo.findById(id).orElseThrow(() -> new ShiftNotFoundException("Shift not found with id "+id));
        BeanUtils.copyProperties(shiftDto, existing);
        shiftRepo.save(existing);
        ShiftDTO response = new ShiftDTO();
        BeanUtils.copyProperties(existing, response);
        return response;
    }

    public void deleteShift(Integer id){
        shiftRepo.deleteById(id);
    }
}
