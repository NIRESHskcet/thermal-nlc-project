package com.thermal.nlc.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StationDTO {
    private Integer stationId;
    @NotBlank(message = "station name is required")
    private String stationName;
    @NotBlank(message = "location is required")
    private String location;
    @NotBlank(message = "primary fuel type is required")
    private String primaryFuelType;
}
