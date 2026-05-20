package com.thermal.nlc.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.thermal.nlc.dto.UserDTO;
import com.thermal.nlc.exception.EmployeeNotFoundException;
import com.thermal.nlc.model.Employee;
import com.thermal.nlc.model.Role;
import com.thermal.nlc.model.Users;
import com.thermal.nlc.repository.EmployeeRepo;
import com.thermal.nlc.repository.UsersRepo;

@Service
public class UsersService {
    @Autowired
    private UsersRepo userRepo;

    @Autowired
    private EmployeeRepo employeeRepo;

    public UserDTO addUsers(Users user){
        Users u =  userRepo.save(user);
        UserDTO dto = new UserDTO();
        dto.setId(u.getId());
        dto.setEmployeeId(u.getEmployee().getId());
        dto.setUsername(u.getUsername());
        dto.setRole(u.getRole());
        dto.setCreatedAt(u.getCreatedAt());
        return dto;
    }

    public List<UserDTO> getAllUsers(){
        List<Users> user = userRepo.findAll();
        List<UserDTO> dtoList = new ArrayList<>();
        for(Users u : user){
            UserDTO dto = new UserDTO();
            dto.setId(u.getId());
            dto.setEmployeeId(u.getEmployee().getId());
            dto.setUsername(u.getUsername());
            dto.setRole(u.getRole());
            dto.setCreatedAt(u.getCreatedAt());

            dtoList.add(dto);
        }
        return dtoList;
    }
    public UserDTO getUserById(Integer id){
        Users u = userRepo.findById(id).orElseThrow(() -> new EmployeeNotFoundException("User not found with id "+id));
        UserDTO dto = new UserDTO();
        dto.setId(u.getId());
        dto.setEmployeeId(u.getEmployee().getId());
        dto.setUsername(u.getUsername());
        dto.setRole(u.getRole());
        dto.setCreatedAt(u.getCreatedAt());
        return dto;
    }

    public List<UserDTO> searchUser(String keyword){
        List<Users> user = userRepo.searchUser(keyword);
        List<UserDTO> dtoList = new ArrayList<>();
        for(Users u : user){
            UserDTO dto = new UserDTO();
            dto.setId(u.getId());
            dto.setEmployeeId(u.getEmployee().getId());
            dto.setUsername(u.getUsername());
            dto.setRole(u.getRole());
            dto.setCreatedAt(u.getCreatedAt());

            dtoList.add(dto);
        }
        return dtoList;
    }

    public List<UserDTO> findByRole(Role role){
        List<Users> user = userRepo.findByRole(role);
        List<UserDTO> dtoList = new ArrayList<>();
        for(Users u : user){
            UserDTO dto = new UserDTO();
            dto.setId(u.getId());
            dto.setEmployeeId(u.getEmployee().getId());
            dto.setUsername(u.getUsername());
            dto.setRole(u.getRole());
            dto.setCreatedAt(u.getCreatedAt());

            dtoList.add(dto);
        }
        return dtoList;
    }
    
    public UserDTO findUserByEmployeeId(Integer employeeId){
        Users u = userRepo.findByEmployee_Id(employeeId);
        UserDTO dto = new UserDTO();
        dto.setId(u.getId());
        dto.setEmployeeId(u.getEmployee().getId());
        dto.setUsername(u.getUsername());
        dto.setRole(u.getRole());
        dto.setCreatedAt(u.getCreatedAt());
        return dto;
    }
    
    public UserDTO updateUsers(Integer id,UserDTO userDto){
        Users existing = userRepo.findById(id).orElseThrow(() -> new EmployeeNotFoundException("User not found with id "+id));
        BeanUtils.copyProperties(userDto, existing);
        Employee employee = employeeRepo.findById(userDto.getEmployeeId()).orElse(null);
        existing.setEmployee(employee);
        userRepo.save(existing);
        UserDTO response = new UserDTO();
        BeanUtils.copyProperties(existing, response);
        response.setEmployeeId(existing.getEmployee().getId());
        return response;
    }

    public void deleteUser(Integer id){
        userRepo.deleteById(id);
    }

}
