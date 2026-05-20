package com.thermal.nlc.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UnitDTO {
    private Integer unitId;
    private Integer stationId;
    private String stationName;
    private String unitName;
    private String capacityMW;
}
