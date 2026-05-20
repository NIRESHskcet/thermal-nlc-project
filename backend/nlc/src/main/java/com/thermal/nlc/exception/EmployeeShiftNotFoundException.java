package com.thermal.nlc.exception;

public class EmployeeShiftNotFoundException extends RuntimeException{
    public EmployeeShiftNotFoundException(String message){
        super(message);
    }
}
