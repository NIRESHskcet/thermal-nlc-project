package com.thermal.nlc;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.jdbc.core.JdbcTemplate;

import com.thermal.nlc.model.Employee;
import com.thermal.nlc.model.EmployeeShift;
import com.thermal.nlc.model.Role;
import com.thermal.nlc.model.Shift;
import com.thermal.nlc.model.Station;
import com.thermal.nlc.model.Unit;
import com.thermal.nlc.model.Users;
import com.thermal.nlc.repository.EmployeeRepo;
import com.thermal.nlc.repository.EmployeeShiftRepo;
import com.thermal.nlc.repository.RoleRepo;
import com.thermal.nlc.repository.ShiftRepo;
import com.thermal.nlc.repository.StationRepo;
import com.thermal.nlc.repository.UnitRepo;
import com.thermal.nlc.repository.UsersRepo;

@SpringBootApplication
public class NlcApplication {

	public static void main(String[] args) {
		SpringApplication.run(NlcApplication.class, args);
	}

	@Bean
	CommandLineRunner seedDatabase(
			RoleRepo roleRepo,
			StationRepo stationRepo,
			UnitRepo unitRepo,
			EmployeeRepo employeeRepo,
			UsersRepo usersRepo,
			ShiftRepo shiftRepo,
			EmployeeShiftRepo employeeShiftRepo,
			JdbcTemplate jdbcTemplate) {
		return args -> {
			// 1. Seed Roles
			List<String> roles = List.of("ADMIN", "HR", "OPERATOR", "ENGINEER", "SUPERVISOR", "TECHNICIAN", "SAFETY_OFFICER");
			for (String roleName : roles) {
				roleRepo.findByNameIgnoreCase(roleName).orElseGet(() -> roleRepo.save(new Role(null, roleName)));
			}
			migrateLegacyRoleColumn(jdbcTemplate, "users");
			migrateLegacyRoleColumn(jdbcTemplate, "employee");

			// Resolve ADMIN role
			Role adminRole = roleRepo.findByNameIgnoreCase("ADMIN")
					.orElseThrow(() -> new IllegalStateException("ADMIN role not found after seeding"));

			// 2. Seed Station
			Station station;
			if (stationRepo.count() == 0) {
				Station newStation = new Station();
				newStation.setStationName("Station Alpha");
				newStation.setLocation("Neyveli");
				newStation.setPrimaryFuelType("Lignite");
				station = stationRepo.save(newStation);
				System.out.println("Seeded Station: " + station.getStationName());
			} else {
				station = stationRepo.findAll().get(0);
			}

			// 3. Seed Unit
			Unit unit;
			if (unitRepo.count() == 0) {
				Unit newUnit = new Unit();
				newUnit.setUnitName("Unit 1");
				newUnit.setCapacityMW("210");
				newUnit.setStation(station);
				unit = unitRepo.save(newUnit);
				System.out.println("Seeded Unit: " + unit.getUnitName());
			} else {
				unit = unitRepo.findAll().get(0);
			}

			// 4. Seed Employee
			Employee employee;
			if (employeeRepo.count() == 0) {
				Employee newEmployee = new Employee();
				newEmployee.setEmployeeCode("EMP001");
				newEmployee.setEmployeeName("John Doe");
				newEmployee.setDepartment("IT");
				newEmployee.setStation(station);
				newEmployee.setUnit(unit);
				newEmployee.setRole(adminRole);
				newEmployee.setPhone("9876543210");
				newEmployee.setEmail("admin@nlc.com");
				newEmployee.setDate(LocalDate.now());
				employee = employeeRepo.save(newEmployee);
				System.out.println("Seeded Employee: " + employee.getEmployeeName());
			} else {
				employee = employeeRepo.findAll().get(0);
			}

			// 5. Seed Users
			Users user;
			if (usersRepo.count() == 0) {
				Users newUser = new Users();
				newUser.setEmployee(employee);
				newUser.setUsername("admin");
				newUser.setEmail("admin@nlc.com");
				newUser.setPassword("Password123");
				newUser.setRole(adminRole);
				newUser.setCreatedAt(LocalDateTime.now());
				user = usersRepo.save(newUser);
				System.out.println("Seeded Admin User: username=admin, password=Password123");

				// Update employee's createdBy reference to self to prevent null
				employee.setCreatedBy(user);
				employeeRepo.save(employee);
			}

			// 6. Seed Shift
			Shift shift;
			if (shiftRepo.count() == 0) {
				Shift newShift = new Shift();
				newShift.setShiftName("Morning");
				newShift.setStartTime(LocalTime.of(6, 0));
				newShift.setEndTime(LocalTime.of(14, 0));
				shift = shiftRepo.save(newShift);
				System.out.println("Seeded Shift: " + shift.getShiftName());
			} else {
				shift = shiftRepo.findAll().get(0);
			}

			// 7. Seed EmployeeShift
			if (employeeShiftRepo.count() == 0) {
				EmployeeShift employeeShift = new EmployeeShift();
				employeeShift.setEmployee(employee);
				employeeShift.setShift(shift);
				employeeShift.setAssignDate(LocalDate.now());
				employeeShiftRepo.save(employeeShift);
				System.out.println("Seeded EmployeeShift assignment.");
			}
		};
	}

	private void migrateLegacyRoleColumn(JdbcTemplate jdbcTemplate, String tableName) {
		try {
			Integer roleColumnCount = jdbcTemplate.queryForObject(
					"SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = 'role'",
					Integer.class,
					tableName);
			Integer roleIdColumnCount = jdbcTemplate.queryForObject(
					"SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = 'role_id'",
					Integer.class,
					tableName);
			if (roleColumnCount != null && roleColumnCount > 0 && roleIdColumnCount != null && roleIdColumnCount > 0) {
				jdbcTemplate.update(
						"UPDATE " + tableName + " t JOIN roles r ON UPPER(t.role) = UPPER(r.name) SET t.role_id = r.id WHERE t.role_id IS NULL AND t.role IS NOT NULL");
			}
		} catch (Exception ignored) {
			// Legacy columns may not exist on fresh databases.
		}
	}
}

