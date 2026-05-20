package com.thermal.nlc.dto;

import java.time.LocalTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ShiftDTO {
    private Integer id;
    private String shiftName;
    private LocalTime startTime;
    private LocalTime endTime;
}
