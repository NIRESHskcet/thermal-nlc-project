package com.thermal.nlc.model;

import java.util.List;


import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Station {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer stationId;
    @OneToMany(mappedBy = "station",cascade = CascadeType.REMOVE)
    private List<Employee> employee;
    @OneToMany(mappedBy = "station",cascade = CascadeType.REMOVE)
    private List<Unit> unit;
    @NotBlank(message = "station name is required")
    private String stationName;
    @NotBlank(message = "location is required")
    private String location = "Neyveli";
    @NotBlank(message = "fuel type is required")
    private String primaryFuelType;

}
