package com.thermal.nlc.dto;

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
    private String stationName;
    private String location;
    private String primaryFuelType;
}
