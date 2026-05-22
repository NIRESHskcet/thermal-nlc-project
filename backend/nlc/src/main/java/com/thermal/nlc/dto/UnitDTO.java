package com.thermal.nlc.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
    @NotNull(message = "station id is required")
    private Integer stationId;
    private String stationName;
    @NotBlank(message = "unit name is required")
    private String unitName;
    @NotBlank(message = "capacity is required")
    private String capacityMW;
}
