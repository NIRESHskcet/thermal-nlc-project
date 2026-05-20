package com.thermal.nlc.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.thermal.nlc.dto.EmployeeShiftDTO;
import com.thermal.nlc.exception.EmployeeShiftNotFoundException;
import com.thermal.nlc.model.Employee;
import com.thermal.nlc.model.EmployeeShift;
import com.thermal.nlc.model.Shift;
import com.thermal.nlc.repository.EmployeeRepo;
import com.thermal.nlc.repository.EmployeeShiftRepo;
import com.thermal.nlc.repository.ShiftRepo;

@Service
public class EmployeeShiftService {
    @Autowired
    private EmployeeShiftRepo shiftRepo;
    
    @Autowired
    private EmployeeRepo employeeRepo;

    @Autowired
    private ShiftRepo shift_Repo;

    public EmployeeShiftDTO addEmployeeShift(EmployeeShift shift){
        EmployeeShift es =  shiftRepo.save(shift);
        EmployeeShiftDTO dto = new EmployeeShiftDTO();
        dto.setId(es.getId());
        dto.setEmployeeId(es.getEmployee().getId());
        dto.setEmployeeName(es.getEmployee().getEmployeeName());
        dto.setShiftId(es.getShift().getId());
        dto.setShiftName(es.getShift().getShiftName());
        dto.setAssignDate(es.getAssignDate());
        return dto;
    }

    public List<EmployeeShiftDTO> getAllEmployeeShift(){
        List<EmployeeShift> shift = shiftRepo.findAll();
        List<EmployeeShiftDTO> dtoList = new ArrayList<>();
        for(EmployeeShift es : shift){
            EmployeeShiftDTO dto = new EmployeeShiftDTO();
            dto.setId(es.getId());
            dto.setEmployeeId(es.getEmployee().getId());
            dto.setEmployeeName(es.getEmployee().getEmployeeName());
            dto.setShiftId(es.getShift().getId());
            dto.setShiftName(es.getShift().getShiftName());
            dto.setAssignDate(es.getAssignDate());

            dtoList.add(dto);

        }
        return dtoList;
    }

    public List<EmployeeShiftDTO> searchEmployeeShift(String keyword){
        List<EmployeeShift> shift2 =  shiftRepo.searchEmployeeShift(keyword);
        List<EmployeeShiftDTO> dtoList = new ArrayList<>();
        for(EmployeeShift es : shift2){
            EmployeeShiftDTO dto = new EmployeeShiftDTO();
            dto.setId(es.getId());
            dto.setEmployeeId(es.getEmployee().getId());
            dto.setEmployeeName(es.getEmployee().getEmployeeName());
            dto.setShiftId(es.getShift().getId());
            dto.setShiftName(es.getShift().getShiftName());
            dto.setAssignDate(es.getAssignDate());

            dtoList.add(dto);

        }
        return dtoList;
    }

    public EmployeeShiftDTO getEmployeeShiftById(Integer id){
        EmployeeShift shift = shiftRepo.findById(id).orElseThrow(() ->  new EmployeeShiftNotFoundException("EmployeeShift not found with id "+id));
        EmployeeShiftDTO dto = new EmployeeShiftDTO();
        dto.setId(shift.getId());
        dto.setEmployeeId(shift.getEmployee().getId());
        dto.setEmployeeName(shift.getEmployee().getEmployeeName());
        dto.setShiftId(shift.getShift().getId());
        dto.setShiftName(shift.getShift().getShiftName());
        dto.setAssignDate(shift.getAssignDate());
        return dto;
    }

    public List<EmployeeShiftDTO> getEmployeeShiftByEmployeeId(Integer employeeId){
        List<EmployeeShift> shift2 = shiftRepo.findByEmployee_Id(employeeId);
        List<EmployeeShiftDTO> dtoList = new ArrayList<>();
        for(EmployeeShift es : shift2){
            EmployeeShiftDTO dto = new EmployeeShiftDTO();
            dto.setId(es.getId());
            dto.setEmployeeId(es.getEmployee().getId());
            dto.setEmployeeName(es.getEmployee().getEmployeeName());
            dto.setShiftId(es.getShift().getId());
            dto.setShiftName(es.getShift().getShiftName());
            dto.setAssignDate(es.getAssignDate());

            dtoList.add(dto);

        }
        return dtoList;
    }
    
    public List<EmployeeShiftDTO> getEmployeeShiftByShiftId(Integer shiftId){
        List<EmployeeShift> shift2 = shiftRepo.findByShift_Id(shiftId);
        List<EmployeeShiftDTO> dtoList = new ArrayList<>();
        for(EmployeeShift es : shift2){
            EmployeeShiftDTO dto = new EmployeeShiftDTO();
            dto.setId(es.getId());
            dto.setEmployeeId(es.getEmployee().getId());
            dto.setEmployeeName(es.getEmployee().getEmployeeName());
            dto.setShiftId(es.getShift().getId());
            dto.setShiftName(es.getShift().getShiftName());
            dto.setAssignDate(es.getAssignDate());

            dtoList.add(dto);

        }
        return dtoList;
    }

    public EmployeeShiftDTO updateEmployeeShift(Integer id,EmployeeShiftDTO employeeShiftDto){
        EmployeeShift existing = shiftRepo.findById(id).orElseThrow(() -> new EmployeeShiftNotFoundException("EmployeeShift not found with id "+id));
        BeanUtils.copyProperties(employeeShiftDto, existing);
        Employee employee = employeeRepo.findById(employeeShiftDto.getEmployeeId()).orElse(null);
        Shift shift = shift_Repo.findById(employeeShiftDto.getShiftId()).orElse(null);
        existing.setEmployee(employee);
        existing.setShift(shift);
        EmployeeShift updated = shiftRepo.save(existing);
        EmployeeShiftDTO response = new EmployeeShiftDTO();
        BeanUtils.copyProperties(updated, response);
        response.setEmployeeId(updated.getEmployee().getId());
        response.setShiftId(updated.getShift().getId());
        response.setEmployeeName(updated.getEmployee().getEmployeeName());
        response.setShiftName(updated.getShift().getShiftName());
        return response;
    }

    public void deleteEmployeeShift(Integer id){
        shiftRepo.deleteById(id);
    }
}
