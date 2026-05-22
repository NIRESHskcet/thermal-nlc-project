package com.thermal.nlc.model;

import java.util.List;


import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Unit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer unitId;
    @OneToMany(mappedBy = "unit",cascade = CascadeType.REMOVE)
    private List<Employee> employee;
    @ManyToOne
    @JoinColumn(name = "station_id")
    @NotNull(message = "station id is required")
    private Station station;
    @NotBlank(message = "unit name is required")
    @Column(nullable = false, unique = true)
    private String unitName;
    @NotBlank(message = "capacity is required")
    private String capacityMW;
    
}
