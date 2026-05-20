package com.thermal.nlc.exception;

public class StationNotFoundException extends RuntimeException{
    public StationNotFoundException(String message){
        super(message);
    }
}
