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

import com.thermal.nlc.dto.UserDTO;
import com.thermal.nlc.model.Users;
import com.thermal.nlc.service.UsersService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/users")
public class UsersController {
    @Autowired
    private UsersService userService;

    @PostMapping
    public ResponseEntity<UserDTO> addUsers(@Valid @RequestBody Users user){
        return new ResponseEntity<>(userService.addUsers(user),HttpStatus.ACCEPTED);
    }

    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers(){
        return new ResponseEntity<>(userService.getAllUsers(),HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Integer id){
        return new ResponseEntity<>(userService.getUserById(id),HttpStatus.OK);
    }

    @GetMapping("/search")
    public ResponseEntity<List<UserDTO>> searchUser(@RequestParam String keyword){
        return new ResponseEntity<>(userService.searchUser(keyword),HttpStatus.OK);
    }

    @GetMapping("/role/{role}")
    public ResponseEntity<List<UserDTO>> findByRole(@PathVariable String role){
        return new ResponseEntity<>(userService.findByRole(role),HttpStatus.OK);
    }

    @GetMapping("/employeeId/{employeeId}")
    public ResponseEntity<UserDTO> findUserByEmployeeId(@PathVariable Integer employeeId){
        return new ResponseEntity<>(userService.findUserByEmployeeId(employeeId),HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> updateUsers(@PathVariable Integer id,@Valid @RequestBody UserDTO userDto){
        UserDTO user2 = userService.getUserById(id);
        if(user2 != null){
            return new ResponseEntity<>(userService.updateUsers(id,userDto),HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Integer id){
        UserDTO user3 = userService.getUserById(id);
        if(user3 != null){
            userService.deleteUser(id);
            return new ResponseEntity<>("User deleted successfully",HttpStatus.OK);
        } 
        return new ResponseEntity<>("Couldn't find user with id "+id,HttpStatus.NOT_FOUND);
    }
}
