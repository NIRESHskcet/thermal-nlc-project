package com.thermal.nlc.dto;

import java.time.LocalTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
    @NotBlank(message = "shift name is required")
    private String shiftName;
    @NotNull(message = "start time is required")
    private LocalTime startTime;
    @NotNull(message = "end time is required")
    private LocalTime endTime;
}
